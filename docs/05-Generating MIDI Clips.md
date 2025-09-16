---
layout: default
title: Generating MIDI Clips
---

# Generating MIDI Clips

> Attribution: Content copied and adapted from Adam Murray’s “JS in Live” tutorials, licensed under CC BY-NC-SA 4.0. Original: https://adammurray.link/max-for-live/js-in-live/ — Changes may be present. Not endorsed by Adam Murray or Cycling '74. License: https://creativecommons.org/licenses/by-nc-sa/4.0/

> [!TIP]
> A new version of this tutorial is available that uses the `v8` JavaScript engine in Max 9 (Live 12.2+), which is far superior to the legacy `js` object used here.

This is a follow up to “The Live API” tutorial. In this tutorial, we'll use the Live API to generate MIDI clips from scratch with JavaScript code.

Once again we'll start with the basic setup from "Getting Started" with a Max MIDI device containing a js object. I named mine midi-clip-gen.js.

The plan is to generate MIDI clips for controlling drum racks using prime numbers to make interesting rhythmic patterns. The idea was inspired by “The Rhythm of The Primes” YouTube video.

## Creating a Clip
Although we could create a clip by hand and use the Live API to fill it with notes, let's figure out how to create clips with the API too. Then we'll be equipped to generate a lot of different clips across multiple tracks automatically.

 Live's tracks and clips come in two types: MIDI and audio. MIDI tracks can only contain MIDI clips, and audio tracks can only contain audio clips. The Live API handles the two types of clips slightly differently. We will be working with MIDI clips in this tutorial and generating them into the first track, so make sure the first track in your Live Set is a MIDI track, otherwise the code below will not work.

In the Live API, a ClipSlot is the object you use to manage clips in Session view. They're the individual cells in the Session view's grid of clips. We can access any clip slot by its track index and clip slot index, where clip slot indexes correspond to the scene index: the top row of Session view are the clip slots with index 0, the second row is index 1, and so on.

We can get a LiveAPI object for the first clip slot of the first track like this:

```javascript
var clipSlot = new LiveAPI("live_set tracks 0 clip_slots 0");
```
And we can create a clip in a clip slot like this:

```javascript
clipSlot.call("create_clip", 4);
```
The create_clip function takes a parameter for the clip length in beats. We used 4 here to create a clip that's four beats in length (one measure in 4/4 time).

You can try running those lines together:

```javascript
var clipSlot = new LiveAPI("live_set tracks 0 clip_slots 0");
clipSlot.call("create_clip", 4);
```
If the clip slot is empty, it creates a clip. If there's already a clip, it prints an error to the Max console:

This clip slot already has a clip: 'create_clip 4'
Let's avoid the error by only creating a clip if the clip slot is empty. We can check if the clip slot is empty like this:

```javascript
var clipSlot = new LiveAPI("live_set tracks 0 clip_slots 0");
if (clipSlot.get("has_clip") == false) {
  clipSlot.call("create_clip", 4);
}
```
 You might want to write if(!clipSlot.get("has_clip")) { ... }, but some weird aspect of Max's JavaScript engine and the Live API causes !clipSlot.get("has_clip") to always be false, so don't check its value that way!

Clearing a Clip
For the purpose of this tutorial, we want to start with a "clean slate" blank clip and re-generate all the notes every time we run our script. So, if the clip already exists let's delete all the notes inside of it. Alternately, we could delete and recreate the clip, but if we are looping the clip while coding and trying out different ideas, deleting the clip will cause playback to stop. By reusing the clip, we get something akin to live coding and can automatically hear the results in a looping clip as we save changes to our script. It's a nice workflow!

To clear all the notes from a clip, first we need to create a Clip object with the Live API. A Clip is a child of ClipSlot so, as we learned in “The Live API”, we access the clip slot's clip by appending "clip" to the ClipSlot path, so for example, here's the Clip in the first clip slot of the first track:

```javascript
var clip = new LiveAPI("live_set tracks 0 clip_slots 0 clip");
```
In our script, we already have the ClipSlot assigned to our `clipSlot` variable, so we can do this:

```javascript
var clip = new LiveAPI(clipSlot.unquotedpath + " clip");
```
 clipSlot.path evaluates to the string "\"live_set tracks 0 clip_slots 0\"" with quote characters at the beginning and end of the string. You need to use clipSlot.unquotedpath to make valid Live API paths.

To delete all the notes, we call the remove_notes_extended function on the clip. It takes four parameters: from_pitch, pitch_span, from_time, and time_span. The from_* parameters are the starting pitch and starting time beats. We want to start from 0 in both cases. The *_span parameters specify the relative end values by adding to the start. So for example from_pitch=60, pitch_span=12 would cover pitches 60-71 (the end value of 72 in not inclusive in the range).

