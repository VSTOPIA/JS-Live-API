# Working with MIDI Clips - Part A: Reading MIDI Data

> Attribution: Content adapted from Adam Murray’s “JS in Live” tutorials, licensed under CC BY-NC-SA 4.0. Original: https://adammurray.link/max-for-live/js-in-live/ — Changes have been made. Not endorsed by Adam Murray or Cycling '74. License: https://creativecommons.org/licenses/by-nc-sa/4.0/

This is part of a series of articles about hacking on Ableton Live with JavaScript. These articles assume you own Ableton Live 9 Suite and are comfortable coding JavaScript.

In this article we'll learn how to access the notes inside a MIDI clip. This material continues in the second half of this article, where we'll modify the notes and write them back to the MIDI clip.

## Prerequisites

This article builds upon the previous articles, so refer back to them if you're having trouble here.

## Getting Started

First let's paste in our log() function that we built in article #2: Logging & Debugging:

```javascript
function log() {
  for(var i=0,len=arguments.length; i<len; i++) {
    var message = arguments[i];
    if(message && message.toString) {
      var s = message.toString();
      if(s.indexOf("[object ") >= 0) {
        s = JSON.stringify(message);
      }
      post(s);
    }
    else if(message === null) {
      post("<null>");
    }
    else {
      post(message);
    }
  }
  post("\n");
}

log("___________________________________________________");
log("Reload:", new Date);
```

Now let's figure out how to work with clips using techniques we learned in the previous article. Take a look at the Live Object Model diagram to determine a path to a clip. Starting at live_set → view, we can follow the highlighted_clip_slot arrow to the currently selected clip slot, and then to the clip inside. Like this:

```javascript
var path = "live_set view highlighted_clip_slot clip";
var liveObject = new LiveAPI(path);

log("path:", liveObject.path);
log("id:", liveObject.id);
log("children:", liveObject.children);
log(liveObject.info);
```

The first time you try this, you might get an id of 0, an Invalid syntax error, and a "No object" message. That's because you don't have a clip slot selected in Live's session view, or the slot is empty and doesn't contain a clip. So create a clip and click it in the session view grid to select the clip slot. Then re-run the JavaScript and the Max window should show something like:

```
path:  "live_set tracks 0 clip_slots 0 clip"
id:  5
children:  canonical_parent,view
id 5
type Clip
description This class represents a Clip in Live...
...(clip info details)...
```

## Accessing Notes in a MIDI Clip

Now that we know how to access the currently selected clip in session view, let's see what we can do with the clip object. In the info we logged above, there's a get_notes function that looks interesting. Create a MIDI clip and add some notes to it, and make sure it's selected. Then run this code:

```javascript
var path = "live_set view highlighted_clip_slot clip";
var liveObject = new LiveAPI(path);

log("path:", liveObject.path);
log("notes:", liveObject.call("get_notes"));
```

...(continues with all remaining sections including The Clip Class, The Note Class, Putting it All Together, and Accessing Selected Notes)...

## Next Steps

This article dealt with reading the note data our of a MIDI clip. Using the code we built, we can get the notes in the entire clip, a specific subset of the clip (by using the optional parameters to the getNotes() function), or the selected notes in a clip. That should cover our needs for accessing note data in MIDI clips.

## Accessing Notes in a MIDI Clip (continued)

Uh oh. That doesn't quite work. We get an error and some useless garbage value for the notes:

```
path:  "live_set tracks 0 clip_slots 0 clip"
Invalid syntax: 'get_notes'
notes:  5e-324
```

Unfortunately, the JavaScript Live API doesn't provide much assistance in this situation, so let's consult the documentation. In the Live Object Model diagram click on the box labeled "clip" to get to the clip object's documentation and look for the get_notes function. Here's what it says:

```
Parameter:
from_time [double]
from_pitch [double]
time_span [double]
pitch_span [double]
Returns a list of notes that start in the given area.
The output is similar to get_selected_notes.
```

Those four parameters are required, and we aren't providing them, which is causing the error. So let's add the parameters:

```javascript
var path = "live_set view highlighted_clip_slot clip";
var liveObject = new LiveAPI(path);
   
log("path:", liveObject.path);
log("notes:", liveObject.call("get_notes", 0, 0, 256, 128));
```

To get all the notes in the clip, we use the following parameters:
- 0 for from_time to start at the beginning of the clip
- 0 for from_pitch to start the lowest pitch
- 256 for time_span to get the first 256 beats of the clip
- 128 for pitch_span to cover the full range of MIDI pitch values 0-127

