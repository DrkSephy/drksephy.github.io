---
layout: post
title: Exploring Genetic Algorithms
subtitle: "Applying Genetic Algorithms to variants of the Subset Sum Problem"
date: 2015-11-28
tags: [Post]
author: "David Leonard"
header-img: "img/genetics.jpg"
---

In my Artificial Intelligence class, we were given a project in which we had to use <a style="color:#1faa9b" href="https://en.wikipedia.org/wiki/Genetic_algorithm">Genetic Algorithms</a> in order to solve the following problem:

<blockquote>Develop a Genetic Algorithm (GA) to solve the following problem: Given a list of n distinct positive integers, partition the list into two sublists, each of size n/2, such that the difference between the sums of the integers in the two sublists is minimized. To obtain your initial list, use a linear congruential random number generator to generate 100 random integers between 1 and 10,000.</blockquote>

After a closer observation of the problem, it turns out that it is actually a variant of the <a style="color:#1faa9b" href="https://en.wikipedia.org/wiki/Subset_sum_problem">Subset Sum</a> problem, known as the <a style="color:#1faa9b" href="https://en.wikipedia.org/wiki/Partition_problem">Partition Problem</a>. In the **Partition Problem**, the goal is that given a set of numbers, we want to partition these numbers into two sets *S<sub>1</sub>* and *S<sub>2</sub>* such that the sums of these two sets are equal. In particular, we explore the **optimization variant** of the Partition Problem in which we want to mimimize the differences in sums of these two sets (which is known to be <a style="color:#1faa9b" href="https://en.wikipedia.org/wiki/NP-hardness">NP-Hard</a>) using a Genetic Algorithm. 

## Problem Representation

Genetic Algorithms consist of various operators known as <a style="color:#1faa9b" href="https://en.wikipedia.org/wiki/Selection_(genetic_algorithm)">Selection</a>, <a style="color:#1faa9b" href="https://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)">Crossover</a> and <a style="color:#1faa9b" href="https://en.wikipedia.org/wiki/Mutation_(genetic_algorithm)">Mutation</a>. These operators take binary strings as input, so we'll need to come up with a representation for our problem in terms of binary strings. Since we have two subsets whose difference in sums needs to be minimized, we'll generate an initial population of 20 binary strings each consisting of 50 zeroes and ones, <b>where zeroes correspond to *"this number will belong to S<sub>1</sub>"*</b> while <b>ones correspond to *"this number will belong to S<sub>2</sub>"*</b>.

<blockquote><b>Problem Invariant</b>: Due to the problem specifying that each subset must contain n/2 integers, meaning that all of our genetic operators must result in strings containing an equal number of zeroes and ones.</blockquote>

For each binary value within each binary string, we'll partition numbers in our master set *S* into their respective subsets *S<sub>1</sub>* and *S<sub>2</sub>*. Speaking of our list of integers, we'll go over how to implement the <a style="color:#1faa9b" href="https://en.wikipedia.org/wiki/Linear_congruential_generator">Linear Congruential Generator</a> to obtain our initial list of 100 unique, random integers. 

## Implementing a Linear Congruential Generator

A <a style="color:#1faa9b" href="https://en.wikipedia.org/wiki/Linear_congruential_generator">Linear Congruential Generator</a> is a very simple algorithm for generating <a style="color:#1faa9b" href="https://en.wikipedia.org/wiki/Pseudorandom_number_generator">pseudo-randomized</a> numbers. Due to the nature of pseudo-randomized numbers, their sequence is determined by their initial values. In order to generate a list of 100 unique random integers between 1 and 10,000, we will need to choose the parameters of our Linear Congruential Generator wisely. 

By selecting the parameters *m*, *a*, *c* and the *seed* of the recurrence relation carefully, we can guarantee that the period will be long enough such that our numbers will be unique. In order to generate numbers up to 10,000, we specify our modulus *m* to be equal to 10,000 - which will also assist in generating unique integers by having our value of *c* to be <a style="color:#1faa9b" href="https://en.wikipedia.org/wiki/Coprime_integers">relatively prime to each other</a>. While there are two other conditions for having a maximal period, this alone will suffice for generating our initial sequence of integers. The implementation of the Linear Congruential Generator is shown below:

{% highlight python %}