MIDI pitches range from 0, 127, so from_pitch=0, pitch_span=128 will delete all pitches. For the end time, we can ask the clip for its length with clip.get("length"):

```javascript
var clipSlot = new LiveAPI("live_set tracks 0 clip_slots 0");
if (clipSlot.get("has_clip") == false) {
  clipSlot.call("create_clip", 4);
}
var clip = new LiveAPI(clipSlot.unquotedpath + " clip");
clip.call("remove_notes_extended", 0, 128, 0, clip.get("length"));
```
If you manually add some notes to your MIDI clip, re-running this script should now delete them all. If you are trying this code in a real music project (which is not recommended when experimenting with the Live API), be careful you don't clear a clip you care about!

 Why is the function called "remove_notes_extended" and not "remove_notes"? In 2018, the MIDI standard received a major upgrade called MPE (MIDI polyphonic expression) that supports more expressive MIDI controller hardware where every note can be varied simultaneously and independently. MPE adds a lot of complexity to the MIDI standard, and Ableton needed to break backward compatibility to support it. They handled this by keeping the existing pre-MPE function named "remove_notes" for older Max devices running in Live version 10 and earlier where MPE is not supported.

Starting in Live 11 where MPE is supported, all Live API calls to remove notes from clips need to use "remove_notes_extended" to work properly . A similar situation exists with other clip functions such as "get_notes_extended". The older pre-MPE functions are no longer documented, and if you somehow accidentally use them (maybe by copy and pasting old code off the Internet), Live will warn you and tell you to use the newer functions. You generally don't need to think about it, but do pay attention to those warnings if you ever see them. You can try changing the clip.call(...) to use "remove_notes" to see what the warning looks like.

Before we move on, let's convert what we've done so far into a reusable function that works on any clip slot:

function makeClip(trackIndex, clipIndex) {
  var clipSlot = new LiveAPI("live_set tracks " + trackIndex + " clip_slots " + clipIndex);
  if(clipSlot.get("has_clip") == false) {
    clipSlot.call("create_clip", 4);
  }
  var clip = new LiveAPI(clipSlot.unquotedpath + " clip");
  clip.call("remove_notes_extended", 0, 128, 0, clip.get("length"));
  return clip;
}

var clip = makeClip(0, 0);
Let's also parameterize it on the clip length. To set an existing clip's length, we need to set both its normal start/end markers and its loop points:

function makeClip(trackIndex, clipIndex, lengthInBeats) {
  var clipSlot = new LiveAPI("live_set tracks " + trackIndex + " clip_slots " + clipIndex);
  if(clipSlot.get("has_clip") == false) {
    clipSlot.call("create_clip", lengthInBeats);
  }
  var clip = new LiveAPI(clipSlot.unquotedpath + " clip");
  clip.call("remove_notes_extended", 0, 128, 0, clip.get("length"));
  clip.set("start_marker", 0);
  clip.set("end_marker", lengthInBeats);
  clip.set("loop_start", 0);
  clip.set("loop_end", lengthInBeats);
  return clip;
}

var clip = makeClip(0, 0, 4);
Now we can create new clips or clear out existing clips and set their clip length in any clip slot. Try changing the code to a different length like makeClip(0, 0, 16); and observe the results. If you increase an existing clip's length, you may need to zoom out in the clip view to see all of it.

Adding Notes to the Clip
We use a clip's "add_new_notes" function to add notes to it. It takes an object with a notes array. The documentation for "add_new_notes" explains the supported note properties. There are three required properties for each note: pitch (MIDI pitch number), start_time (in beats, relative to clip start), and duration (in beats). We'll start with those required properties and explore some of the optional properties soon.

Let's add a C3 note starting on the second beat and playing for three beats. Pitch C3 is MIDI pitch number 60. If you're ever unsure about the MIDI pitch number, draw a note into a MIDI clip and hover over it. The Live status bar shows a bunch of info about that note including the MIDI pitch number.

 Other music software and hardware may define MIDI pitch number 60 as C4. There's unfortunately no standard for this, only conventions.

Here's how we call the Live API to create our note. Note I have omitted the function makeClip(...) {...} that we built above, because it will not change again in this tutorial. You'll need to keep it in your script. I'll include it again in the final version at the end so you can see all the code together.

var clip = makeClip(0, 0, 4);

clip.call("add_new_notes", {notes: [
  {pitch: 60, start_time: 1, duration: 3},
]});
This generates a four-beat clip with our note starting on the second beat:

