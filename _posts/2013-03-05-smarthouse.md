---
layout: portfolio_entry
title: Smart House
image: /img/smart-house/banner.png
categories: [project]
---

A plug-and-play device allowing remote control of any application connected to it through the use of an iOS application. Through the use of custom hardware built on top of an Arduino Mega coupled with a central server backed by a node.js API, users can set up devices on the included iOS application and toggle the power status of any connected device.

#### Motivation

The motivation for this project is to help assist visually impaired and physically disabled persons control their home through the ease of our application and hardware, as part of our final one-year project as seniors in Computer Engineering.

#### Conception of the Smart House

Having "Smart Homes" is a popular thing in this day and age, from companies such as `ninjablocks` and `ADT` putting out their own custom solutions. Among these solutions are the following promised features:

* Ability to turn on/off appliances with the swipe of a button
* Ability to even control your car before you step into it
* Ability to control your thermostat
* Included technology can regulate your thermostat and energy consumption
* Saves users money from energy saved
* Easy to configure and easy to extend

To implement these features, a central "box" is usually installed, which has physical and software hooks to an appliance in your home. These appliances are then controlled using an included Android/iOS Application. For the most part, these technologies are very popular and a lot more companies are moving towards smarter homes in terms of energy effieciency and home security.

#### Hardware

In order to control devices, we would need to create our own platform. To help expediate this, we used the Arduino Mega as a base. By hooking up a set of fuses, electrical relays and a wi-fi shield, we can switch the voltages of any device plugged into an outlet. 