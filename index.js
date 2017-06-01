/**
 * @module fps-indicator
 */
'use strict'


const raf = require('raf');
const now = require('right-now');
const css = require('to-css')

module.exports = fps;



function fps (opts) {
	if (!(this instanceof fps)) return new fps(opts);

	if (typeof opts === 'string') opts = {position: opts}
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
	this.element.innerHTML = `
		<div class="fps-bg"></div>
		<canvas class="fps-canvas"></canvas>
		<span class="fps-text">fps <span class="fps-value">60.0</span></span>
	`;
	this.container.appendChild(this.element);

	this.canvas = this.element.querySelector('.fps-canvas');
	this.textEl = this.element.querySelector('.fps-text');
	this.valueEl = this.element.querySelector('.fps-value');
	this.bgEl = this.element.querySelector('.fps-bg');

	let style = opts.css || opts.style || ``
	if (typeof style === 'object') style = css(style)

	let posCss = ``
	switch (opts.position) {
		case 'top-left':
			posCss = `left: 0; top: 0;`
			break;
		case 'top-right':
			posCss = `right: 0; top: 0;`
			break;
		case 'bottom-right':
			posCss = `right: 0; bottom: 0;`
			break;
		case 'bottom-left':
			posCss = `left: 0; bottom: 0;`
			break;
		default:
			posCss = `left: 0; bottom: 0;`
	}

	this.element.style.cssText = `
		line-height: 1;
		position: absolute;
		font-family: Roboto, sans-serif;
		z-index: 1;
		font-weight: 300;
		font-size: small;
		padding: 1rem;
		${posCss}`
	+ (opts.color ? `color: ${opts.color}` : ``)
	+ (style);

	this.canvas.style.cssText = `
		position: relative;
		width: 2em;
		height: 1em;
		display: block;
		float: left;
		margin-right: .333em;
	`;

	this.bgEl.style.cssText = `
		position: absolute;
		height: 1em;
		width: 2em;
		background: currentcolor;
		opacity: .1;
	`;

	this.canvas.width = parseInt(getComputedStyle(this.canvas).width) || 1;
	this.canvas.height = parseInt(getComputedStyle(this.canvas).height) || 1;

	this.context = this.canvas.getContext('2d');

	let ctx = this.context;
	let w = this.canvas.width;
	let h = this.canvas.height;
	let count = 0;
	let lastTime = 0;
	let values = opts.values || Array(this.canvas.width);
	let period = opts.period || 1000;
	let max = opts.max || 100;

	//enable update routine
	let that = this;
	raf(function measure () {
		count++;
		let t = now();

		if (t - lastTime > period) {
			lastTime = t;
			values.push(count / (max * period * 0.001));
			values = values.slice(-w);
			count = 0;

			ctx.clearRect(0, 0, w, h);
			ctx.fillStyle = getComputedStyle(that.canvas).color;
			for (let i = w; i--;) {
				let value = values[i];
				if (value == null) break;
				ctx.fillRect(i, h - h * value, 1, h * value);
			}

			that.valueEl.innerHTML = (values[values.length - 1]*max).toFixed(1);
		}

		raf(measure);
	});
}