def linearCongruentialGenerator(self, seed, count, a, c, m):
	numbers = []
	for i in xrange(count):
		seed = (a * seed + c) % m
		numbers.append(seed)
	return numbers

{% endhighlight %}

And we generate our initial list with the following function call:

{% highlight python %}

# Generate a list of 100 integers using an LCG
self.list = self.linearCongruentialGenerator(5, 100, 3, 2, 10000)

{% endhighlight %}

Due to the nature of pseudo-random number generators, the above configuration will always return the same list, whose output is:

{% highlight python %}

> [17, 53, 161, 485, 1457, 4373, 3121, 9365, 8097, 4293, 2881, 8645, 5937, 7813, 3441, 325, 977, 2933, 8801, 6405, 9217, 7653, 2961, 8885, 6657, 9973, 9921, 9765, 9297, 7893, 3681, 1045, 3137, 9413, 8241, 4725, 4177, 2533, 7601, 2805, 8417, 5253, 5761, 7285, 1857, 5573, 6721, 165, 497, 1493, 4481, 3445, 337, 1013, 3041, 9125, 7377, 2133, 6401, 9205, 7617, 2853, 8561, 5685, 7057, 1173, 3521, 565, 1697, 5093, 5281, 5845, 7537, 2613, 7841, 3525, 577, 1733, 5201, 5605, 6817, 453, 1361, 4085, 2257, 6773, 321, 965, 2897, 8693, 6081, 8245, 4737, 4213, 2641, 7925, 3777, 1333, 4001, 2005]

{% endhighlight %}

Despite this, having a consistent initial list will allow us to accurately measure the performance of our Genetic Algorithm at the end. If there is a need for different numbers in the future, we can always adjust *a* and *c* appropriately. With our initial list generated, we move onto determining how to assign values to the binary strings in our population in order to measure how well they solve our problem. 

##  Fitness Functions

In Genetic Algorithms, we need some method of assigning values to binary strings which correspond to how well they solve the problem. In our case, we want to assign binary strings that have the smallest difference in sums between our sets higher <a style="color:#1faa9b" href="https://en.wikipedia.org/wiki/Fitness_(biology)">fitness</a> - meaning that these strings more closely solve our minimization problem. 

In order to compute a fitness value for each of our binary strings, we'll have to finally partition our list of values corresponding to each binary string in our population. Below is a method for doing so:

{% highlight python %}

def partition(self):
	population = []
	for gene in self.population:
		subsetOne = []
		subsetTwo = []
		subset = []
		for (i, chromosome) in enumerate(gene):
			if chromosome == '0':
				subsetOne.append(self.list[i])
			if chromosome == '1':
				subsetTwo.append(self.list[i])
		subset.append(subsetOne)
		subset.append(subsetTwo)
		population.append(subset)
	self.numericalPopulation = population
	return

{% endhighlight %}

In this method, we loop over each binary string in our population and put them in *S<sub>1</sub>* if the binary value is zero or into *S<sub>2</sub>* if the binary value is 1. At the end of this, we'll have numerical representations corresponding to permutations of our list of numbers generated by our Linear Congruential Generator. Next, we implement our method to assign fitness values to each of these numerical representations which is shown below:

{% highlight python %}

def fitnessAssessment(self, population):
	# Store differgences between each gene
	differences = []
	
	# Compute differences between each gene
	for gene in population:
		difference = abs(sum(gene[0]) - sum(gene[1]))
		differences.append(difference)
	
	# Sort list of differences in ascending order
	sortedDifferences = sorted(differences)
	
	# Assign fitness to each gene based on how many 
	# other members a gene is less than
	for (position, difference) in enumerate(sortedDifferences):
		fitness = len(sortedDifferences) - position - 1
		# Append fitness of gene to a fitness list
		self.populationFitness.append(fitness)
		# Store fitness:difference 
		self.frequency[fitness] = difference
	return

{% endhighlight %}

In this method, we compute the difference in sums between our two subsets and then sort the values. As mentioned above, we assign a higher fitness value to the strings corresponding to smaller differences, and therefore the numbers at the beginning of our sorted list will have the highest fitness values. Since our initial population consists of 20 binary strings, the first member in our sorted list will have a fitness of 19, meaning that this value is less than 19 other values in this population. With our fitness values in place, we move onto implementing our genetic operators. 

## Selection

