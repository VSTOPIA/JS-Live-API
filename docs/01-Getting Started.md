# Getting Started

> Attribution: Content copied and adapted from Adam Murray’s “JS in Live” tutorials, licensed under CC BY-NC-SA 4.0. Original: https://adammurray.link/max-for-live/js-in-live/getting-started/ — Changes may be present. Not endorsed by Adam Murray or Cycling '74. License: https://creativecommons.org/licenses/by-nc-sa/4.0/

> [!TIP]
> A new version of this tutorial is available that uses the `v8` JavaScript engine in Max 9 (Live 12.2+), which is far superior to the legacy `js` object used here.

This tutorial shows how to set up a Max for Live device to run JavaScript code.

To follow along, you need Ableton Live Suite (which comes with Max for Live) or Live Standard edition with the Max for Live add-on. These tutorials were designed for Live 12, but things should mostly work the same in Live 11.

Later tutorials, such as the next one about “Real Time MIDI Processing”, assume you can set up devices as explained here. Skip ahead if you already know how.

## Selecting the Max device type

We create a new Max device by adding an empty Max device from the Live library, similar to adding any instrument, effect, or plug-in. Select “Max for Live” in the Live browser sidebar, and the empty Max devices will be listed first (highlighted in the following screenshot), followed by the ready-to-use Max devices:

![Max for Live device types](https://adammurray.link/max-for-live/js-in-live/getting-started/max-for-live-device-types.png)

There are three types of Max devices to choose from:

- Max Audio Effect
- Max Instrument
- Max MIDI Effect

In these tutorials, we will always use a Max MIDI Effect device. As explained in the overview’s section on limitations, JavaScript is not suitable for synthesizing instruments or implementing effects.

> [!TIP]
> Even though JavaScript isn’t fast enough to directly implement instruments and effects, there may be reasons to put JavaScript in a Max Audio Effect or Max Instrument device. For example, if complex logic is needed to translate the state of the UI controls into parameters for the instrument/effect, it’s conceivable that part of the logic could be done in JavaScript because UI events happen at a reasonably slow rate.
>
> Regardless, it’s recommended to use Max MIDI Effect devices for your JavaScript in Live projects until there is a good reason to use another device type.

## Creating a Max Device

Now that we’ve decided to use a Max MIDI Effect device, let’s create a new one:

1. Select “Max for Live” in the browser sidebar.
2. Drag a “Max MIDI Effect” device from that folder onto a MIDI track (or onto the empty “Drop Files and Devices Here” space to create a new MIDI track).

![Create a Max MIDI Effect](https://adammurray.link/max-for-live/js-in-live/getting-started/create-max-midi-effect.png)

3. Click the edit button on the Max MIDI Effect device’s title bar (it looks like this: ![Edit button](https://adammurray.link/max-for-live/js-in-live/getting-started/edit-device-button.png)) and wait for the Max editor to open your device’s patch.

![Editing a new Max device](https://adammurray.link/max-for-live/js-in-live/getting-started/editing-a-new-max-device.png)

4. Cleanup by deleting the “MIDI from Live”, “Build your MIDI effect here”, “MIDI to Live”, and “Device vertical limit” comments (if you have any trouble editing the patch, make sure you understand the Max patcher basics).
5. Save the device patch.

![New Max MIDI Effect patch](https://adammurray.link/max-for-live/js-in-live/getting-started/new-max-midi-effect-patch.png)

We left the `midiin` and `midiout` objects there so MIDI will pass through the device.

## Creating a `js` Max object

In the Max patch editor for our new device:

1. Add an object to the Max patch (either drag an “Object” from the top toolbar or type `n` in an unlocked patch).
2. Type `js {filename}.js` into the object box, where `{filename}` is something descriptive for the patch, such as the name of the device.

![Max js object](https://adammurray.link/max-for-live/js-in-live/getting-started/max-js-object.png)

3. Lock the patch (either click the lock icon in the lower left or type `command+E`/`ctrl+E`).
4. Double click the `js` object to open Max’s JavaScript editor.
5. When the JavaScript editor window opens, save the file with the same `{filename}.js` you typed into the object box. Save it in the same folder as the Max device. By default, the Save dialog should prefill the desired filename:

![Saving the js file](https://adammurray.link/max-for-live/js-in-live/getting-started/saving-the-js-file.png)

## Testing it out

That’s the basic device setup. Now, every time you save the code in Max’s JavaScript editor, it will run it. Type this into the JavaScript editor and save:

```js
post("Hello World!");
```

You should see “Hello World!” in the Max Console (you can open the console from the Max patch’s right sidebar or in the “Window” menu):

![Max for Live js setup](https://adammurray.link/max-for-live/js-in-live/getting-started/max-for-live-js-setup.png)

The error “can’t find file {filename}.js” happened when we first added the `js` object to the patch. `js` looked for the given filename in the same folder as the device, but we hadn’t saved it yet, so it printed this error when we were setting things up.

That error should be fixed now. If you see “Hello World!” then it’s working. As a sanity check, you can change the code and save it again:

```js
post("Hello Live!");
```

Now it should print “Hello Live!” in the Max console. You should see it appear next to the first “Hello World!” message, like this:

```
js • Hello World! Hello Live!
```

Were you expecting “Hello Live!” to appear on its own line? Later we’ll learn how to get more control over how things are logged to the Max console. For now, be aware you can write code like `post("Hello Live!\n");` with an explicit `"\n"` newline to print messages to their own line in the Max console.

## Next steps

We’re ready to build stuff! The next tutorial, “Real Time MIDI Processing”, shows how to use JavaScript to alter MIDI notes as they are played.

Have feedback or questions? Email the developer: adam@adammurray.link (check spam for his replies)