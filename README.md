# raket
React websocket component with option to show a connection status indicator with custom styling.

## Installation

```
yarn add raket
```

## Running a Demo
To run a local demo of `raket`:
- clone this repo
- install dependencies
- run `yarn storybook`.

## Usage
For the most basic use provide a valid URL and handle the `onEvent` callback:

```
<Raket
    url="ws://demos.kaazing.com/echo" 
    onEvent={
        (e) => {
            //do something with the event
        }
    }/>
```

More examples featuring connection status indicator and custom styling can be found in `stories/index.js` file.