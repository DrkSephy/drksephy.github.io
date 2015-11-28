---
layout: post
title: Exploring Genetic Algorithms
subtitle: "Applying Genetic Algorithms to variants of the Subset Sum Problem"
date: 2015-11-28
tags: [Post]
author: "David Leonard"
header-img: "img/genetics.jpg"
---

In my Artificial Intelligence class, we were given a project in which we had to use <a style="color:#FC645F" href="https://en.wikipedia.org/wiki/Genetic_algorithm">Genetic Algorithms</a> in order to solve the following problem:

<blockquote>Develop a Genetic Algorithm (GA) to solve the following problem: Given a list of n distinct positive integers, partition the list into two sublists, each of size n/2, such that the difference between the sums of the integers in the two sublists is minimized. To obtain your initial list, use a linear congruential random number generator to generate 100 random integers between 1 and 10,000.</blockquote>

After a closer observation of the problem, it turns out that it is actually a variant of the <a style="color:#FC645F" href="https://en.wikipedia.org/wiki/Subset_sum_problem">Subset Sum</a> problem, known as the <a style="color:#FC645F" href="https://en.wikipedia.org/wiki/Partition_problem">Partition Problem</a>. In the **Partition Problem**, the goal is that given a set of numbers, we want to partition these numbers into two sets *S<sub>1</sub>* and *S<sub>2</sub>* such that the sums of these two sets are equal. In this problem, we explore the **optimization problem** in which we want to mimimize the differences in sums of these two sets (which is known to be <a style="color:#FC645F" href="https://en.wikipedia.org/wiki/NP-hardness">NP-Hard</a>) using a Genetic Algorithm. 

## Problem Representation

Genetic Algorithms consist of various operators known as <a style="color:#FC645F" href="https://en.wikipedia.org/wiki/Selection_(genetic_algorithm)">Selection</a>, <a style="color:#FC645F" href="https://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)">Crossover</a> and <a style="color:#FC645F" href="https://en.wikipedia.org/wiki/Mutation_(genetic_algorithm)">Mutation</a>. These operators take binary strings as input, so we'll need to come up with a representation for our problem in terms of binary strings. Since we have two subsets whose difference in sums needs to be minimized, we'll generate an initial population of 20 binary strings each consisting of 50 zeroes and ones, where zeroes correspond to *"this number will belong to S<sub>1</sub>* while ones correspond to *"this number will belong to S<sub>2</sub>"*. 

<blockquote><b>Problem Invariant</b>: Due to the problem specifying that each subset must contain n/2 integers, meaning that all of our genetic operators must result in strings containing an equal number of zeroes and ones.</blockquote>

For each binary value within each binary string, we'll partition numbers in our master set *S* into their respective subsets *S<sub>1</sub>* and *S<sub>2</sub>*. Speaking of our list of integers, we'll go over how to implement the <a style="color:#FC645F" href="https://en.wikipedia.org/wiki/Linear_congruential_generator">Linear Congruential Generator</a> to obtain our initial list of 100 unique, random integers. 

## Implementing a Linear Congruential Generator

A <a style="color:#FC645F" href="https://en.wikipedia.org/wiki/Linear_congruential_generator">Linear Congruential Generator</a> is a very simple algorithm for generating <a style="color:#FC645F" href="https://en.wikipedia.org/wiki/Pseudorandom_number_generator">pseudo-randomized</a> numbers. Due to the nature of pseudo-randomized numbers, their sequence is determined by their initial values. In order to generate a list of 100 unique random integers between 1 and 10,000, we will need to choose the parameters of our Linear Congruential Generator wisely. 

By selecting the parameters *m*, *a*, *c* and the *seed* of the recurrence relation carefully, we can guarantee that the period will be long enough such that our numbers will be unique. In order to generate numbers up to 10,000, we specify our modulus *m* to be equal to 10,000 - which will also assist in generating unique integers by having our value of *c* to be <a style="color:#FC645F" href="https://en.wikipedia.org/wiki/Coprime_integers">relatively prime to each other</a>. While there are two other conditions for having a maximal period, this alone will suffice for generating our initial sequence of integers.The implementation of the Linear Congruential Generator is shown below:

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

In Genetic Algorithms, we need some method of assigning values to binary strings which correspond to how well they solve the problem. In our case, we want to assign binary strings that have the smallest difference in sums between our sets higher <a style="color:#FC645F" href="https://en.wikipedia.org/wiki/Fitness_(biology)">fitness</a> - meaning that these strings more closely solve our minimization problem. 

In order to compute a fitness value for each of our binary strings, we'll have to finally partition our list of values corresponding to each binary string in our population. Below is a method for doing so:

{% highlight python %}

def partition(self):
	"""
		Partitions a binary string into corresponding subsets. 
		"""
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
	"""
		Computes the fitness of each gene in our population. 

		Parameters: 
			population: list
				- The set of all genes 
		Returns:
			fitness: list
				- An array of fitness functions for our genes
		"""
	# Store differences between each gene
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









