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

Genetic Algorithms consist of various operators known as <a style="color:#FC645F" href="https://en.wikipedia.org/wiki/Selection_(genetic_algorithm)">Selection</a>, <a style="color:#FC645F" href="https://en.wikipedia.org/wiki/Crossover_(genetic_algorithm)">Crossover</a> and <a style="color:#FC645F" href="https://en.wikipedia.org/wiki/Mutation_(genetic_algorithm)">Mutation</a>. These operators take binary strings as input, so we'll need to come up with a representation for our problem in terms of binary strings. Since we have two subsets whose difference in sums needs to be minimized, we'll generate an initial population of 20 binary strings each consisting of 50 zeroes and ones, where zeroes correspond to *"this number will belong to S<sub>1</sub>* while ones correspond to *"this number will belong to S<sub>2</sub>*. 

<blockquote>*Problem Invariant*: Due to the problem specifying that each subset must contain n/2 integers, meaning that all of our genetic operators must result in strings containing an equal number of zeroes and ones.</blockquote>

For each binary value within each binary string, we'll partition numbers in our master set *S* into their respective subsets *S<sub>1</sub>* and *S<sub>2</sub>*. Speaking of our list of integers, we'll go over how to implement the <a style="color:#FC645F" href="https://en.wikipedia.org/wiki/Linear_congruential_generator">Linear Congruential Generator</a> to obtain our initial list of 100 unique, random integers. 

