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

#### Interesting Code Snippets

The following screenshots contains some code snippets that I found particularly fun to work on. 

Starting with the methods for parsing issues in a repository:

{% highlight python %}

    def parse_all_issues(repo_issues):
    """
    Parses returned JSON data from the bitbucket API
    response for the technetium issues dashboard.

    Parameters:
    - repo_issues: List (Dictionaries of JSON issues)

    Returns: List
    """
    # List of repositories, which contains list of parsed issues
    issues_list = []
    for repo in repo_issues:
        if 'issues' in repo:
            issues_list.append(parse_issues(repo['issues']))
        else:
            issues_list.append([])
    return issues_list


def parse_issues(issues):
    """
    Parse issues from Dictionary

    Parameters:
    - issues: List

    Returns: List
    """
    parsed_issues = []
    # No issues in repository
    if not issues:
        return parsed_issues

    # Parse issue information
    for issue in issues:
        data = {}
        data['title'] = issue['title'].capitalize()
        data['status'] = issue['status'].capitalize()
        data['type'] = issue['metadata']['kind'].capitalize()
        data['priority'] = issue['priority'].capitalize()
        data['created'] = bitmethods.format_timestamp(issue['utc_created_on'])
        data['issues_url'] = "#"

        # Parse assignee
        data['assignee'] = ''
        data['assignee_avatar'] = ''
        if 'responsible' in issue:
            data['assignee'] = issue['responsible']['display_name']
            data['assignee_avatar'] = issue['responsible']['avatar']
        parsed_issues.append(data)
    return parsed_issues

{% endhighlight %}

The next one was particularly interesting to work on - generating the line graphs for commit data in a repository. 

{% highlight python %}

def commits_linegraph(changesets=None, count=50):
    """
    Bitbucket has a inconsistent design where if your repo has
    less than 50 commits, they are returned in oldest commits first.
    If your repo has more than 50 commits, the commits are returned
    in most recent commits first.

    Algorithm to parse commits linegraph
    1. Get the timestamp of first and most recent commit
    2. Split the x-axis regions into date ranges
    3. For each commit, parse each user's timestamp to unix time
    4. Create a data series for each user based on date ranges

    Improvements:
    ** [done] Fix nb_element issue
    1. [done] Refactoring into smaller functions
    2. [done] Optimize number of elements

    ** Fix backwards order of linegraph for < 50 commits
    ** Fix cutoff date end
    3. Improve search algorithm

    Returns:
        Dictionary
    """
    # Fixed issues with count of 1 or less
    if not count:
        return {}

    # Initialize start and end timestamp
    start_time, end_time = 0, 0

    # Handle bitbucket's inconsistent commits ordering
    if count <= 50:
        start_time = bitmethods.to_unix_time(changesets[0]['timestamp'])
        end_time = bitmethods.to_unix_time(changesets[-1]['timestamp'])
    else:
        start_time = bitmethods.to_unix_time(changesets[-1]['timestamp'])
        end_time = bitmethods.to_unix_time(changesets[0]['timestamp'])

    # Set limit on amount of time regions
    nb_element = (end_time-start_time)/(86400*1000)
    if nb_element > 60:
        nb_element = 60
    elif nb_element < 10:
        nb_element = 10

    # Get xdata for time range of commits
    step = (end_time - start_time) / nb_element
    xdata = [x for x in range(start_time, end_time, step)]

    # Get commit data with user as its own y data
    user_commits = get_commit_data_of_user(changesets)
    user_series = tally_data_series(xdata, user_commits, nb_element)

    tooltip_date = "%b %d %Y"
    extra_serie = {"tooltip": {"y_start": "Pushed ", "y_end": " commits"},
                    "date_format": tooltip_date}

    # Add each user commit breakdown into chart data
    chartdata = {'x': xdata, 'extra1': extra_serie }
    user_count = 0
    for user in user_series:
        user_count += 1
        ydata = user_series[user]
        string_count = str(user_count)
        chartdata['name'+string_count] = user
        chartdata['y'+string_count] = ydata
        chartdata['extra'+string_count] = extra_serie

    charttype = "lineChart"
    chartcontainer = 'linechart_container'

    return {
        'charttype': charttype,
        'chartdata': chartdata,
        'chartcontainer': chartcontainer,
        'extra': {
            'x_is_date': True,
            'x_axis_format': '%b %d',
            'tag_script_js': True,
            'jquery_on_ready': False,
            }}


{% endhighlight%}




