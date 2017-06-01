# fps-indicator [![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

Micro fps indicator for demo/tests.

[![fps-indicator](https://raw.githubusercontent.com/dfcreative/fps-indicator/gh-pages/preview.png "fps-indicator")](http://dfcreative.github.io/fps-indicator/)

## Usage

[![npm install fps-indicator](https://nodei.co/npm/fps-indicator.png?mini=true)](https://npmjs.org/package/fps-indicator/)

```js
const createFps = require('fps-indicator');
let fps = createFps();
```

## API

### var fps = createFps(position?|options?)

| Option | Description |
|---|---|
| `container` | Selector or element where to place, by default `document.body`. |
| `period` | Update period in ms, defaults to `500`. |
| `max` | Max value of FPS, corresponding to upper bound, default is `90`. |
| `color` | Color of indicator, by default is inherited. |
| `position` | `top-left`, `top-right`, `bottom-left` (default), `bottom-right`. |
| `style` | CSS style string or [css object](https://npmjs.org/package/to-css). Eg. `fps({style: 'padding: 20px; text-shadow: 0 0 2px black'})` |

## Similar

> [stats.js](https://www.npmjs.com/package/stats.js) — oldschool fps meter for apps, no colors customization.<br/>
> [fpsmeter](http://darsa.in/fpsmeter/) — good-looking fps meter, but no npm package.<br/>
