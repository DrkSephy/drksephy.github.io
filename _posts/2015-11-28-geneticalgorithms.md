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

After a closer observation of the problem, it turns out that it is actually a variant of the <a style="color:#FC645F" href="https://en.wikipedia.org/wiki/Subset_sum_problem">Subset Sum</a> problem, known as the <a style="color:#FC645F" href="https://en.wikipedia.org/wiki/Partition_problem">Partition Problem</a>. In the **Partition Problem**, the goal is that given a set of numbers, we want to partition these numbers into two sets *S<sub>1</sub>* and *S<sub>2</sub>* such that the sums of these two sets are equal. Another way of phrasing this is to minimize the difference in sums between these two sets, which is where our Genetic Algorithm comes into play. 

