---
layout: post
title: Fire Emblem
image:
  feature: fire_emblem_cover.jpg
  background: triangular.png
---


Fire Emblem - Chronicles of the Abyss is a JavaScript remake of Fire Emblem - Blazing Sword built on top of the ImpactJS Game Engine, purely for educational purposes. The motivation for this project is to explore the capabilities of ImpactJS and push the boundaries of the engine, as well as to create a long-time favorite game. 

#### The Beginning

Through my experiences with ImpactJS, this new project is out of the scope of the engine. ImpactJS was built for simple, side-scrolling platforming games, while Fire Emblem is a top-down turn based strategy role playing game in which the player controls an army of units, not just a single player. 

Before the project officially began as a group, one of my team members started to work on the core battle system of the game - to see if it was feasible to build this game. After a month of work, it turned out that it was entirely possible to build this game, and that it would take an incredible amount of work. Nonetheless, we began on the second week of February after we assembled a team of 5. 

#### Roadmap

To tackle such a complicated game, we knew that we needed a clear path. We created a detailed task list, complete with all pre-requisites which would unlock more functionality to be built. The following is a list of these high-level tasks:

* Control multiple player units
    * A* Pathfinding for click-and-point movement
    * Grid based movement
    * Detect nearby enemies/allies
* Camera System
    * Focus on active unit
* Base stats
    * Derived Stats
    * Modified Stats
    * Weapon/Terrain Bonuses
* Experience system
    * Level Up System
    * Randomized Stat Increases
* Inventory System
    * Physical and Magical Weapons
    * Item usages
    * Equipment System
* Graphical User Interface
    * Stats Screen
    * Attack/End Turn/Trade/Item Screens 
    * Shop System
    * Character Portraits
* Battle Animation System
    * Animation Queue System
    * Animation Frames
    * Handling Switching of Frames 
    * Physical/Ranged/Magical/Critical Attacks

With the CCNY ACM Student/Faculty Mixer in only 5 weeks, we wanted to get through most of our task list to give a good demonstration of our game to our fellow classmates and faculty. 

#### Development Spree

After spending 4 weeks of developing, we managed to not only get a working demo of the game - we finished 98% of our entire task list (which consisted of over 90 tasks). The last week before the presentation was spent on bug polishing and setting up our demo. At the end these 5 weeks of development, a list of statistics are shown below:

* 622 Commits
* 42 Pull Requests
* 7400+ Lines of code, after several refactorings
* Over 800+ hours of combined development

To showcase our commitment to the project, our Github punchcard is shown below:

![Github punchcard]({{ site.url }}/img/fire_emblem/punchcard.png)

Based on the punchcard, there was development on our game almost every moment of the day - which really helped us get through all of our tasks. Our presentation went very well, with over 100 students and faculty in attendence - as well as some research opportunities presented to us for our hard work.

#### Future Work

Even though the game is entirely playable and bug-free as of our demo, there is still much work to be done. The features needed are listed below:

* More advanced A* pathfinding algorithm - one which takes in arbitrary weights
* Saving features using HTML5 localstorage
* More Animations and playable maps
* Map objectives and scripts
* Harder Enemy Artificial Intelligence
* Randomized Enemy Stats for more challenge

#### Experiences

Throughout this project, I have learned a multitude of new things. For the most part, my familiarity with JavaScript increased exceptionally, and I've been able to push myself to work even harder than before. The biggest skill I've learned is to manage a team by breaking down tasks down to their most basic functionality, which allows for better task coordination and management. On top of that, I've grown to get more used to refactoring code to keep the codebase organized and modular, especially when integrating new, bigger features.
As this project goes on, this blog post will be updated. Stay tuned for more!