At each iteration of our genetic algorithm, we will select a certain amount of strings from our initial population which will be used to breed the new generation of strings. In order to do so, we need some way of selecting these strings based on their fitness values. While it may seem beneficial to only keep the strings which have the largest fitness values, this may actually lead to our algorithm getting stuck at local minimums and therefore will never truly converge. In order to fairly select strings based on their fitness values, we will implement the <a style="color:#1faa9b" href="https://en.wikipedia.org/wiki/Fitness_proportionate_selection">roulette wheel</a> selection method. 

{% highlight python %}

def selection(self, population):	
	# Compute total fitness of population
	totalFitness = 0
	for key in self.frequency:
		totalFitness += key

	# Compute weighted fitnesses
	weightedFitness = [float(key) / float(totalFitness) for key in self.frequency]

	# Generate probability intervals
	probabilities = [round(sum(weightedFitness[:i + 1]) * 100, 2) for i in range(len(weightedFitness))]

	# Select an individual using weighted probabilities		
	probability = random.uniform(0, 100)
	for (n, individual) in enumerate(population):
		if probability <= probabilities[n]:
			return individual

{% endhighlight %}

Here, we compute the total fitness of our current population. Using this, we can compute a weighed fitness for each string in our population proportional to the total fitness of the population. With this, we can assign probabilities to each of our strings - where the probability for each string to be selected is proportional to their fitness values relative to the entire population. We then generate a random float between 0 and 100 and use this to select one string from our current population which will be used to generate the new generation. 

## Crossover

In Crossover, we select two strings from our current population and use them to generate two children to form the new generation. Each of these children will have a certain amount of "genetic material" from each parent, which should theoretically generate new generations which have closer and closer fitness values that solve our problem better. While there are several crossover methods, we'll use the simple <a style="color:#1faa9b" href="https://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)">One-point crossover</a> method which is implemented below:

{% highlight python %}

def crossover(self, count):
	newGeneration = []
	while len(newGeneration) < count:
		parentOne = self.selection(self.population)
		parentTwo = self.selection(self.population)
		successfulFirstChild = False
		successfulSecondChild = False
		while successfulFirstChild == False and successfulSecondChild == False:
			# Get a random crossover point
			crossoverPoint = random.randint(0, 99)

			# Check if we generate a first child correctly
			if successfulFirstChild == False:
				childOne = parentOne[0 : crossoverPoint + 1] + parentTwo[crossoverPoint + 1: 100]
				if self.validateGene(childOne):
					newGeneration.append(self.mutation(childOne))
					successfulFirstChild = True

			# Check if we generate a second child correctly
			if successfulSecondChild == False:
				childTwo = parentTwo[0 : crossoverPoint + 1] + parentOne[crossoverPoint + 1: 100]
				if self.validateGene(childTwo):
					newGeneration.append(self.mutation(childTwo))
					successfulSecondChild = True

	# Replace old population with new generation
	self.population = newGeneration

	# Increment generation counter
	self.generation += 1
	return

{% endhighlight %}

As mentioned in our problem invariant, we have to make sure that after crossover both of the generated children have an equal amount of zeroes and ones in their genetic material. In our crossover method, we select two parents at random by making two calls to our selection method. We then choose a random crossover point which corresponds to the index of our parent strings that we will splice to generate the children. Upon splicing both parents and generating two child strings, we check that we've successfully generated new strings that uphold our problem invariant. If this is done in one iteration of the inner while loop, we then run our mutation method on these children and then store these new children. Finally, we repeat the outer while loop until we've generated a new population of our desired size. 

## Mutation

Our last genetic operator, mutation - randomly toggles bit values in a string. The implementation of the mutation algorithm is shown below:

{% highlight python %}

def mutation(self, gene):
	mutatedGene = ''
	mutatedOnes = 0
	mutatedZeroes = 0
	for chromosome in gene:
		mutationProbability = random.uniform(0, 100)
		if mutationProbability < self.mutationRate:
			mutatedGene += str(int(not int(chromosome)))
			if chromosome == '0':
				mutatedZeroes += 1
			else:
				mutatedOnes += 1
		else:
			mutatedGene += chromosome
	if mutatedOnes == mutatedZeroes:
		return mutatedGene
	else:
		return gene

{% endhighlight %}

