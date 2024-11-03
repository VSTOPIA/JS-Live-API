# JS Live API » #6 Going Deeper

This is the 5th of a series of articles about hacking on Ableton Live with JavaScript. These articles assume you own Ableton Live 9 Suite and are comfortable coding JavaScript.

## Overview

In this article we'll cover various parts of the Live API that didn't fit into article #3: Live API Basics. These topics deal with issues you may face when building "real" projects with the Live API, and want to do more advanced things.

## Alternative Live Paths

There are often multiple paths that point to the same object. Live has the concept of the "canonical path", which is basically a consistent default way that Live refers to any given object path: 