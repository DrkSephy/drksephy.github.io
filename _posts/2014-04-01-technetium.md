---
layout: post
title: Technetium
subtitle: "A Bitbucket Data aggregation tool built using Bitbucket's RESTful API. Features a centalized issue tracker, repository subscription manager, and reports/graphs which enumerates the commit/issue activity of each user in a subscribed repository."
date: 2014-04-01
tags: [Post]
author: "David Leonard"
header-img: "img/darkscape.jpg"
---

<a style="color:#FC645F" href="http://technetium.herokuapp.com">Technetium</a> is a Bitbucket Data aggregation tool built using <a style="color:#FC645F" href="https://confluence.atlassian.com/display/BITBUCKET/Use+the+Bitbucket+REST+APIs">Bitbucket's RESTful API</a>. It features a centalized issue tracker, repository subscription manager, and reports/graphs which enumerates the commit/issue activity of each user in a subscribed repository. 

Special thanks to <a style="color:#FC645F" href="https://codenameyau.github.io/">Jorge Yau</a> for his guidance and contributions towards making this a great project. Feel free to check out <a style="color:#FC645F" href="https://github.com/codenameyau">his works</a>.

#### Subscriptions 

The main entry feature of Technetium is the Subscription manager, which allows the user to "subscribe" to any repository which they have read access to. 

![subscriptions](/img/subscriptions.png){: .center-image}

By subscribing to repositories, users can then use the centralized issue tracker along with the report generation features.

#### Centralized Issue Tracker

The core feature of Technetium is the centralized issue tracker, which allows the user to view issues across several subscribed repositories in a single page. By default, each repository will display 10 issues at a time. Clicking the "show more" will fetch the next 10 issues using AJAX, and each issue is linked to the corresponding issue on Bitbucket, while the filters allow issues to be drilled down based on type and status. 

![central](/img/central.png){: .center-image}

This feature has come in handy for various developers who are looking for a free alternative to tracking issues across several projects. 

#### Report Generation

The last feature of Technetium is the ability to automatically generate reports which summarize activity in a given repository among each contributor. For instance, users can quickly view how many issues are spread across each contributor, as well as how many issues and commits are being done in a repository. 

![reports](/img/reports.png){: .center-image}

Reports are built using the <a href="https://github.com/kennethreitz/grequests" style="color:#FC645F">grequests library</a> for handling multiple requests and the <a href="https://github.com/areski/python-nvd3" style="color:#FC645F">nvd3</a> library for d3 wrappers in Python. 

Currently, <a style="color:#FC645F" href="http://technetium.herokuapp.com">Technetium</a>  is being used within several classes at the City College of New York - both by Professors and students. Professors track reports in order to gauge how students are performing on group projects which are using Mercurial, and students generate these reports to easily give presentations week by week. 

#### Source

The source for this project may be <a style="color:#FC645F" href="https://github.com/DrkSephy/technetium">found here</a>. If you find any bugs or have a feature request, feel free to send a pull request or <a style="color:#FC645F" href="https://github.com/DrkSephy/technetium/issues">file a feature request</a>. 