As with our crossover algorithm, we need to uphold the problem invariant. In order to do so, we compute a mutation rate for each bit in our binary string (a child generated from our crossover method) and toggle the corresponding bits. If the number of zeroes and ones in our new mutated string are equal, then we allow the mutation and return the new mutated string. Otherwise, we simply return the child string. 

With these genetic operators at play, our genetic algorithm follows the following procedure until convergence:

* Generate new population 
* Partition into subsets
* Assign fitness values for each string in our population
* Check for convergence (minimized difference in sums)
* Select new individuals to breed new generation
* Generate new children through crossover and mutation
* Repeat

Out of all of these steps, we haven't discussed what it means for our algorithm to "converge". 

## Convergence

A genetic algorithm can terminate based on several conditions, based on the problem at hand. These conditions are shown below but not limited to:

* A minimum value has been found based on the problem
* Termination after X amount of generations have been generated
* Newer generations fail to improve fitness over a given time

By sheer coincedence, it turns out that the values chosen for our Linear Congruential Generator outputs integers whose partitions can actually be minimized to <b>zero</b>. Therefore, we will say that our algorithm has converged once the difference in our partitioned sets has reached zero. If we were changing the seed values and parameters of our random number generator, we would simply keep a frequency table in order to inspect whether our genetic algorithm has converged (whether at a minimal value or a local plateau). 

Last, we analyze the results of running our genetic algorithm.

## Results

In order to analyze the results of our genetic algorithm, we'll observe how changing the mutation rate and population size affects the number of generations that are formed until convergence. Each of our simulations consists of running our genetic algorithm 10 times with a set population size and mutation rate, which is increased for each simulation. The entire results of these simulations <a style="color:#1faa9b" href="https://github.com/DrkSephy/genetic-algorithms/blob/master/results.txt">can be found here</a>.

Let's take a look at some results. 

{% highlight python %}

+-----------+------------------+-------------------+---------------+-----------------+
| Statistic | Generation Count | Convergence Value | Mutation Rate | Population Size |
+-----------+------------------+-------------------+---------------+-----------------+
|    Min    |       64.0       |         0         |      1.0      |        20       |
|    Max    |      4179.0      |         0         |      1.0      |        20       |
|    Med    |      1946.0      |         0         |      1.0      |        20       |
|    Rng    |      4115.0      |         0         |      1.0      |        20       |
|    Avg    |  1920.44444444   |         0         |      1.0      |        20       |
+-----------+------------------+-------------------+---------------+-----------------+

{% endhighlight %}

When our `population size` is set to 20 and our `mutation rate` is at a measly 1.0%, we can see that the average number of generations formed until convergence is 1920. What happens when we increase the population size to 50, and 100 while maintaining the same mutation rate?

{% highlight python %}

+-----------+------------------+-------------------+---------------+-----------------+
| Statistic | Generation Count | Convergence Value | Mutation Rate | Population Size |
+-----------+------------------+-------------------+---------------+-----------------+
|    Min    |       4.0        |         0         |      1.0      |        50       |
|    Max    |      1915.0      |         0         |      1.0      |        50       |
|    Med    |      448.0       |         0         |      1.0      |        50       |
|    Rng    |      1911.0      |         0         |      1.0      |        50       |
|    Avg    |  616.333333333   |         0         |      1.0      |        50       |
+-----------+------------------+-------------------+---------------+-----------------+

+-----------+------------------+-------------------+---------------+-----------------+
| Statistic | Generation Count | Convergence Value | Mutation Rate | Population Size |
+-----------+------------------+-------------------+---------------+-----------------+
|    Min    |       17.0       |         0         |      1.0      |       100       |
|    Max    |      825.0       |         0         |      1.0      |       100       |
|    Med    |       72.0       |         0         |      1.0      |       100       |
|    Rng    |      808.0       |         0         |      1.0      |       100       |
|    Avg    |  211.777777778   |         0         |      1.0      |       100       |
+-----------+------------------+-------------------+---------------+-----------------+

{% endhighlight %}

As we can see, the average number of populations needed to reach convergence decreases greatly as population size increases. What happens when the mutation rate is increased with populations of 20, 50 and 100?

{% highlight python %}