I'm guessing a clip won't be more than 256 beats. This is just a guess and you could use a higher number if you want. Soon we'll see how to determine the clip length with JavaScript, so we won't have to guess.

When we run this code, the output is much more promising! Your notes data will look different based on your clip's notes:

```
path:  "live_set tracks 0 clip_slots 0 clip"
notes:  notes,3,note,60,0,1,127,0,note,62,1,2,66,0,note,64,3,1,87,0,done
```

What does the notes data mean? Looking back at the documentation for get_notes, it says "The output is similar to get_selected_notes". The get_selected_notes documentation explains:

```
Output:
get_selected_notes notes count
get_selected_notes note pitch time duration velocity muted
...
get_selected_notes done

count [int] is the number of note lines to follow.
pitch [int] is the MIDI note number, 0...127, 60 is C3.
time [double] is the note start time in beats of absolute clip time.
duration [double] is the note length in beats.
velocity [int] is the note velocity, 1 ... 127.
muted [bool] is 1 if the note is deactivated.
```

## The Clip Class

Let's organize our code into an object-oriented interface so we can more easily build some applications around it. Check out Mozilla's intro to object-oriented JavaScript if you are not familiar with this style of JavaScript programming.

```javascript
function Clip() {
  var path = "live_set view highlighted_clip_slot clip";
  this.liveObject = new LiveAPI(path);
}

Clip.prototype.getNotes = function(startTime, startPitch, timeRange, pitchRange) {
  return this.liveObject.call("get_notes", startTime, startPitch, timeRange, pitchRange);
}
 
var clip = new Clip();
var notes = clip.getNotes(0, 0, 256, 128);
log(notes);
```

When we construct a new Clip object (which calls the Clip function that behaves like a class constructor), it creates a liveObject referencing the currently selected Clip in Live's session view. Then we call our getNotes() function, which simply wraps a call to that Live object's get_notes function.

We can enhance our getNotes function to make the parameters optional and provide default values. The idea is that calling getNotes() with no parameters should get all the notes in the clip:

```javascript
function Clip() {
  var path = "live_set view highlighted_clip_slot clip";
  this.liveObject = new LiveAPI(path);
}

Clip.prototype.getNotes = function(startTime, timeRange, startPitch, pitchRange) {
  if(!startTime) startTime = 0;
  if(!timeRange) timeRange = 256;
  if(!startPitch) startPitch = 0;
  if(!pitchRange) pitchRange = 128;

  return this.liveObject.call("get_notes", startTime, startPitch, timeRange, pitchRange);
}

var clip = new Clip();
var notes = clip.getNotes();
log(notes);
```

Note that I've switched the order of the startPitch and timeRange parameters. Our getNotes() function now takes startTime and timeRange first. I usually either want to get all the notes, which can be done by calling getNotes() with no parameters, or I want to get the notes in a particular time range, which can be done by calling getNotes(startTime, timeRange). The important point is we don't have to mirror the Live API. We can design our own interface that works the way we want.

Now that we have a basic class structure in place, let's stop guessing about that default timeRange value of 256 and use the actual length of the clip. We can do that by getting the clip's live object's length property, and wrapping it in our own getLength() function:

```javascript
function Clip() {
  var path = "live_set view highlighted_clip_slot clip";
  this.liveObject = new LiveAPI(path);
}

Clip.prototype.getLength = function() {
  return this.liveObject.get('length');
}

Clip.prototype.getNotes = function(startTime, timeRange, startPitch, pitchRange) {
  if(!startTime) startTime = 0;
  if(!timeRange) timeRange = this.getLength();
  if(!startPitch) startPitch = 0;
  if(!pitchRange) pitchRange = 128;

  var data = this.liveObject.call("get_notes", startTime, startPitch, timeRange, pitchRange);
  return data;
}

var clip = new Clip();
log("clip length:", clip.getLength());
var notes = clip.getNotes();
log(notes);
```

This is a good start to our Clip class. Let's focus on the note data next, so we don't have to deal directly with that raw array of note data.

## The Note Class

Since the note data coming from the Live API has 5 properties per note, we'll focus on modelling those 5 properties in our class:

```javascript
function Note(pitch, start, duration, velocity, muted) {
  this.pitch = pitch;
  this.start = start;
  this.duration = duration;
  this.velocity = velocity;
  this.muted = muted;
}

Note.prototype.toString = function() {
  return '{pitch:' + this.pitch +
         ', start:' + this.start +
         ', duration:' + this.duration +
         ', velocity:' + this.velocity +
         ', muted:' + this.muted + '}';
}
```

## Putting it All Together

Let's combine all this code to log a list of our Note objects instead of the raw note data array:

