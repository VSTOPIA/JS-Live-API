# JS Live API » #6 Going Deeper

> Attribution: Content adapted from Adam Murray’s “JS in Live” tutorials, licensed under CC BY-NC-SA 4.0. Original: https://adammurray.link/max-for-live/js-in-live/ — Changes have been made. Not endorsed by Adam Murray or Cycling '74. License: https://creativecommons.org/licenses/by-nc-sa/4.0/

This is the 5th of a series of articles about hacking on Ableton Live with JavaScript. These articles assume you own Ableton Live 9 Suite and are comfortable coding JavaScript.

## Overview

In this article, we'll cover various parts of the Live API that didn't fit into article #3: Live API Basics. These topics deal with issues you may face when building "real" projects with the Live API and want to do more advanced things. I'll cover common gotchas with the Live API and how you deal with them.

This article builds upon the previous articles, so refer back to them if you're having trouble here.

**WORK IN PROGRESS!**

This article is nowhere near done. I'm including a couple of sections I originally wrote for article #3: Live API Basics, but moved out of that article because it was just too much information to cover in one article.

There will be a lot more content here soon. I hope to have this done sometime in June-July 2014. Check back soon!

## Alternative Live Paths

There are often multiple paths that point to the same object. Live has the concept of the "canonical path", which is basically a consistent default way that Live refers to any given object path. The canonical path is always returned by `api.path`:

```javascript
var liveObject = new LiveAPI("live_set tracks 0 canonical_parent");
log(liveObject.path);
```

This shows the canonical path for `live_set` (the Song object) is just "live_set", no matter how we reached the object.

It's important to understand that multiple paths exist to an object because some paths will be more useful than others depending on the situation. We've been accessing the first track via 'live_set tracks 0', but maybe you want to build a more flexible Max device that operates on the currently selected track. We can do that with an alternative path that goes through the Song.View object:

```javascript
var liveObject = new LiveAPI("live_set view selected_track");
log(liveObject.path);
```

Try selecting different tracks in Live and re-running the script. Similarly, we could get to a particular clip via paths such as "live_set tracks 0 clips 0", "live_set view selected_track clips 0", or the currently selected clip in Session view via "live_set view highlighted_clip_slot clip".

For more details on the Live Object Model and its structure, you can refer to the [Live Object Model documentation](https://docs.cycling74.com/legacy/max8/vignettes/live_object_model).

## Validating Live Paths

Whenever we try to access an invalid path, which may be a typo or a more legitimate case like trying to access a clip in an empty clip slot, you'll get a LiveAPI object that has an empty path and an id of 0.

**TODO:** Explain further, give examples...

## Observers and Callbacks

**TODO:** ...

## Property Types

**TODO:** ...

## We're Doing it Wrong!

The way we've been writing this JavaScript is useful for exploring and debugging the Live API, but it's not good for building real devices. The issue is mentioned in JavaScript LiveAPI documentation:

> You cannot use the LiveAPI object in JavaScript global code. Use the live.thisdevice object to determine when your Max Device has completely loaded (the object sends a bang from its left outlet when the Device is fully initialized, including the Live API).

If you try to do all this Live API stuff in the top-level (global) scope of your JavaScript code, it's going to fail when you add your Max device to a Live Set, or open a Live Set containing such a device. That's because Max needs some time to initialize everything, and the global code will run too soon, before the Live API is ready.

As mentioned, we should use a `live.thisdevice` object, and since that sends a bang when the Live API is ready, we can wrap all our initialization code in a `bang()` function:

```javascript
function bang() {
    var api = new LiveAPI("this_device");
    log('this device path:', api.path);
    // do stuff with the Device object...
}
```

This is a good pattern for initialization code when some kind of one-time setup is needed. Other code is probably going to be triggered by user interactions sending custom messages to our JavaScript code. There will be examples of this in the next article.