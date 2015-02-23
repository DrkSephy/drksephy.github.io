---
layout: post
title: Full-stack JavaScript + Github API
subtitle: "Learn to build an application using ExpressJS, NodeJS, AngularJS and the Github API."
date: 2015-02-21
tags: [Tutorial]
author: "David Leonard"
---

With JavaScript becoming an increasingly popular language through frameworks such as NodeJS and AngularJS, I decided to work on a project which involved MongoDB, ExpressJS, NodeJS, AngularJS and the Github API. The motivation for this project was to build a useful tool for quickly visualizing statistics in a repository while learning how to build web applications using full-stack JavaScript. 

#### Project Directory

During the scope of this project, we will be working with several files across different frameworks. Our project structure will look like the following:

{% highlight bash %}

git-technetium/
├── bower.json
├── config.js
├── gulpfile.js
├── package.json
├── public
│   ├── addons
│   │   ├── navbar.html
│   │   └── sidebar.html
│   ├── css
│   │   └── admin.css
│   ├── index.html
│   ├── partials
│   │   ├── basic.partial.html
│   │   ├── commitComments.partial.html
│   │   ├── commits.partial.html
│   │   ├── issues.partial.html
│   │   ├── issues_assigned.partial.html
│   │   ├── issues_closed.partial.html
│   │   ├── issues_comments.partial.html
│   │   ├── issues_opened.partial.html
│   │   ├── loc.partial.html
│   │   ├── pull_requestsComment.partial.html
│   │   ├── pulls.partial.html
│   │   └── report.partial.html
│   ├── scripts
│   │   ├── app.js
│   │   ├── controllers
│   │   │   ├── basicController.js
│   │   │   ├── commitCommentsController.js
│   │   │   ├── commitsController.js
│   │   │   ├── gitController.js
│   │   │   ├── issuesAssignedController.js
│   │   │   ├── issuesClosedController.js
│   │   │   ├── issuesCommentsController.js
│   │   │   ├── issuesController.js
│   │   │   ├── issuesOpenedController.js
│   │   │   ├── locController.js
│   │   │   ├── pullRequestCommentsController.js
│   │   │   ├── pullsController.js
│   │   │   └── reportController.js
│   │   └── factories
│   │       ├── commitCommentsFactory.js
│   │       ├── commitsFactory.js
│   │       ├── issuesAssignedFactory.js
│   │       ├── issuesClosedFactory.js
│   │       ├── issuesCommentsFactory.js
│   │       ├── issuesFactory.js
│   │       ├── issuesOpenedFactory.js
│   │       ├── locFactory.js
│   │       ├── pullRequestCommentsFactory.js
│   │       └── pullsFactory.js
│   └── vendor
├── routes
│   ├── commit_comments.js
│   ├── commits.js
│   ├── issue_comments.js
│   ├── issues.js
│   ├── issues_assigned.js
│   ├── issues_closed.js
│   ├── issues_opened.js
│   ├── loc.js
│   ├── pull_request_comments.js
│   └── pull_requests.js
└── server.js

{% endhighlight %}

#### Dependency Management 

Over the course of this tutorial, we will use several front-end and helper libraries. We first look at `bower.json`, which we use in conjunction with `bower` to install various libraries. 

{% highlight javascript %}

{
  "name": "git-technetium",
  "dependencies": {
    "angular": "~1.2.20",
    "angular-ui-router": "~0.2.10",
    "async": "~0.9.0",
    "bootstrap": "~3.2.0",
    "jquery": "~2.1.1"
  }
}

{% endhighlight %}

We will also add a `.bowerrc` file to configure where our libraries will be installed to:

{% highlight javascript %}

{
    "directory": "public/vendor"
}

{% endhighlight %}

With that all set up, go ahead and run `bower install`, which will download all the packages listed within the `bower.json` file. 

We will also need some packages for our server-side application. Set up a `package.json` file as shown below:

{% highlight javascript %}

{
  "name": "git-technetium",
  "version": "0.0.1",
  "private": true,
  "dependencies": {},
  "devDependencies": {
    "async": "^0.9.0",
    "bower": "^1.3.8",
    "express": "^4.6.1",
    "gulp": "^3.8.7",
    "gulp-jshint": "^1.8.4",
    "jshint-stylish": "^0.4.0",
    "nodemon": "^1.2.1",
    "request": "^2.37.0"
  }
}

{% endhighlight %}

With this, we now run `npm install` to install the packages listed within our `package.json` file. 

#### Setting up your Github Developer Account

In order to remove data limitations from the Github API (50 queries per hour), it is well worth your time to register an application as a developer, which will produce a `CLIENT_ID` and `CLIENT_SECRET` for you. Once you have these in your possession, create a file `config.js` and set it up as shown below:

{% highlight javascript %}

