---
layout: portfolio_entry
title: Technetium
image: /img/technetium/graph.png
---

Technetium is a Bitbucket Data aggregation tool built using Bitbucket's RESTful API. Features a centalized issue tracker, repository subscription manager, and reports/graphs which enumerates the commit/issue activity of each user in a subscribed repository.

#### Conception

As required from my Web Design class which I took in Fall 2013, a web application had to be built using either Django, Flask or Pyramid. After spending a few weeks in the Summer brainstorming various API's to use in our project, my team of two came across the Bitbucket API - it provided a rich set of endpoints and methods for accessing various data in a repository.  

Another inspiration for the project was a centralized issue tracker - something that we desperately needed within the research lab I have worked in since Summer 2013. With a 
large amount of web applications being built and numerous issues piling up in each one, it was necessary to create a way for a project manager to easily keep up to date with the progress of each project and to track work being done. As for the name `Technetium`, it was chosen due to the popularity of naming all of our web applications within the lab based on chemical elements.

#### Organization

With only 3 months to work on this project, our team decided it would be best to plan out the lifetime of the project from start to finish in order to completely finish it. While finishing a project within such a short time is unheard of, we were determined to put our best foot forward. After many days of planning, we decided that Django would be the best framework for this project, considering we would need models and an OAuth library that has not been deprecated. To finish our targeted feature (our centralized issue tracker), we constructed the following roadmap:

* Find and configure an OAuth protocol, which is necessary by Bitbucket's API to access private repository data.
* Create a module containing methods allowing the user to subscribe to any repository which they have read-access to on Bitbucket.
* Create a module containing methods for grabbing all issue data within all subscribed repositories.
* Write a set of parsers for preparing the returned issue JSON data, as well as the templates needed to render it properly.
* Find and hook up an admin theme (preferrably built with Bootstrap)

During the lifetime of this project, we agreed to strictly follow good software engineering practices - **D****R****Y** (Don't Repeat Yourself), as well as Agile/Scrum methdologies for managing the tasks. To make sure our code remainded readable and modular, refactoring was done every 2 weeks before new features were added.

#### New Features

After only a month of work, we managed to finish our main feature - the centralized issue tracker, shown in the screenshots below: 

![Technetium Repository Manager]({{ site.url }}/img/technetium/manager.png)
![Centralized Issue Tracker]({{ site.url }}/img/technetium/tracker.png)

As seen from the screenshot above, the centralized issue tracker is able to display up to 10 issues at a time from all subscribed repositories on a single page. By clicking the `show more`
button, another 10 issues would appear through the use of AJAX - making the issue tracker responsive and fast.

Motiviation was still high and there were still 2 months left until production day, leading our team to pursue a new feature: `reports`. These reports would have the following features:

* Commit/Issue tallies for all users in a selected repository.
* Tallies of issue comments of all users in a selected repository.
* Various graphs to visualize commit/issue data, built using Django D3.







