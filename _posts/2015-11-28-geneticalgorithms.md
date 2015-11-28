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

Whose output is:

{% highlight python %}

> [17, 53, 161, 485, 1457, 4373, 3121, 9365, 8097, 4293, 2881, 8645, 5937, 7813, 3441, 325, 977, 2933, 8801, 6405, 9217, 7653, 2961, 8885, 6657, 9973, 9921, 9765, 9297, 7893, 3681, 1045, 3137, 9413, 8241, 4725, 4177, 2533, 7601, 2805, 8417, 5253, 5761, 7285, 1857, 5573, 6721, 165, 497, 1493, 4481, 3445, 337, 1013, 3041, 9125, 7377, 2133, 6401, 9205, 7617, 2853, 8561, 5685, 7057, 1173, 3521, 565, 1697, 5093, 5281, 5845, 7537, 2613, 7841, 3525, 577, 1733, 5201, 5605, 6817, 453, 1361, 4085, 2257, 6773, 321, 965, 2897, 8693, 6081, 8245, 4737, 4213, 2641, 7925, 3777, 1333, 4001, 2005]

{% endhighlight %}







