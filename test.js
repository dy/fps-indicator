const createFps = require('./');

let fps = createFps('bottom-right');

setTimeout(() => {
	fps.element.style.color = 'red'
}, 1000);
