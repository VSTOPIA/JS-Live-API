# JS Live API » #3 API Basics

This is the 3rd of a series of articles about hacking on Ableton Live with JavaScript. These articles assume you own Ableton Live 9 Suite and are comfortable coding JavaScript.

## Overview

In this article we'll learn how to access the different Live objects available to the Live API, how to examine their properties and child objects, and how to make changes to the objects.

This article builds upon the previous articles, so refer back to them if you're having trouble here.

## Live API Documentation

I can't cover everything about the Live API in these articles. When you need more information, Max's documentation is a good resource:

- Creating Devices that use the Live API is a good place to start.
- The LiveAPI Object is the JavaScript object used to access the Live API.
- The Live Object Model is a reference of all the different Live objects available in the Live API.
- Live API Overview is an overview of general Live API concepts.

Note: This page focuses on Max objects, not JavaScript. The concepts are the same, but we won't be using any Max objects like live.object, live.path, or live.observer. Instead, we do all this via the JavaScript LiveAPI object.

## Getting Started

First let's paste in our log() function that we built in article #2: Logging & Debugging. This will help us explore the Live API. The rest of this article assumes the log() function is in your script. I won't repeat this code again, so pretend it's at the top of all the code examples.

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

Ready? Let's create a LiveAPI object and take a look at some of its properties:

```javascript
var liveObject = new LiveAPI();

log("path:", liveObject.path);
log("id:", liveObject.id);
log("children:", liveObject.children);
log(liveObject.info);
```

The Max window shows:
```
path:
id:  0
children:  this_device,control_surfaces,live_app,live_set
"No object"
```

Hmmm... The path is empty and we're apparently looking at "No object". But it has some children, which seems promising (more on that soon).

The reason we have no object is because we haven't actually connected this LiveAPI to an actual Live object yet. We can do that by giving a path to the LiveAPI constructor:

```javascript
var liveObject = new LiveAPI("live_set master_track");

log("path:", liveObject.path);
log("id:", liveObject.id);
log("children:", liveObject.children);
```

I've omitted liveObject.info this time, we'll come back to that.

This time we should see something like this (your id may be different):
```
path:  "live_set master_track"
id:  4
children:  canonical_parent,clip_slots,devices,mixer_device,view
```

## Live Paths

As we just saw, to connect to an object in Live we need to give the LiveAPI a path to the object. How do we determine the path?

Examine the Live Object Model diagram. We form paths by starting from a root object and following the arrows on the diagram from object to object. What's a root object? Remember the children of the liveObject when we had "No object"? Those are the root objects: live_app, live_set, control_surfaces, and this_device.

As we follow the arrows around the Live Object Model diagram, we build a space separated string. That's the path. When we did "live_set master_track", this corresponds to starting at the live_set root object (towards the upper left of the diagram), and following the master_track arrow down to a Track object (represented by the box that says "Track").

Let's try a more complex path. Follow along with the arrows in the diagram.

```javascript
var path = "live_set master_track mixer_device volume";
var liveObject = new LiveAPI(path);

log("path:", liveObject.path);
log("id:", liveObject.id);
log("children:", liveObject.children);
```

```
path:  "live_set master_track mixer_device volume"
id:  2
children:  canonical_parent
```

Here we've followed arrows in the diagram as far as we can, but there's still a child called "canonical_parent". As you might guess from the name, this is a parent object from which you can reach this object. So the term "child" is misleading here. Think of children as paths we can follow to reach other objects.

## Live Objects

Now we can access Live objects via paths. We can learn a lot about the different Live objects by looking at their info property.

```javascript
var liveObject = new LiveAPI("live_set");
log(liveObject.info);
```

```
id 4
type Song
description This class represents a Live set.
children cue_points CuePoint
children return_tracks Track
children scenes Scene
children tracks Track
children visible_tracks Track
child master_track Track
child view View
property appointed_device Device
property arrangement_overdub bool
property back_to_arranger bool
property can_jump_to_next_cue bool
property can_jump_to_prev_cue bool
property can_redo bool
property can_undo bool
property clip_trigger_quantization int
property current_song_time float
property exclusive_arm bool
property exclusive_solo bool
property groove_amount float
property is_playing bool
property last_event_time float
property loop bool
property loop_length float
property loop_start float
property metronome bool
property midi_recording_quantization int
property nudge_down bool
property nudge_up bool
property overdub bool
property punch_in bool
property punch_out bool
property re_enable_automation_enabled bool
property record_mode bool
property select_on_launch bool
property session_automation_record bool
property session_record bool
property session_record_status int
property signature_denominator int
property signature_numerator int
property song_length float
property swing_amount float
property tempo float
function capture_and_insert_scene
function continue_playing
function create_audio_track
function create_midi_track
function create_return_track
function create_scene
function delete_scene
function delete_track
function duplicate_scene
function duplicate_track
function get_beats_loop_length
function get_beats_loop_start
function get_current_beats_song_time
function get_current_smpte_song_time
function is_cue_point_selected
function jump_by
function jump_to_next_cue
function jump_to_prev_cue
function play_selection
function re_enable_automation
function redo
function scrub_by
function set_or_delete_cue
function start_playing
function stop_all_clips
function stop_playing
function tap_tempo
function trigger_session_record
function undo
done
```

