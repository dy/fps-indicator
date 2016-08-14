const createFps = require('./');

let fps = createFps({

});

fps.element.style.fontFamily = '"Roboto", sans-serif';
fps.element.style.fontWeight = '300';
fps.element.style.fontSize = '14px';

setTimeout(() => {
	// fps.element.style.color = 'red'
}, 1000);