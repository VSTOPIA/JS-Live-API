# JS Live API » #1 Setup

> Attribution: Content adapted from Adam Murray’s “JS in Live” tutorials, licensed under CC BY-NC-SA 4.0. Original: https://adammurray.link/max-for-live/js-in-live/ — Changes have been made. Not endorsed by Adam Murray or Cycling '74. License: https://creativecommons.org/licenses/by-nc-sa/4.0/

This is the 1st of a series of articles about hacking on Ableton Live with JavaScript. These articles assume you are comfortable coding JavaScript.

## Overview

This article explains how to set up a Max for Live device to run JavaScript code using the legacy `js` object (Max 8 / ES5). If you already know how to do this, you can skip ahead.

Note: New versions of the tutorials use Max 9’s modern `v8` JavaScript engine (bundled with Live 12.2+). The `v8` engine supports modern syntax and runs faster. This page documents the classic setup with `js` for compatibility.

## Prerequisites

- Ableton Live Suite (includes Max for Live) or Live Standard + Max for Live add-on
- Live 12 recommended (Live 11 generally works for this tutorial)
- Basic JavaScript knowledge

## Selecting the Max device type

We will use a Max MIDI Effect device for JavaScript in Live.

There are three Max device types:

- Max Audio Effect
- Max Instrument
- Max MIDI Effect

For these tutorials we will use Max MIDI Effect devices. JavaScript is not suitable for audio-rate processing (instruments/effects) inside Max, but it works well for MIDI tools and UI logic.

## Creating a Max Device

1. In Live’s Browser, select "Max for Live".
2. Drag "Max MIDI Effect" onto a MIDI track (or onto the empty area to create a new track).
3. Click the device’s Edit button to open the Max editor.
4. In the patch, remove placeholder comments like "Build your MIDI effect here" to clean up.
5. Save the device patch.

We leave the MIDI pass-through objects so MIDI continues to flow through the device.

### Creating a `js` Max object

1. In an unlocked patch, add an object (type "n" or use the toolbar Object).
2. Type: `js your-filename.js`.
3. Lock the patch (cmd+E / ctrl+E).
4. Double-click the `js` object to open the JavaScript editor.
5. Save the file as `your-filename.js` in the same folder as the Max device.

Pro tip: Keyboard shortcuts speed things up—`n` to add objects, `m` for message, `cmd+E/ctrl+E` to lock/unlock.

### Testing it out

Every time you save in Max’s JavaScript editor, your code runs. Try this quick test:

```javascript
post("Hello World!");
```

You should see "Hello World!" in the Max Console:

![Setup Screenshot](../js-live-api-setup.png)

As a sanity check, change the code and save again:

```javascript
post("Hello Live!");
```

If you want each message on its own line, use a newline character: `post("Hello Live!\n");`

## Next Steps

Alright! Now you're ready to write JavaScript programs inside Ableton Live. Next, we’ll add helpful logging utilities and start exploring the Live API.