# JS Live API » #4-B Writing MIDI Clips

This is part of a series of articles about hacking on Ableton Live with JavaScript. These articles assume you own Ableton Live 9 Suite and are comfortable coding JavaScript.

## Overview

In this article we'll learn how to modify the notes inside a MIDI clip. It's the second half of a 2-part article about working with notes in MIDI clips, so read [the first half](04-midi-clips.md) if you haven't already.

## Writing Notes to a MIDI Clip

The Live Object Model documentation for the Clip object shows there's a `set_notes` function that works like this:

```javascript
// Example sequence of calls:
call set_notes
call notes 2
call note 60 0.0 0.5 100 0
call note 62 0.5 0.5 64 0
call done
```

Let's add a function to our Clip class to handle this:

</rewritten_file>