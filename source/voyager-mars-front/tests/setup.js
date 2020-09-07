require('jsdom-global')(
  undefined,
  {
    url: 'http://localhost',
  },
);

global.chai = require('chai');
global.sinon = require('sinon');

global.expect = global.chai.expect;
global.assert = global.chai.assert;
global.requestAnimationFrame = window.requestAnimationFrame = cb => cb();

document.body.setAttribute('data-app', true);

window.Date = Date;
