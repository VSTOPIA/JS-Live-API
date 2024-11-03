# JS Live API » #5 Building a User Interface

This is part of a series of articles about hacking on Ableton Live with JavaScript. These articles assume you own Ableton Live 9 Suite and are comfortable coding JavaScript.

## Overview

In this article, we'll depart from JavaScript programming to build a user interface for our Max for Live device. We'll do this for the "humanize" MIDI clip randomization features we built in the previous article.

## Prerequisites

I'll assume you are a Max beginner and try to explain everything we're doing, but Max is a complex piece of software and there may be some things you don't understand right away. Just do your best to follow along and use the screenshots as a guide. If you're struggling or want to learn more about Max, I suggest you read Max's tutorials under its Help menu. At the end of the article, I'll link to a fully functional Live Set containing the Max for Live device we build here, in case you can't get yours to work.

This article builds upon the previous articles, so refer back to them if you're having trouble here.

## Getting Started

If needed, copy the finished code from the end of the previous article and add it to the JavaScript file in your Max for Live device. Since we'll be triggering the humanize function from the Max for Live device, we can delete the call to `humanize();` at the end of the script. Then, save everything as described in the first article. I named my files "humanize", as you'll see in the screenshots in this article.

Let's review how our JavaScript humanize function is implemented. We'll be building an interface around this function:

```javascript
function humanize(type, maxTimeDelta, maxVelocityDelta) {
    var humanizeVelocity = false,
        humanizeTime = false;
   
    switch(type) {
      case "velocity": humanizeVelocity = true; break;
      case "time": humanizeTime = true; break;
      default: humanizeVelocity = humanizeTime = true;
    }
   
    if(!maxTimeDelta) maxTimeDelta = 0.05;
    if(!maxVelocityDelta) maxVelocityDelta = 5;
    
    clip = new Clip();
    notes = clip.getSelectedNotes();
    notes.forEach(function(note) {
      if(humanizeTime) note.start += maxTimeDelta * (2*Math.random() - 1);
      if(humanizeVelocity) note.velocity += maxVelocityDelta * (2*Math.random() - 1);
    });
    clip.replaceSelectedNotes(notes);
}
```

Now we can close the JavaScript editor window and focus on the Max for Live device in Max's editing window. If it still has the default labels like "< Build your MIDI effect here", you can delete those, leaving us with a very simple device as our starting point.

## Calling JavaScript Functions with Max Messages

Let's add a message object that can trigger our humanize function:

1. Make sure the device is unlocked (see button in lower left of the Max editor), and double click an empty part of the background. This brings up Max's Object Explorer.
2. Under the "Basic" category there's an object called "message". Drag it into your device.
3. Type "humanize" into the message box.
4. Connect the message object to the js object. You do this by dragging from the outlet of the message box (the short black line in the lower left) to the inlet of [js] (the black line in the upper left).

Pro tip: Instead of using the Object Explorer, you can also type 'm' on your keyboard in an unlocked device. This is a shortcut to add a new message object.

Now lock the Max for Live device so we can interact with it.

Go back to Live's session view and make sure you have a MIDI clip with notes in it, and select the MIDI notes. Click the humanize message in the Live device. It should trigger our JavaScript `humanize()` function and randomize the time and velocity. If it's not working, check the Max Window. You might have a typo in "humanize" or perhaps the JavaScript code was not set up correctly.

## Passing Parameters to JavaScript Functions

Let's add 2 more message objects. This time set the message text to "humanize time" and "humanize velocity". Then connect them to the js object and lock the patcher again.

Now when you click "humanize time", it will only randomize the timing of the notes. Similarly, "humanize velocity" will only randomize the velocity.

As you've probably guessed, sending these messages to our JavaScript is like calling `humanize("time");` and `humanize("velocity");`. The first part of the Max message (up to the first space) controls what function will be called in the JavaScript. The remaining (space-separated) parts of the Max message become the parameters of the function call.

Recall that our humanize function accepts some optional parameters to control the `maxTimeDelta` and `maxVelocityDelta` of the randomization. We can use Max messages to send these parameters too. Simply unlock your device and try changing the messages to things like "humanize time 0.25" and "humanize velocity 0 64". Then lock the device and click the messages again.

Pro tip: if you command+click (ctrl+click on Windows) an object in an unlocked device, it acts like a click in a locked device. So you can interact with the message boxes without locking & unlocking the device all the time. Alternately, command+e (ctrl+e on Windows) is a shortcut for locking & unlocking the device.

## Passing Variable Parameters to JavaScript Functions

