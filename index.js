(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
/**
 * @module fps-indicator
 */

var raf = require('raf');
var now = require('right-now');

module.exports = fps;



function fps (opts) {
	if (!(this instanceof fps)) return new fps(opts);

	opts = opts || {};

	if (opts.container) {
		if (typeof opts.container === 'string') {
			this.container = document.querySelector(opts.container);
		}
		else {
			this.container = opts.container;
		}
	}
	else {
		this.container = document.body || document.documentElement;
	}

	//init fps
	this.element = document.createElement('div');
	this.element.classList.add('fps');
	this.element.innerHTML = "\n\t\t<div class=\"fps-bg\"></div>\n\t\t<canvas class=\"fps-canvas\"></canvas>\n\t\t<span class=\"fps-text\">fps <span class=\"fps-value\">60.0</span></span>\n\t";
	this.container.appendChild(this.element);

	this.canvas = this.element.querySelector('.fps-canvas');
	this.textEl = this.element.querySelector('.fps-text');
	this.valueEl = this.element.querySelector('.fps-value');
	this.bgEl = this.element.querySelector('.fps-bg');

	this.element.style.cssText = "\n\t\tline-height: 1;\n\t"

	this.canvas.style.cssText = "\n\t\tposition: relative;\n\t\twidth: 2em;\n\t\theight: 1em;\n\t\tdisplay: block;\n\t\tfloat: left;\n\t\tmargin-right: .333em;\n\t";

	this.bgEl.style.cssText = "\n\t\tposition: absolute;\n\t\theight: 1em;\n\t\twidth: 2em;\n\t\tbackground: currentcolor;\n\t\topacity: .1;\n\t";

	this.canvas.width = parseInt(getComputedStyle(this.canvas).width) || 1;
	this.canvas.height = parseInt(getComputedStyle(this.canvas).height) || 1;

	this.context = this.canvas.getContext('2d');

	var ctx = this.context;
	var w = this.canvas.width;
	var h = this.canvas.height;
	var count = 0;
	var lastTime = 0;
	var values = opts.values || Array(this.canvas.width);
	var updatePeriod = opts.updatePeriod || 1000;
	var maxFps = opts.maxFps || 100;

	//enable update routine
	var that = this;
	raf(function measure () {
		count++;
		var t = now();

		if (t - lastTime > updatePeriod) {
			var color = that.color;
			lastTime = t;
			values.push(count / (maxFps * updatePeriod * 0.001));
			values = values.slice(-w);
			count = 0;

			ctx.clearRect(0, 0, w, h);
			ctx.fillStyle = getComputedStyle(that.canvas).color;
			for (var i = w; i--;) {
				var value = values[i];
				if (value == null) break;
				ctx.fillRect(i, h - h * value, 1, h * value);
			}

			that.valueEl.innerHTML = (values[values.length - 1]*maxFps).toFixed(1);
		}

		raf(measure);
	});
}
},{"raf":4,"right-now":5}],3:[function(require,module,exports){
(function (process){
// Generated by CoffeeScript 1.7.1
(function() {
  var getNanoSeconds, hrtime, loadTime;

  if ((typeof performance !== "undefined" && performance !== null) && performance.now) {
    module.exports = function() {
      return performance.now();
    };
  } else if ((typeof process !== "undefined" && process !== null) && process.hrtime) {
    module.exports = function() {
      return (getNanoSeconds() - loadTime) / 1e6;
    };
    hrtime = process.hrtime;
    getNanoSeconds = function() {
      var hr;
      hr = hrtime();
      return hr[0] * 1e9 + hr[1];
    };
    loadTime = getNanoSeconds();
  } else if (Date.now) {
    module.exports = function() {
      return Date.now() - loadTime;
    };
    loadTime = Date.now();
  } else {
    module.exports = function() {
      return new Date().getTime() - loadTime;
    };
    loadTime = new Date().getTime();
  }

}).call(this);

}).call(this,require('_process'))
},{"_process":1}],4:[function(require,module,exports){
(function (global){
var now = require('performance-now')
  , root = typeof window === 'undefined' ? global : window
  , vendors = ['moz', 'webkit']
  , suffix = 'AnimationFrame'
  , raf = root['request' + suffix]
  , caf = root['cancel' + suffix] || root['cancelRequest' + suffix]

for(var i = 0; !raf && i < vendors.length; i++) {
  raf = root[vendors[i] + 'Request' + suffix]
  caf = root[vendors[i] + 'Cancel' + suffix]
      || root[vendors[i] + 'CancelRequest' + suffix]
}

// Some versions of FF have rAF but not cAF
if(!raf || !caf) {
  var last = 0
    , id = 0
    , queue = []
    , frameDuration = 1000 / 60

  raf = function(callback) {
    if(queue.length === 0) {
      var _now = now()
        , next = Math.max(0, frameDuration - (_now - last))
      last = next + _now
      setTimeout(function() {
        var cp = queue.slice(0)
        // Clear queue here to prevent
        // callbacks from appending listeners
        // to the current frame's queue
        queue.length = 0
        for(var i = 0; i < cp.length; i++) {
          if(!cp[i].cancelled) {
            try{
              cp[i].callback(last)
            } catch(e) {
              setTimeout(function() { throw e }, 0)
            }
          }
        }
      }, Math.round(next))
    }
    queue.push({
      handle: ++id,
      callback: callback,
      cancelled: false
    })
    return id
  }

  caf = function(handle) {
    for(var i = 0; i < queue.length; i++) {
      if(queue[i].handle === handle) {
        queue[i].cancelled = true
      }
    }
  }
}

module.exports = function(fn) {
  // Wrap in a new function to prevent
  // `cancel` potentially being assigned
  // to the native rAF function
  return raf.call(root, fn)
}
module.exports.cancel = function() {
  caf.apply(root, arguments)
}
module.exports.polyfill = function() {
  root.requestAnimationFrame = raf
  root.cancelAnimationFrame = caf
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"performance-now":3}],5:[function(require,module,exports){
(function (global){
module.exports =
  global.performance &&
  global.performance.now ? function now() {
    return performance.now()
  } : Date.now || function now() {
    return +new Date
  }

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],6:[function(require,module,exports){
var createFps = require('./');

var fps = createFps({

});

fps.element.style.fontFamily = '"Roboto", sans-serif';
fps.element.style.fontWeight = '300';
fps.element.style.fontSize = '14px';

setTimeout(function () {
	// fps.element.style.color = 'red'
}, 1000);
},{"./":2}]},{},[6]);
