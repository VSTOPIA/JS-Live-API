---
layout: default
title: JS Live API Tutorials
---

# JavaScript in Ableton Live Overview

> Attribution: This repository adapts and redistributes tutorial content by Adam Murray under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0). Original series: https://adammurray.link/max-for-live/js-in-live/ — Changes have been made. This project is not endorsed by Adam Murray or Cycling '74.

> <span class="tip-marker">[!TIP]</span> New versions of these tutorials are available for Max 9's new <code class="max9-object">v8</code> object. You need Live 12.2 or higher (or standalone Max 9) to use it. <code class="max9-object">v8</code> supports modern syntax, is much faster, and has quality-of-life improvements in its integration with Max and Live. Highly recommended.

## Table of Contents

- JavaScript in Ableton Live Overview (this page)
- [Getting Started](/JS-Live-API/docs/01-Getting%20Started.html)
- [Real Time MIDI Processing](/JS-Live-API/docs/02-Realtime%20MIDI.html)
- [The Max Console](/JS-Live-API/docs/03-The%20Max%20Console.html)
- [The Live API](/JS-Live-API/docs/04-The%20Live%20API.html)
- [Generating MIDI Clips](/JS-Live-API/docs/05-Generating%20MIDI%20Clips.html)

## Overview

These pages are a series of Max for Live tutorials on using JavaScript to extend Live's functionality with Max's [built-in JavaScript engine](https://docs.cycling74.com/legacy/max8/vignettes/javascriptinmax) and its [Live API](https://docs.cycling74.com/legacy/max8/vignettes/jsliveapi).

The target audience is people who want to "hack" on Ableton Live and who already know how to program in JavaScript (like web developers). If you need help learning Max for Live or want to see what is possible with JavaScript in Live, you'll find useful info here.

Topics covered include:

- Creating a new Max for Live device that uses JavaScript in "Getting Started"
- Altering MIDI notes as they are played in "Real Time MIDI Processing"
- Techniques for understanding and debugging your code in "The Max Console"
- The basics of using "The Live API" in JavaScript
- "Generating MIDI Clips" with the Live API, opening the door to algorithmic composition

The tutorials are designed to be followed in order, where later tutorials assume you know how to do the things from earlier tutorials. Feel free to jump into "Getting Started" if you are eager to start building.

## Prerequisites

- Ableton Live Suite (with Max for Live) or Live Standard + Max for Live add‑on
- Most tutorials work with Live 11+; some require newer Live/Max
- Familiarity with JavaScript (conditionals, loops, functions)
- Basic Live usage (e.g., controlling instruments with MIDI clips)

## Learning resources

- [MDN's JavaScript Guide](https://developer.mozilla.org/docs/Web/JavaScript/Guide)
- [Max learning resources](https://cycling74.com/learn)
- [Ableton Learn Live](https://www.ableton.com/live/learn-live/)

## Limitations

Let's set some expectations about JavaScript running in Live. Real time music applications like Live need to crunch numbers very quickly, and JavaScript isn't fast enough, at least not the way it runs inside Max and Live. The Max docs talk about how [JavaScript can't run in Max's high priority thread](https://docs.cycling74.com/max8/vignettes/jsliveapi#The_LiveAPI_Object_and_the_Scheduler).

<blockquote class="warning">⚠️ <strong>Important</strong>
<p>Even when we're working with something that happens at a suitable rate, like MIDI data, JavaScript cannot be relied on for consistent, accurate timing at all times.</p>
<p>JavaScript runs in Max's low(er) priority thread. Anything we want to do in Live in the real time signal chain of MIDI data to instruments to audio to effects should ideally be happening entirely in the high priority thread to ensure stable timing with low latency. We prevent this when we introduce JavaScript into this signal path. On a modern, fast computer, most of the time it's going to be ok. But there are so many things that could load up the low priority thread, including potentially anything else on your operating system (read: things outside your control), and problems can happen unexpectedly.</p>
<p><strong>Real time processing in JavaScript in Max for Live should not be relied on for live performance scenarios</strong> (unless timing sloppiness and unpredictable latency is acceptable for the style of music). Extensive testing before live performance usage is highly recommended.</p>
<p><strong>I strongly recommend against trying to make commercial products</strong> with JavaScript that do real time processing in Max for Live. You can't expect it to work perfectly all the time on random people's computers.</p>
</blockquote>

Personally I like to use JavaScript in Live in a composition and production context in a place like my home studio where I am trying out ideas. And almost all of the time, timing with real time processing of MIDI is fine for my needs. Since I'm doing studio work, if there is the occasional glitch or spike in latency, I can edit it manually to fix it or quantize the timing.

One last point. You aren't making some big compromise by choosing to use JavaScript in Live. It's not all bad: JavaScript in Live seems particularly well-suited to build Live MIDI Tools (Generators and Transformers). These are "offline" tools that aren't in the audio signal path in Live, so none of these limitations are a concern in this context.

## JavaScript Engines

Towards the end of 2024, Max started a transition from a very old and slow JavaScript engine to a fast and modern one. This is great news, but it will take time to transition.

Through February 2025, Live comes bundled with Max 8 and the old original <code class="max-object">js</code> object. Max 9 released a few months ago and comes with the new JavaScript engine in a new <code class="max9-object">v8</code> object. People who own Max 9 as a standalone application can configure Live to use it for Max for Live. At some point, Live will be bundled with Max 9.

Update: Live 12.2 with Max 9 launched in June 2025. If you have Live 12.2 or higher, check out the new versions of these tutorials for Max 9's new <code class="max9-object">v8</code> object.

For now, these tutorials remain focused on the old <code class="max-object">js</code> object. This means most "modern" JavaScript features cannot be used. If you are using <code class="max9-object">v8</code>, all of the code here should work; <code class="max9-object">v8</code> is intended to be backward compatible. The <code class="max9-object">v8</code> tutorials will show better/simpler ways to do things with modern JavaScript syntax and features.

### Max 8 and the Original <code class="max-object">js</code> Object

The JavaScript engine in Max 8 is ES5‑only. Notably, you cannot use `let` or `const` (use `var`). You can transpile modern JavaScript with Babel or TypeScript into a single ES5 `.js` file for use in the Max for Live device.

### Max 9 and the New <code class="max9-object">v8</code> Object

Max 9 introduced <code class="max9-object">v8</code> (and <code class="max9-object">v8.codebox</code>) based on the V8 engine powering Node.js and Chrome. It brings modern syntax support and performance improvements. Everyone using Live 12.2+ can now use <code class="max9-object">v8</code> in Max for Live devices.

## Next Steps

Read “Getting Started” to learn how to setup a Max for Live device with JavaScript.

Have feedback or questions? Email the developer: <a href="mailto:adam@adammurray.link">adam@adammurray.link</a> (check spam for replies)

<p align="center">
  <img src="https://vstopia.com/VSTOPIA_MEDIA/VSTOPIA-max-for-live-logo.png" alt="VSTOPIA Max for Live" width="200" />
</p>