Now let's see how to pass arbitrary values for `maxTimeDelta` and `maxVelocityDelta` to our JavaScript. Delete all the message objects we've added so far because we're going to do things a different way. We want to construct messages like "humanize time X", where X is some number. One way to do this is to start with the message X and prepend "humanize time" to that message. Max has an object called "prepend" for doing this.

We could keep using the Object Explorer to add new objects, but let's learn another shortcut. In the unlocked device type 'n' to create a new object. Immediately after typing 'n' the cursor will be inside the blank object box. Type "prepend humanize time" and hit enter. Then connect the [prepend] to [js].

Now we can create message objects with any value we want and connect them to [prepend].

This is a step in the right direction, but we still need to create a message object for every single value. We can use a UI object that can send different values from one object. There's a lot of options for doing this. We're going to use a slider.

Delete all the message objects again. Type 'n' and create an object "live.slider". This object will need to be customized to behave the way we want. Click the "Open Sidebar" button in the lower right of the Max editor. Open the "Inspector" tab in the sidebar, and click on the slider object we just created to see the slider's inspector with lots of different settings.

Scroll down towards the bottom of the slider's inspector. There are 3 settings we want to change:

- Short Name: time
- Range/Enum: 0.01 0.25
- Unit Style: Float

Note the changes to the slider as we change the settings.

Note we set the lowest slider value to 0.01 instead of 0.0. One reason for that is so that triggering humanize will always do something. But there's a technical reason as well. Recall the JavaScript code does `if(!maxTimeDelta) maxTimeDelta = 0.05;` As mentioned in the previous article, if `maxTimeDelta` is 0, then `(!maxTimeDelta)` will be true and we'll use the default value 0.05. There are other ways to handle default parameters in JavaScript, so that 0 doesn't turn into the default value like this.

Anyway, now you can try locking the device and dragging the slider. You may be surprised to see that as we drag the slider, the notes in our MIDI clip are continuously randomized. That's because every adjustment to the slider sends the slider's value to [prepend], which sends the message on to [js] and triggers our humanize function.

That's not what we want! We want to use the slider to set `maxTimeDelta` and then trigger the message. To do that, we need to store the message coming out of [prepend] in another object. We can add another UI object to trigger the stored message and send it to [js] whenever we want.

## Storing Messages and Sending Them Later

As usual with Max, there are many different ways to accomplish the same task. We're going to use a message object in a new way, to store the message coming out of [prepend]. This has the added benefit of seeing the messages that [prepend] constructs. This technique is a standard way to debug Max devices.

First, let's disconnect [prepend] and [js]. Click the line connecting them and hit the delete key. Then add a new message object but don't type anything into this one. The trick to storing a message in a message box is to use the right inlet of the message box. So connect prepend to the right inlet of the message box.

If you're feeling a bit overwhelmed by all the behaviors of these Max objects (and we've only looked at a handful, there are hundreds of objects in Max), here are a few tips:

- Hover over the inlets and outlets of an object in an unlocked device to get a summary of what kinds of messages an inlet receives or an outlet sends.
- In the sidebar, open the Reference tab and click on an object to learn more about the arguments (the parameters you can type after the object name when creating the object) and messages it can receive.
- Right click an object and select "Open Help" to open an interactive help file where you can learn a lot by playing with the object and even editing the help file to experiment.

Anyway, if you now drag the slider (in the locked device), it will update the message box.

Let's proceed with adding a button to trigger this message and send it to [js]. Create a new object "live.text" and open its inspector. Scroll down towards the bottom and there's 2 settings to change: Mode: Button and Text Off Label: time.

Connect the live.text object to the message box, and connect the message box to [js]. Now we can lock the device, drag the slider to set a `maxTimeDelta`, and finally click the live.text "time" button to randomize the time with the `maxTimeDelta` we've selected.

We now have a UI for randomizing time!

Before moving on, set up the same structure with a slider, [prepend], message box, and live.text button to store and trigger "humanize velocity" with a variable `maxVelocityDelta`. Remember our humanize function looks like `function humanize(type, maxTimeDelta, maxVelocityDelta)`, so we need to prepend "humanize velocity 0" to provide a value for `maxTimeDelta` (the actual value does not matter in this case).

Another important difference with the velocity interface is the velocity slider's inspector should set Range/Enum: 1 127 to provide a sensible range for velocity randomization. Also, since velocity is an integer value, you can set Type: Int (0-255) and Unit Style: Int.

Your device should look something like this when you are done.

## Using Pop-up Windows

We've made good progress, but you may have noticed some problems with what we've built so far. The point of this interface is to have a device inside Ableton Live. So you might try saving your Live device, closing it, and trying to use it inside Live. The problem is we can't see our device and the MIDI clip at the same time!

