/**
 * @module fps-indicator
 */
'use strict'


var raf = require('raf')
var now = require('right-now')
var css = require('to-css')

module.exports = fps



function fps (opts) {
	if (!(this instanceof fps)) return new fps(opts)

	if (typeof opts === 'string') {
		if (positions[opts]) opts = {position: opts}
		else opts = {container: opts}
	}
	opts = opts || {}

	if (opts.container) {
		if (typeof opts.container === 'string') {
			this.container = document.querySelector(opts.container)
		}
		else {
			this.container = opts.container
		}
	}
	else {
		this.container = document.body || document.documentElement
	}

	//init fps
	this.element = document.createElement('div')
	this.element.className = 'fps'
	this.element.innerHTML = [
		'<div class="fps-bg"></div>',
		'<canvas class="fps-canvas"></canvas>',
		'<span class="fps-text">fps <span class="fps-value">60.0</span></span>'
	].join('')
	this.container.appendChild(this.element)

	this.canvas = this.element.querySelector('.fps-canvas')
	this.textEl = this.element.querySelector('.fps-text')
	this.valueEl = this.element.querySelector('.fps-value')
	this.bgEl = this.element.querySelector('.fps-bg')

	var style = opts.css || opts.style || ''
	if (typeof style === 'object') style = css(style)

	var posCss = ''
	posCss = positions[opts.position] || positions['top-left']

	this.element.style.cssText = [
		'line-height: 1;',
		'position: fixed;',
		'font-family: Roboto, sans-serif;',
		'z-index: 1;',
		'font-weight: 300;',
		'font-size: small;',
		'padding: 1rem;',
		posCss,
		opts.color ? ('color:' + opts.color) : '',
		style
	].join('')

	this.canvas.style.cssText = [
		'position: relative;',
		'width: 2em;',
		'height: 1em;',
		'display: block;',
		'float: left;',
		'margin-right: .333em;'
	].join('')

	this.bgEl.style.cssText = [
		'position: absolute;',
		'height: 1em;',
		'width: 2em;',
		'background: currentcolor;',
		'opacity: .1;'
	].join('')

	this.canvas.width = parseInt(getComputedStyle(this.canvas).width) || 1
	this.canvas.height = parseInt(getComputedStyle(this.canvas).height) || 1

	this.context = this.canvas.getContext('2d')

	var ctx = this.context
	var w = this.canvas.width
	var h = this.canvas.height
	var count = 0
	var lastTime = 0
	var values = opts.values || Array(this.canvas.width)
	var period = opts.period || 1000
	var max = opts.max || 100

	//enable update routine
	var that = this
	raf(function measure () {
		count++
		var t = now()

		if (t - lastTime > period) {
			lastTime = t
			values.push(count / (max * period * 0.001))
			values = values.slice(-w)
			count = 0

			ctx.clearRect(0, 0, w, h)
			ctx.fillStyle = getComputedStyle(that.canvas).color
			for (var i = w; i--;) {
				var value = values[i]
				if (value == null) break
				ctx.fillRect(i, h - h * value, 1, h * value)
			}

			that.valueEl.innerHTML = (values[values.length - 1]*max).toFixed(1)
		}

		raf(measure)
	})
}


var positions = {
	'top-left': 'left: 0; top: 0;',
	'top-right': 'right: 0; top: 0;',
	'bottom-right': 'right: 0; bottom: 0;',
	'bottom-left': 'left: 0; bottom: 0;'
}
