# JS Live API » #5 Building a User Interface

This is part of a series of articles about hacking on Ableton Live with JavaScript. These articles assume you own Ableton Live 9 Suite and are comfortable coding JavaScript.

## Overview

In this article we'll depart from JavaScript programming to build a user interface for our Max for Live device. We'll do this for the "humanize" MIDI clip randomization features we built in the previous article.

## Prerequisites

I'll assume you are a Max beginner and try to explain everything we're doing, but Max is a complex piece of software and there may be some things you don't understand right away. Just do your best to follow along and use the screenshots as a guide. If you're struggling or want to learn more about Max, I suggest you read Max's tutorials under its Help menu.

## Getting Started

If needed, copy the finished code from the end of the previous article and add it to the JavaScript file in your Max for Live device. Since we'll be triggering the humanize function from the Max for Live device, we can delete the call to `humanize();` at the end of the script.

Here's the JavaScript function we'll be building an interface around: 