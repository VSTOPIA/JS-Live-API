# JS-Live-API

A series of tutorials and examples for controlling Ableton Live with JavaScript through Max for Live.

> Attribution: This repository adapts and redistributes tutorial content by Adam Murray under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License (CC BY-NC-SA 4.0). Original series: https://adammurray.link/max-for-live/js-in-live/ .Changes have been made. This project is not endorsed by Adam Murray or Cycling '74.

## Table of Contents

- [Overview](#overview)
- [Video Tutorial](#video-tutorial)
- [Prerequisites](#prerequisites)
- [Tutorial Series](#tutorial-series)
  - [#1 Setup](docs/01-setup.md)
  - [#2 Logging & Debugging](docs/02-logging.md)
  - [#3 API Basics](docs/03-api-basics.md)
  - [#4 Working with MIDI Clips](#4-working-with-midi-clips)
    - [Part A: Reading MIDI Data](docs/04-midi-clips.md)
    - [Part B: Writing MIDI Data](docs/04-midi-clips-b.md)
  - [#5 Building a User Interface](docs/05-user-interface.md)
  - [#6 Going Deeper](docs/06-going-deeper.md)
- [Code Examples](#code-examples)
- [Credits](#credits)
- [License](#license)

## Overview

This repository contains code examples and tutorials for programming Ableton Live using JavaScript via Max for Live. The series is designed for developers who own Ableton Live 9 Suite and are comfortable with JavaScript programming.

## Video Tutorial
[Watch the tutorial on YouTube](https://www.youtube.com/watch?v=VhxTB01oS9Y)

## Prerequisites

- Ableton Live 9 Suite (or later)
- Basic JavaScript knowledge
- Max for Live

## Tutorial Series

### #1 Setup

Learn how to set up your JavaScript development environment within Ableton Live:

1. Adding a Max MIDI Effect device
2. Creating a JavaScript object
3. Setting up the development workflow
4. Basic debugging setup

[Detailed Setup Guide](docs/01-setup.md)

### #2 Logging & Debugging

Learn how to implement robust logging and debugging in your Live JavaScript projects:

1. Understanding the `post()` function
2. Building a better logging system
3. Handling different data types
4. Working with objects and JSON
5. Supporting multiple parameters

[Detailed Logging Guide](docs/02-logging.md)

### #3 API Basics

Learn the fundamentals of interacting with Live's API:

1. Understanding Live API Documentation
2. Working with Live Objects
3. Navigating Live Paths
4. Accessing Properties and Functions
5. Using `this_device`

[Detailed API Guide](docs/03-api-basics.md)

### #4 Working with MIDI Clips

#### Part A: Reading MIDI Data

1. Accessing MIDI clips through the API
2. Reading note data
3. Understanding note properties
4. Working with selected notes
5. Building reusable classes

[Detailed MIDI Reading Guide](docs/04-midi-clips.md)

#### Part B: Writing MIDI Data

1. Writing notes to clips
2. Handling out-of-bounds values
3. Replacing selected notes
4. Building a humanize function
5. Error handling and robustness

[Detailed MIDI Writing Guide](docs/04-midi-clips-b.md)

### #5 Building a User Interface

Learn how to create a Max for Live interface for your JavaScript code:

1. Creating message objects
2. Building slider controls
3. Creating popup windows
4. Organizing the interface
5. Polishing the final device

Key concepts covered:
- Calling JavaScript from Max
- Passing parameters
- Creating floating windows
- Interface organization
- User experience considerations

[Detailed UI Guide](docs/05-user-interface.md)

### #6 Going Deeper

Advanced topics for building production-ready Max for Live devices:

1. Alternative Live paths
2. Path validation
3. Observers and callbacks
4. Property types
5. Proper device initialization

Key concepts covered:
- Working with canonical paths
- Handling invalid paths
- Using live.thisdevice
- Best practices for initialization
- Advanced error handling

[Detailed Advanced Guide](docs/06-going-deeper.md)

## Code Examples

### Working with MIDI Clips

## Credits

- Primary tutorial content by Adam Murray — see [CREDITS.md](CREDITS.md) for full attribution and links.
- This repository adapts and reorganizes materials for educational, non-commercial use. Not endorsed by Adam Murray or Cycling '74.

## License

- Licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/).
- See the [LICENSE](LICENSE) file for details.