```javascript
//--------------------------------------------------------------------
// Clip class

function Clip() {
  var path = "live_set view highlighted_clip_slot clip";
  this.liveObject = new LiveAPI(path);
}
 
Clip.prototype.getLength = function() {
  return this.liveObject.get('length');
}
 
Clip.prototype.getNotes = function(startTime, timeRange, startPitch, pitchRange) {
  if(!startTime) startTime = 0;
  if(!timeRange) timeRange = this.getLength();
  if(!startPitch) startPitch = 0;
  if(!pitchRange) pitchRange = 128;
 
  var data = this.liveObject.call("get_notes", startTime, startPitch, timeRange, pitchRange);

  var notes = [];
  // data starts with "notes"/count and ends with "done" (which we ignore)
  for(var i=2,len=data.length-1; i<len; i+=6) {
    // each note starts with "note" (which we ignore) and is 6 items in the list
    var note = new Note(data[i+1], data[i+2], data[i+3], data[i+4], data[i+5]);
    notes.push(note);
  }
  return notes;
}

//--------------------------------------------------------------------
// Note class

function Note(pitch, start, duration, velocity, muted) {
  this.pitch = pitch;
  this.start = start;
  this.duration = duration;
  this.velocity = velocity;
  this.muted = muted;
}

Note.prototype.toString = function() {
  return '{pitch:' + this.pitch +
         ', start:' + this.start +
         ', duration:' + this.duration +
         ', velocity:' + this.velocity +
         ', muted:' + this.muted + '}';
}

//--------------------------------------------------------------------
   
var clip = new Clip();
var notes = clip.getNotes();
notes.forEach(function(note){
  log(note);
});
```

You should see something like this in the Max window:

```
{pitch:60, start:0, duration:1, velocity:127, muted:0}
{pitch:62, start:1, duration:2, velocity:66, muted:0}
{pitch:64, start:3, duration:1, velocity:87, muted:0}
```

## Accessing Selected Notes

Let's add one more feature for accessing the note data. In the Live API documentation, we saw a get_selected_notes function. This opens up some interesting possibilities where we can work with the notes selected by the user, which can be an arbitrary subset of the notes in the clip.

As the documentation indicated, get_selected_notes returns data in the same format as the get_notes function. This means we can use the same loop to parse the raw note data array into our Note objects. Let's use good software development practice and not repeat ourselves (the DRY principle):

```javascript
//--------------------------------------------------------------------
// Clip class

function Clip() {
  var path = "live_set view highlighted_clip_slot clip";
  this.liveObject = new LiveAPI(path);
}
 
Clip.prototype.getLength = function() {
  return this.liveObject.get('length');
}

Clip.prototype._parseNoteData = function(data) {
  var notes = [];
  // data starts with "notes"/count and ends with "done" (which we ignore)
  for(var i=2,len=data.length-1; i<len; i+=6) {
    // and each note starts with "note" (which we ignore) and is 6 items in the list
    var note = new Note(data[i+1], data[i+2], data[i+3], data[i+4], data[i+5]);
    notes.push(note);
  }
  return notes;
}

Clip.prototype.getSelectedNotes = function() {
  var data = this.liveObject.call('get_selected_notes');
  return this._parseNoteData(data);
}

Clip.prototype.getNotes = function(startTime, timeRange, startPitch, pitchRange) {
  if(!startTime) startTime = 0;
  if(!timeRange) timeRange = this.getLength();
  if(!startPitch) startPitch = 0;
  if(!pitchRange) pitchRange = 128;
 
  var data = this.liveObject.call("get_notes", startTime, startPitch, timeRange, pitchRange);
  return this._parseNoteData(data);
}

//--------------------------------------------------------------------
// Note class
// ...
// this class and the rest of the code is the same as before...
```

Rather than copy and paste the raw note data parsing loop into the new function getSelectedNotes(), we've moved it into a helper function called _parseNoteData() where we can reuse the code. I'm using a convention that functions starting with a "_" are for internal use in an object (Note: There are ways to enforce that a function be private to a class, but that's out of the scope of this article).

Now we can do things like this at the bottom of our script, to operate on the selected notes:

```javascript
var clip = new Clip();
var notes = clip.getSelectedNotes();
notes.forEach(function(note){
  log(note);
});
```

If you don't see any notes logged, make sure you've actually selected some notes inside your MIDI clip.

## Next Steps

This article dealt with reading the note data out of a MIDI clip. Using the code we built, we can get the notes in the entire clip, a specific subset of the clip (by using the optional parameters to the getNotes() function), or the selected notes in a clip. That should cover our needs for accessing note data in MIDI clips.