+-----------+------------------+-------------------+---------------+-----------------+
| Statistic | Generation Count | Convergence Value | Mutation Rate | Population Size |
+-----------+------------------+-------------------+---------------+-----------------+
|    Min    |      238.0       |         0         |      2.0      |        20       |
|    Max    |      3986.0      |         0         |      2.0      |        20       |
|    Med    |      1358.0      |         0         |      2.0      |        20       |
|    Rng    |      3748.0      |         0         |      2.0      |        20       |
|    Avg    |  1553.11111111   |         0         |      2.0      |        20       |
+-----------+------------------+-------------------+---------------+-----------------+

+-----------+------------------+-------------------+---------------+-----------------+
| Statistic | Generation Count | Convergence Value | Mutation Rate | Population Size |
+-----------+------------------+-------------------+---------------+-----------------+
|    Min    |      137.0       |         0         |      2.0      |        50       |
|    Max    |      1972.0      |         0         |      2.0      |        50       |
|    Med    |      229.0       |         0         |      2.0      |        50       |
|    Rng    |      1835.0      |         0         |      2.0      |        50       |
|    Avg    |  453.666666667   |         0         |      2.0      |        50       |
+-----------+------------------+-------------------+---------------+-----------------+

+-----------+------------------+-------------------+---------------+-----------------+
| Statistic | Generation Count | Convergence Value | Mutation Rate | Population Size |
+-----------+------------------+-------------------+---------------+-----------------+
|    Min    |       22.0       |         0         |      2.0      |       100       |
|    Max    |      277.0       |         0         |      2.0      |       100       |
|    Med    |      121.0       |         0         |      2.0      |       100       |
|    Rng    |      255.0       |         0         |      2.0      |       100       |
|    Avg    |      129.0       |         0         |      2.0      |       100       |
+-----------+------------------+-------------------+---------------+-----------------+

{% endhighlight %}

With a `mutation rate` of 2% and a population size of 20, we can see that our genetic algorithm has converged more quickly on average as opposed to when the mutation rate was 1%. Likewise, the average generations needed for convergence when the population increases is also significantly lower than their 1% mutation rate counterparts. 

Finally, let's observe what happens when the mutation rate is increased to 10%. 

{% highlight python %}

+-----------+------------------+-------------------+---------------+-----------------+
| Statistic | Generation Count | Convergence Value | Mutation Rate | Population Size |
+-----------+------------------+-------------------+---------------+-----------------+
|    Min    |       67.0       |         0         |      10.0     |        20       |
|    Max    |      1772.0      |         0         |      10.0     |        20       |
|    Med    |      543.0       |         0         |      10.0     |        20       |
|    Rng    |      1705.0      |         0         |      10.0     |        20       |
|    Avg    |  724.444444444   |         0         |      10.0     |        20       |
+-----------+------------------+-------------------+---------------+-----------------+

+-----------+------------------+-------------------+---------------+-----------------+
| Statistic | Generation Count | Convergence Value | Mutation Rate | Population Size |
+-----------+------------------+-------------------+---------------+-----------------+
|    Min    |       35.0       |         0         |      10.0     |        50       |
|    Max    |      524.0       |         0         |      10.0     |        50       |
|    Med    |      278.0       |         0         |      10.0     |        50       |
|    Rng    |      489.0       |         0         |      10.0     |        50       |
|    Avg    |  281.555555556   |         0         |      10.0     |        50       |
+-----------+------------------+-------------------+---------------+-----------------+

+-----------+------------------+-------------------+---------------+-----------------+
| Statistic | Generation Count | Convergence Value | Mutation Rate | Population Size |
+-----------+------------------+-------------------+---------------+-----------------+
|    Min    |       21.0       |         0         |      10.0     |       100       |
|    Max    |      553.0       |         0         |      10.0     |       100       |
|    Med    |      152.0       |         0         |      10.0     |       100       |
|    Rng    |      532.0       |         0         |      10.0     |       100       |
|    Avg    |      197.0       |         0         |      10.0     |       100       |
+-----------+------------------+-------------------+---------------+-----------------+

{% endhighlight %}

While the number of generations needed for convergence when the population size is 20 or 50 is lower than previous simulations, the average gain when the population size is 100 actually increased from previous simulations. In fact, increasing the mutation rate even more while the population size is increased has very little effect on convergence - the gains are minimal or sometimes negative. 

Overall, we can conclude that increasing the population size decreases the generation count for convergence, however the increasing the mutation rate only has positive effects up to a threshold. This isn't surprising, as too much mutation introduces too much diversity, generating strings which take us further away from our solution. 