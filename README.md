# JS-Live-API

A series of tutorials and examples for controlling Ableton Live with JavaScript through Max for Live.

> Attribution: This repository adapts and redistributes tutorial content by Adam Murray under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0). Original series: https://adammurray.link/max-for-live/js-in-live/ — Changes have been made. This project is not endorsed by Adam Murray or Cycling '74.

## Table of Contents

- [Overview](#overview)
- [JavaScript Engines](#javascript-engines)
- [Prerequisites](#prerequisites)
- [Learning resources](#learning-resources)
- [Limitations](#limitations)
- [Tutorials](#tutorials)
  - [Getting Started](https://vstopia.github.io/JS-Live-API/docs/01-Getting%20Started.html)
  - [Real Time MIDI Processing](https://vstopia.github.io/JS-Live-API/docs/02-Realtime%20MIDI.html)
  - [The Max Console](https://vstopia.github.io/JS-Live-API/docs/03-The%20Max%20Console.html)
  - [The Live API](https://vstopia.github.io/JS-Live-API/docs/04-The%20Live%20API.html)
  - [Generating MIDI Clips](https://vstopia.github.io/JS-Live-API/docs/05-Generating%20MIDI%20Clips.html)
- [Credits](#credits)
- [License](#license)

## Overview

These pages are a series of Max for Live tutorials on using JavaScript to extend Live's functionality with Max's built-in JavaScript engine and its Live API.

New versions of these tutorials are available for Max 9's new `v8` object. You need Live 12.2 or higher (or standalone Max 9). `v8` supports modern syntax, is much faster, and has quality-of-life improvements. It’s recommended if you can use it.

## JavaScript Engines

Towards the end of 2024, Max started a transition from an older `js` engine (Max 8, ES5-only) to a modern one (`v8` in Max 9). Live 12.2 bundles Max 9, so `v8` is available out-of-the-box.

- Max 8 `js`: ES5-only, slower; still usable for legacy.
- Max 9 `v8`: modern JavaScript, significantly faster; recommended.

If you are on Live 12.2+ (or have standalone Max 9), prefer `v8`. The code here generally works on both.

## Prerequisites

- Ableton Live Suite (with Max for Live) or Live Standard + Max for Live add-on
- Live 12 recommended; most tutorials also work with Live 11
- Basic JavaScript (conditionals, loops, functions) and basic Live usage (MIDI clips)

## Learning resources

- MDN’s JavaScript guide
- Max learning resources
- Live learning resources

## Limitations

Real-time audio-rate processing is not feasible in `js`/`v8` inside Max’s low-priority thread. Build tools that:

- React to UI at human rates
- Use timers
- Process MIDI

MIDI occurs at lower rates and works well for algorithmic composition and performance tools. Timing may vary under load, so avoid relying on it for critical live performance without extensive testing.

JavaScript in Live is especially well-suited to Live MIDI Tools (Generators and Transformers) that are not in the audio signal path.

## Tutorials

- Getting Started: set up a Max for Live device and `js`/`v8` code
- Real Time MIDI Processing: modify notes on the fly
- The Max Console: robust logging and debugging
- The Live API: objects, properties, functions, and paths
- Generating MIDI Clips: algorithmic clip generation

Direct links to the updated series:

- Overview: https://adammurray.link/max-for-live/js-in-live/
- Getting Started: [docs/01-Getting Started](docs/01-Getting%20Started.html)
- Real Time MIDI Processing: [docs/02-Realtime MIDI](docs/02-Realtime%20MIDI.html)
- The Max Console: [docs/03-The Max Console](docs/03-The%20Max%20Console.html)
- The Live API: [docs/04-The Live API](docs/04-The%20Live%20API.html)
- Generating MIDI Clips: [docs/05-Generating MIDI Clips](docs/05-Generating%20MIDI%20Clips.html)

## Code Examples

### Working with MIDI Clips

## Credits

- Primary tutorial content by Adam Murray — see [CREDITS.md](CREDITS.md) for full attribution and links.
- This repository adapts and reorganizes materials for educational, non-commercial use. Not endorsed by Adam Murray or Cycling '74.

## License

- Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
- See the [LICENSE](LICENSE) file for details.

<p align="center">
  <img src="https://vstopia.com/VSTOPIA_MEDIA/VSTOPIA-max-for-live-logo.png" alt="VSTOPIA Max for Live" width="200" />
  
</p>