module.exports = {
    PORT: '8080',
    CLIENT_ID: 'your_client_id_here',
    CLIENT_SECRET: 'your_client_secret_here'
};

{% endhighlight %}

Here we export this object in order to save ourselves a lot of typing in the near future. We will be supplying the `CLIENT_ID` and `CLIENT_SECRET` in each of our API calls, which will get repetitive quickly. 

#### Bootstrapping

For this project, we will be using an admin bootstrap template provided by [Start Bootstrap](http://startbootstrap.com/template-overviews/sb-admin/). Within the `public` folder, your directory structure should look like this:

{% highlight bash %}

public/
  addons/
  ├── navbar.html
  └── sidebar.html

  css/
  └── admin.css

{% endhighlight %}

You may grab the files listed above from [the project repository located here](https://github.com/DrkSephy/git-technetium/tree/master/git-technetium/public).

With all of that preparation out of the way, we now finally begin to build out our application!

#### NodeJS and ExpressJS

In this application, we will be grabbing data from the Github API and creating routes within ExpressJS which will consume various API endpoints from Github, parse and return the JSON to the AngularJS client, which will render it out. We begin by building a minimal working version of the application located [here](https://github.com/DrkSephy/git-technetium), starting with gathering issue data from a repository.

### Server.js

We begin by writing our NodeJS Server, which will serve up the application and register all API routes for our ExpressJS application.

{% highlight javascript %}

// Require all needed modules
var express = require('express'),
    request = require('request'),
    async   = require('async'),
    config  = require('./config');

// Create the Express application
var app = express();

// Get an instance of the Express Router
var router = express.Router();

{% endhighlight %} 

We begin by requiring all of the modules we will need. Note how we include our `config.js` file which we wrote earlier - this will contain the `PORT`, `CLIENT_ID` and `CLIENT_SECRET` which will be used in our `routes` and `server.js. 

{% highlight javascript %}

// Register routes of Router
require('./routes/issues')(router, request, async, config);

{% endhighlight %}

Here we register our `issue` route, which we will write shortly.

{% highlight javascript %}

// Prefix all routes with /api
app.use('/api', router);

{% endhighlight %}

Above we will prefix all our routes with `/api`. This means that on the client-side application, we can make an HTTP request to `/api/issues` (our ExpressJS API route) which will return JSON containing issue data. This is simply a convention to differentiate between client-side and server-side routes for our application. 

{% highlight javascript %}

// Set the location of static files
app.use(express.static('./public'));

// Start application server
app.listen(config.PORT, '127.0.0.1', function() {
    console.log('Express server started on 127.0.0.1:' + config.PORT);
})

{% endhighlight %}

Lastly, we direct our application to know where to find our static files (HTML, CSS) and start the server using `app.listen`. By running:

{% highlight bash %}

~/git-technetium $ node server.js

{% endhighlight %}

Putting it all together, our `server.js` looks like the following:

{% highlight javascript %}

// Require all needed modules
var express = require('express'),
    request = require('request'),
    async   = require('async'),
    config  = require('./config');

// Create the Express application
var app = express();

// Get an instance of the Express Router
var router = express.Router();

// Register routes of Router
require('./routes/issues')(router, request, async, config);

// Prefix all routes with /api
app.use('/api', router);

// Set the location of static files
app.use(express.static('./public'));

// Start application server
app.listen(config.PORT, '127.0.0.1', function() {
    console.log('Express server started on 127.0.0.1:' + config.PORT);
});

{% endhighlight %}

With our `server.js` finished, we now move onto writing our first Express API endpoint. 

### Issues.js

Within the `routes` folder, we will create our first route: `issues.js`. 

{% highlight bash %}

~/git-technetium $ vim issues.js

{% endhighlight %}

{% highlight javascript %}

module.exports = function(router, request, async, config) {
    /**
     *  Precondition:
     *      ownerName (string): The owner username of the target repository
     *      repoName  (string): The target repository name
     *  Postcondition:
     *      An array of objects such that each object contains the following:
     *          number   (integer): The number of an issue in the repository
     *          title    (string) : The title of an issue in the repository
     *          state    (string) : The state (open, closed) of an issue in the repository
     *          creator  (string) : The username of the person who opened the issue
     *          assignee (string) : The username of the person who was assigned the issue
     */
    router.get('/issues', function(req, res) {
        
    });
};

{% endhighlight %}

For now, we start with a minimal endpoint, where we are exporting a `router.get` which contains an endpoint `/issues`, which in turn is a function of `req, res`. We will be using the node.js `request` library to retrieve data. We now move onto forming our request for data:

{% highlight javascript %}

    router.get('/issues', function(req, res) {
      var issueData = [];
        var getData = function(pageCounter) {
            request({
                url: 'https://api.github.com/repos/' + req.query.owner + '/' + req.query.repo + '/issues?state=all' + '&page=' + pageCounter + '&client_id=' + config.CLIENT_ID + '&' + 'client_secret=' + config.CLIENT_SECRET,
                headers: { 'user-agent': 'git-technetium' },
                json: true
            }, function(error, response, body) {

            }); 
    });

{% endhighlight %}

Here we create an array `issueData` which will contain all of our parsed issue data. We then define and execute a function `getData` which is a function of `pageCounter`, where `pageCounter` refers to which page of data we are looking at that is returned by Github's API. All data from the Github API is paginated to 30 results per page, which will require making several requests to bundle up all of the data. If you have not registered your application with Github and received a `CLIENT_ID` and `CLIENT_SECRET`, I strongly advise you do so now - otherwise you may quickly run out of hourly requests. 

Our `getData` function makes a `request`, which is a function of:

* `url`: The URL from which we want to get data from. Notice that it is a function of  two paramaters: `req.query.owner` and `req.query.repo` - these query parameters will be passed in by the AngularJS client. The URL is also a function of the current page, `CLIENT_ID`, and `CLIENT_SECRET`. 
* `headers`: Any request to the Github API requires sending a header, otherwise the HTTP request will fail. 
* `json`: We set this to true to denote we are receiving JSON data. 

If our request is successful, the `body` parameter of our callback function will contain the JSON from that specific page. We now write a short parser to extract the data we are interested in sending to the client:

{% highlight javascript %}

function(error, response, body) {
  if(!error && response.statusCode === 200) {
      for(var issueIndex = 0; issueIndex < body.length; issueIndex++) {
          if(!body[issueIndex].pull_request) {
              issueData.push({
                  number: body[issueIndex].number,
                  title: body[issueIndex].title,
                  state: body[issueIndex].state,
                  creator: body[issueIndex].user.login,
                  assignee: body[issueIndex].assignee ? body[issueIndex].assignee.login : ''
              });
          }
      }
  }

{% endhighlight %}

If we received no error from our HTTP request and our request returned a status code of 200, we will iterate over each issue. It is important to note that pull requests are treated as issues on Github, so we check if the `pull_request` key exists in that specific issue data in our iteration. If that specific issue entry is not generated by a pull request, we will push an object into our `issueData` array containing the following data:

* `number`  : The issue number (descending order).
* `title`   : The title of the issue.
* `state`   : The state (opened, closed, etc) of the issue.
* `creator` : The creator of the issue.
* `assignee`: The person who is assigned the issue. 

Lastly, we need to check if more data exists for the `issues` endpoint of this specific repository. 

{% highlight javascript %}

if(body.length < 30) {
    res.send(issueData);
} else {
    getData(pageCounter + 1);
}

{% endhighlight %}

In our first HTTP request, we are currently looking at `pageCounter = 1`. If the length of this content is `< 30`, we know there are no more pages of data, so we use `res.send` to send the `issueData` to the client. Otherwise, we call `getData` and pass in the next page URL to gather the rest of the data. 

Putting it all together, our `issues.js` route is looking like the following:

{% highlight javascript %}

module.exports = function(router, request, async, config) {
    /**
     *  Precondition:
     *      ownerName (string): The owner username of the target repository
     *      repoName  (string): The target repository name
     *  Postcondition:
     *      An array of objects such that each object contains the following:
     *          number   (integer): The number of an issue in the repository
     *          title    (string) : The title of an issue in the repository
     *          state    (string) : The state (open, closed) of an issue in the repository
     *          creator  (string) : The username of the person who opened the issue
     *          assignee (string) : The username of the person who was assigned the issue
     */
    router.get('/issues', function(req, res) {
        var issueData = [];
        var getData = function(pageCounter) {
            request({
                url: 'https://api.github.com/repos/' + req.query.owner + '/' + req.query.repo + '/issues?state=all' + '&page=' + pageCounter + '&client_id=' + config.CLIENT_ID + '&' + 'client_secret=' + config.CLIENT_SECRET,
                headers: { 'user-agent': 'git-technetium' },
                json: true
            }, function(error, response, body) {
                if(!error && response.statusCode === 200) {
                    for(var issueIndex = 0; issueIndex < body.length; issueIndex++) {
                        if(!body[issueIndex].pull_request) {
                            issueData.push({
                                number: body[issueIndex].number,
                                title: body[issueIndex].title,
                                state: body[issueIndex].state,
                                creator: body[issueIndex].user.login,
                                assignee: body[issueIndex].assignee ? body[issueIndex].assignee.login : ''
                            });
                        }
                    }

                    if(body.length < 30) {
                        res.send(issueData);
                    } else {
                        getData(pageCounter + 1);
                    }
                }
            });
        };
        getData(1);
    });
};


{% endhighlight %}