First there's some general information: id, type, and description. Note the type of this object is a Song. If you click the Song box back in the Live Object Model diagram, it will jump to the reference for the Song object, which provides more detailed information.

After the general info, there's a long list of the things in the object. They fall into 3 categories: children, properties, and functions. Let's take a closer look at each.

## Live Object Children

As we've seen, Live object children and Live paths go hand in hand.

We can determine the children of a Live object by consulting the Live Object Model reference, or by looking at a LiveAPI object's children or info properties: `log(liveObject.children);` `log(liveObject.info);`

We form a Live path by going from one child to the next in the hierarchy of Live objects. Sometimes a child is actually a parent in the case of "canonical_parent", so we can move up and down the object hierarchy. For example, the paths "live_set master_track canonical_parent" and "live_set" will both give you the Song object.

Children come in two forms: single child and children list. You'll see both forms in the info property, such as when we logged liveObject.info for the live_set path in the previous section:

```
...
children cue_points CuePoint
children return_tracks Track
children scenes Scene
children tracks Track
children visible_tracks Track
child master_track Track
child view View
...
```

Children lists have additional implications for Live paths. We need to tell Live which child in the list we want to access. This is done by providing an index into the list, counting from 0 as is typical in programming languages. Let's take a look at some examples:

```javascript
// the first track:
new LiveAPI("live_set tracks 0");

// the second track:
new LiveAPI("live_set tracks 1");

// the second clip slot in the third track:
new LiveAPI("live_set tracks 2 clip_slots 1")

// the first control surface:
new LiveAPI("control_surfaces 0");
```

Back in the Live Object Model reference diagram, take a closer look at the different types of arrows. Arrows come in single and list types. List type arrows are children lists where we need to provide an index to access a particular object. Also note the "canonical relations" are in bold. These indicate which arrows to follow backwards when going up to a "canonical_parent".

## Live Object Properties

Live object properties store the state of each Live object. They allow us to look at the current state of Live and change that state.

We can examine the object's properties with the liveObject.get() method:

```javascript
var liveObject = new LiveAPI("live_set");
log("tempo:", liveObject.get("tempo") );
```

And we can change the object's properties with the liveObject.set() method:

```javascript
var liveObject = new LiveAPI("live_set");
liveObject.set("tempo", 80);
```

Note the tempo has changed in Live after you run this script. Also note this change is performed as an undoable operation. I believe you can always undo changes made by api.set().

## Live Object Functions

Besides setting properties, we can call functions on Live objects in order to make changes to Live and trigger various features. For this we use liveObject.call(). Here's a simple example. Make sure the transport is stopped and try the following script:

```javascript
var liveObject = new LiveAPI("live_set");
liveObject.call("start_playing");
```

Depending on the nature of the function, it's result may or may not be undoable. This should reflect typical Live behavior. In this case, clicking play on the transport is not undoable, so neither is the Song's start_playing function.

Many things that can be clicked on and interacted with the mouse in Live's GUI, can also be triggered with functions in the LiveAPI.

This is one of the simplest examples of calling a Live object function, because it has no parameters. In future articles we'll see how to call functions that take parameters.

## this_device

You may have noticed the root object this_device does not appear on the Live Object Model diagram. It's a special path for the Max for Live Device object that contains our JavaScript code. The canonical_parent is particular useful here, because we can start from our Max for Live device and go upwards to the containing track. From there we can interact with Live objects relative to the current Max for Live device.

```javascript
var liveObject = new LiveAPI("this_device");
log("current Max for Live device path:", liveObject.path);

liveObject = new LiveAPI("this_device canonical_parent");
log("current Max for Live device's parent:", liveObject.path);
```

```
current Max for Live device path:  "live_set tracks 0 devices 0"
current Max for Live device's parent:  "live_set tracks 0"
```

In this case, the Max for Live device was on the first track.

## Next Steps

There are a lot of different Live objects with various properties and function. Use what we've learned in this article to explore the parts of the Live API that interest you.

In the next article, we'll focus on the Clip object and learn how to manipulate the notes in a MIDI clip. Even if you are not particularly interested in MIDI clips, it's a good opportunity to start applying the basic Live API techniques from this article in a more practical situation. For example, we'll call functions that take parameters, and deal with parsing raw data from the Live API into our own custom JavaScript objects.