# JS Live API » #3 API Basics

This is the 3rd of a series of articles about hacking on Ableton Live with JavaScript. These articles assume you own Ableton Live 9 Suite and are comfortable coding JavaScript.

## Overview

In this article we'll learn how to access the different Live objects available to the Live API, how to examine their properties and child objects, and how to make changes to the objects.

## Live API Documentation

I can't cover everything about the Live API in these articles. When you need more information, Max's documentation is a good resource:

- Creating Devices that use the Live API is a good place to start.
- The LiveAPI Object is the JavaScript object used to access the Live API.
- The Live Object Model is a reference of all the different Live objects available in the Live API.
- Live API Overview is an overview of general Live API concepts.

Note: This page focuses on Max objects, not JavaScript. The concepts are the same, but we won't be using any Max objects like live.object, live.path, or live.observer. Instead, we do all this via the JavaScript LiveAPI object.

## Getting Started

Let's create a LiveAPI object and take a look at some of its properties:
