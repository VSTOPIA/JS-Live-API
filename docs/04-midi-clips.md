# Working with MIDI Clips - Part A: Reading MIDI Data

This is part of a series of articles about hacking on Ableton Live with JavaScript. These articles assume you own Ableton Live 9 Suite and are comfortable coding JavaScript.

In this article we'll learn how to access the notes inside a MIDI clip. This material continues in the second half of this article, where we'll modify the notes and write them back to the MIDI clip.

## Prerequisites

This article builds upon the previous articles, so refer back to them if you're having trouble here.

## Getting Started

First let's paste in our log() function that we built in article #2: Logging & Debugging:

```javascript
function log()