We'll address this problem by moving the interface into a popup window. Note this problem is pretty specific to devices that manipulate clips, or advanced multi-window devices. If you are building a "proper" instrument or effect, there may be no need for a popup window.

Edit the device, and select the 2 sliders and the 2 live.text buttons. Then in Max's Edit menu, select "Encapsulate". This will replace the 4 selected objects with a [p] object.

"p" is an abbreviation for the "patcher" object. A patcher object represents a single window of a Max for Live device. A window is also called a "patch". So we just put a "subpatch" inside of our main patch, which split our device into 2 windows. You can think of it like a subroutine in traditional programming languages. It's a way of organizing complex devices. We're going to take advantage of the fact that it creates a new window.

To see the new window we just created, lock the device and double click on the "p" object. This opens a window containing the 4 objects we just encapsulated into the subpatch, along with 4 additional objects numbered 1-4. Those objects are the outlets of the patcher object back in the main patch.

See how the window title bar says [sub patch]? It's going to look like that when we're using the device inside Ableton Live, which isn't very descriptive. We can change the name by going back to the main patch and giving the [p] object a parameter. Click into the object and change the text to "p humanize".

At this point you can save and close the device, and back inside Live, double click the [p humanize] object to open the window. Now we can see our sliders and buttons and MIDI clips at the same time. This is better, but there are still some problems. If you open the popup window, and then click on Live's window the popup window, goes behind the Live window. So you have to keep all your windows side by side.

It would be nice to provide a clear button to open the popup window instead of needing to double click [p humanize], which won't be obvious to other people. Also, our interface includes all the "patch cables" between the different objects, and includes objects that shouldn't be part of the interface like [prepend]. The device is usable like this, but it's ugly and amateurish.

## Cleaning up the Interface

Edit the device and open the subpatch. Make sure the subpatch is unlocked, and type 'n' to add a new object. Add an "inlet" object. Create a message object with this text "window flags nomenu, window flags float, window exec, front". Create another object called "thispatcher". Then connect the inlet to the message and the message to [thispatcher]. It should look like this when you're done.

[thispatcher] allows control over the current patch/window. The message we're sending it has 4 parts. "window flags nomenu" disables the popup window's menu on Windows. "window flags float" creates a floating window that will always be on top of Live's window. "window exec" applies the changes to the window, and finally "front" brings the window to the front so we can see it. All of this behavior is specific to the [thispatcher] object. You can read more about the different window flags and other messages in Max's documentation.

Now we need to actually trigger that message. Back in the main patch, add another live.text object and open its inspector. Change 2 settings like we did before: Mode: Button and Text Off Label: "Open Humanize Controls" (note the quotes are needed around the label). Since the label is long, you may need to resize the button and increase its width by dragging its bottom right corner.

Connect the new button to the [p humanize] inlet so that it will trigger the message to [thispatcher]. Finally, see the black horizontal line in the main patch when it's unlocked? Everything below this line will not be visible in Live, so drag everything besides our new button below the line.

Now the device looks cleaner, there's a clear button to open the popup window, and the window stays on top of Live's window.

In the popup window, we can still see everything. All we really need to see is the sliders and buttons. Edit the subpatch and select everything except the sliders and buttons. Then in Max's Object menu, select "Hide on Lock". Now lock the patcher and note those objects disappear, but the "patch cables" connecting them are still visible. Try selecting all that stuff again, but this time hold the Alt key while doing it. This causes the selection to include patch cables. Select "Hide on Lock" again, and we should have a clean, focused interface.

Let's put the final polish on our popup window by adding some explanatory text and organizing the interface better. Create a "comment" object (shortcut alert: you can type 'c' in an unlocked patch to add a comment quickly). In the comment type "humanize" as a label for our 2 buttons. Create another comment with the text "max delta" to label the sliders. Rearrange the objects as desired, and finally shrink the window size to fit the interface.

Back in the main patch, select everything besides the "Open Humanize Controls" button (remember to Alt+drag select to get the patch cables too), and "Hide on Lock". Even though most of the objects were below the horizontal black "visibility line", they were causing our device to be wider than needed. Save the device and note the changes to the device appearance in Live. Reposition the "Open Humanize Controls" button as desired. The final result should look something like this.

Now we can open up a clip and position the humanize controls window wherever we want.

## Download the Final Version

In case you had trouble following along, and your device isn't working properly, you can download my final version here.

## Next Steps

In this article, we learned how to build a usable interface around our JavaScript code for manipulating MIDI clips. I tried to keep this project relatively simple, so you may want to extend what we've built here. Some ideas for things you could add:

- Add a button to humanize both time and velocity together.
- Provide the option to humanize the entire clip or the currently selected notes.
- Add a feature to humanize the duration of notes.
- Or, of course, design your own feature and build something completely different.