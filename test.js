const createFps = require('./');

let fps = createFps({

});

setTimeout(() => {
	fps.element.style.color = 'red'
}, 1000);