![Single note](https://adammurray.link/max-for-live/js-in-live/generating-midi-clips/generate-single-note.png)

Let's add more notes by building up an array of note objects and adding them all in one Live API call. I also made the clip length a variable for clarity:

var clipLengthInBeats = 4;

var clip = makeClip(0, 0, clipLengthInBeats);
var notes = [];

notes.push({
  pitch: 60,
  start_time:1,
  duration: 3,
});

notes.push({
  pitch: 64,
  start_time:2,
  duration: 2,
});

clip.call("add_new_notes", {notes: notes});
 Because Max's js object uses an old version of JavaScript, we must use {notes: notes} instead of the shorthand syntax {notes}.

Now we have two notes:



Sweet! This is a good foundation for generating an arbitrary number of notes.

The Rhythm of the Primes
As mentioned in the intro, I discovered a Youtube video called "The Rhythm of the Primes" that intrigued me and inspired me to explore using prime numbers to generate rhythms. JavaScript is a powerful tool for this.

First, we need to know a bunch of prime numbers. Finding prime numbers can be an interesting programming exercise, but coding that up from scratch is a distraction to our main goal, so let's grab a list from Wikipedia and convert it to JavaScript:

var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,
              43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
Many of Live's drum racks have 16 different drum sounds at MIDI pitches 36-51. Let's write code to generate notes for those pitches.

Each of those 16 pitches will have a rhythm based on one of the first 16 primes. If the prime is 2, we'll play every 2 beats. If the prime is 3, we'll play every 3 beats, and so on.

For a given pitch and prime, we can implement that note generation logic like this with modular arithmetic:

for (var start = 0; start < clipLengthInBeats; start++) {
  if (start % prime == 0) {
    notes.push({
      pitch: pitch,
      start_time: start,
      duration: 1,
    });
  }
}
Since we are triggering drum sounds, the duration doesn't really matter, so I picked 1. It needs to be short enough that notes don't overlap.

The note generation logic is wrapped in a loop from 0 to 15 to generate notes for different pitch and prime pairs. The starting basePitch of 36 is what Ableton uses for the lowest note of their built-in drum racks. We also increase the clipLengthInBeats significantly because it takes a long time for primes-based patterns to repeat.

var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,
              43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
var basePitch = 36;
var clipLengthInBeats = 256;

var clip = makeClip(0, 0, clipLengthInBeats);
var notes = [];

for (var i=0; i < 16; i++) {
  var pitch = basePitch + i;
  var prime = primes[i];

  for (var start=0; start < clipLengthInBeats; start++) {
    if(start % prime == 0) {
      notes.push({
        pitch: pitch,
        start_time: start,
        duration: 1,
      });
    }
  }
}

clip.call("add_new_notes", {notes: notes});
This should have generated a clip 256 beats in length (64 measures in 4/4) with a lot of notes in it. Time to test it out.

 On the very first beat, 16 drum samples play at the same time. It might be a bit loud, so keep your volume levels moderate. We'll address this momentarily.

Add a drum rack from the Live library to the track. You can find these under "Drums" and filtering by "Drum Kit". Most drum racks should have at least 16 samples and will work well with our generated clip. The nice thing about drum racks is it shows you the name of each drum in the MIDI clip view.

https://adammurray.link/max-for-live/js-in-live/generating-midi-clips/prime-rhythms-v1.png

Only basePitch on the First Beat
First improvement: Let's make it so only the basePitch plays on the first beat. If you zoom in on the clip's start, here's how things look now:

https://adammurray.link/max-for-live/js-in-live/generating-midi-clips/all-on-first-beat.png

Was that loud? Sorry about that. Always be mindful of your levels and don't turn things up too loud when experimenting with new things.

Let's fix this. When we decide to add a note, let's add more conditions: either the pitch must be the basePitch, or start must be greater than zero (the first beat). We can do it all in the same if condition:

for (var i=0; i < 16; i++) {
  var pitch = basePitch + i;
  var prime = primes[i];

  for (var start=0; start < clipLengthInBeats; start++) {
    if(start % prime == 0 && (pitch == basePitch || start > 0)) {
      notes.push({
        pitch: pitch,
        start_time: start,
        duration: 1,
      });
    }
  }
}
Here's the result:

https://adammurray.link/max-for-live/js-in-live/generating-midi-clips/only-base-pitch-on-first-beat.png

Perfect.

Speeding Things Up
My next issue with the generated clip is it's boring because it's too slow. Let's double the speed. The core logic of the loop to increment start++ and check start % prime == 0 is nice and simple, so I don't want to mess with that.

Here's one way to think about it: If we're doubling the speed, we're going to squeeze twice as many notes into the same amount of time. So what if we calculate the notes for a clip twice as long using the same algorithm we already built, and squish those notes into a space half the size by dividing time in half when we construct the note? Here's what I mean:

for (var i=0; i < 16; i++) {
  var pitch = basePitch + i;
  var prime = primes[i];

  var noteIdx = 0;
  for (var start=0; start < 2*clipLengthInBeats; start++) {
    if(start % prime == 0 && (pitch == basePitch || start > 0)) {
      notes.push({
        pitch: pitch,
        start_time: start/2,
        duration: 1,
      });
      noteIdx++;
    }
  }
}
Give it a try! Now the speed seems reasonable in the 120+ BPM range. Bump the tempo up as much as you want depending on your caffeine level.

Now might be a good time to play around, try different drum racks, and swap samples around. Maybe you don't want the kick drum to be the most frequently triggered sample. Hi-hats often work better as the fast drum. I like making hi-hats the fast drum (the 2 prime), a contrasting hat-like sound such as maracas the next fastest (the 3 prime) and the kick drum the one after that (the 5 prime). You do you.

But When Does it Repeat?
We can keep increasing the clipLengthInBeats to try to let the pattern play out:

var clipLengthInBeats = 1024;
It takes a while for this baby to repeat exactly. It's not even close to repeating yet!



In case you're wondering, that is 3434 notes. I logged notes.length to find out. Have you ever put that many notes in a single clip before? Me neither. This is the power of Max for Live. We could keep going, but be warned it can make your computer hang. I got scared after 30,000 notes. I bet I crashed someone's old computer. If you're feeling adventurous, go nuts.

How many beats will it take to repeat? Because all the numbers are prime, they have no common factors and we multiply them all together to find out how long it takes to repeat exactly. For the first sixteen primes, we're talking about 2×3×5×7×11×13×17×19×23×29×31×37×41×43×47×53. I was going to walk you through calculating it in JavaScript, but guess what, it's bigger than Number.MAX_SAFE_INTEGER and we can't even calculate it properly in JavaScript. Let's trust Wolfram Alpha with this question.

Right. Ok. It will take 32,589,158,477,190,044,730 beats before this pattern repeats. 32 quintillion beats. I don't completely trust my math at this point but I'm getting this: if we play it at 120 BPM, it will take 37 times the age of the universe before the pattern repeats. 🤯 Even if I'm off by a few orders of magnitude, you get the idea.

TL;DR - We cannot possibly make a Live clip long enough for this pattern to repeat exactly. Let's move on.

Varying Velocity
With some well-chosen drum sounds, I feel like there's some decent musical potential in this drum pattern. But it's too robotic: every drum hit sounds the same.

The main properties of a MIDI note are its pitch, its velocity, and when it occurs. So far we've only worked with the pitch and timing. By controlling the velocity, we can make variations between the individual notes for a given pitch, which gives the pattern more character and vibe.

I want to tie the velocity values to the pattern of primes. Modular arithmetic is good for creating cyclical patterns, like the pattern of notes and silences created by (start % prime) in the loop. We can do something similar for cycling through repeating patterns of velocities.

Here's the idea: the velocity pattern length will be the same as the current pitch's prime number. If the prime is 2, we'll cycling between loud and quiet notes. If the prime is 3, we'll cycling between loud, medium, and quiet notes. For 4, we'll cycling between loud, medium-loud, medium-quiet, quiet. And so on.

In MIDI, velocity is an integer ranging from 0-127 (like pitch). 0 is a special case that represents "off". 1 represents the smallest intensity for a played note, and 127 represents the highest intensity. We'll start each pitch off with it's highest velocity of 127 for the loud notes, and reduce it by 100 for it's quietest note. Every time we set a new pitch and prime, we'll start a new noteCounter variable at 0. Every time we play a note, we increment the counter. Then we can create the pattern of velocities I described with:

127 - 100 * (noteCounter % prime) / (prime - 1);
To make sense of this, let's consider some specific cases. When prime is 2, noteCounter % prime will alternate between 0 and 1, so the overall expression alternates between 127 and (127 - 100).

When prime is 3, noteCounter % prime will cycle between 0, 1, and 2. In this case, the value of (prime - 1) is 2 and the overall expression cycles between 127, (127 - 100 * 1/2) and (127 - 100). In all cases, the number multiplied by 100 goes from 0.0 to 1.0, and the overall velocity goes from 127 to 27.

for (var i=0; i < 16; i++) {
  var pitch = basePitch + i;
  var prime = primes[i];

  var noteCounter = 0;
  for (var start=0; start < 2*clipLengthInBeats; start++) {
    if(start % prime == 0 && (pitch == basePitch || start > 0)) {
      var velocity = 127 - 100 * (noteCounter % prime) / (prime - 1);
      notes.push({
        pitch: pitch,
        start_time: start/2,
        duration: 1,
        velocity: velocity,
      });
      noteCounter++;
    }
  }
}

clip.call("add_new_notes", {notes: notes});
We can check this works as intended in the clip view by selecting individual drums/pitches and examining the velocities in the velocity lane. Here's the second pitch with a cycle of 3:
https://adammurray.link/max-for-live/js-in-live/generating-midi-clips/velocity-3-prime.png

And the third pitch with a cycle of 5:

https://adammurray.link/max-for-live/js-in-live/generating-midi-clips/velocity-5-prime.png

Looks good.

You may not be able to hear this very well though. Not all drum racks respond to velocity equally. If all the notes still sound too similar and repetitive, try changing drum racks again. You're looking for drum racks where the drum samples have velocity affecting volume, which will often be via this control:

https://adammurray.link/max-for-live/js-in-live/generating-midi-clips/simpler-velocity-settings.png

If you want to exaggerate the affect of velocity, you can increase that "Vol < Vel" control to closer to 100%, and then right click and select "Copy value to siblings" to apply this setting to all drums in the drum rack.

https://adammurray.link/max-for-live/js-in-live/generating-midi-clips/copy-velocity-settings.png

Other Note Properties
Out of the remaining note properties, probability and velocity_deviation are the most interesting for this script. You can use probability to randomly skip notes, and velocity_deviation to randomly change the velocity within a specified range.

If you've been following along, you should have all the tools you need to explore these features if desired. Here's the basic usage:

notes.push({
  pitch: pitch,
  start_time: start / 2,
  duration: 1,
  velocity: velocity,
  probability: 0.5, // randomly skip about half the notes
  velocity_deviation: 50, // randomly add up to 50 to the velocity
                          // Note: velocity_deviation can be negative
}); 
 
I'm not including this in the final version of the script, but I encourage you to explore these features.

We're Doing it "Wrong" Again
In case you didn't see this in the previous tutorial or forgot, I need to remind you we are doing an "exploratory coding session", and writing new LiveAPI() at the top-level of the JavaScript code won't work in a real device. It doesn't matter that it's inside a makeClip() function, it's still executed immediately from the top-level code.

The general simple solution is to wrap the code with function bang() {...} and trigger it from the Max patch. I covered this in detail in "Safely Constructing a LiveAPI Object", so give it a (re-)read if needed, especially if you want to expand the ideas here into a real device for day-to-day usage in Live.

For a note generator devices like this, putting it in a Max MIDI Tool is probably the best solution. Alas, I don't have time to get into that here, so check out the official docs.

Final Version
For reference, here's the complete script with all the code:

function makeClip(trackIndex, clipIndex, lengthInBeats) {
  var clipSlot = new LiveAPI("live_set tracks " + trackIndex + " clip_slots " + clipIndex);
  if(clipSlot.get("has_clip") == false) {
    clipSlot.call("create_clip", lengthInBeats);
  }
  var clip = new LiveAPI(clipSlot.unquotedpath + " clip");
  clip.call("remove_notes_extended", 0, 128, 0, clip.get("length"));
  clip.set("start_marker", 0);
  clip.set("end_marker", lengthInBeats);
  clip.set("loop_start", 0);
  clip.set("loop_end", lengthInBeats);
  return clip;
}

var primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,
              43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
var basePitch = 36;
var clipLengthInBeats = 256;

var clip = makeClip(0, 0, clipLengthInBeats);
var notes = [];

for (var i=0; i < 16; i++) {
  var pitch = basePitch + i;
  var prime = primes[i];

  var noteCounter = 0;
  for (var start=0; start < 2*clipLengthInBeats; start++) {
    if(start % prime == 0 && (pitch == basePitch || start > 0)) {
      var velocity = 127 - 100 * (noteCounter % prime) / (prime - 1);
      notes.push({
        pitch: pitch,
        start_time: start/2,
        duration: 1,
        velocity: velocity,
      });
      noteCounter++;
    }
  }
}

clip.call("add_new_notes", {notes: notes});
Next Steps
I have made updated versions of all these tutorials for Max 9's new v8 object. It's a very nice update! If you're on the latest version of Max and Live, I highly recommend you try using v8 and v8.codebox instead of the js object.

Have feedback or questions? Email me: adam@adammurray.link (check spam for my replies)