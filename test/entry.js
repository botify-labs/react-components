/*eslint-disable*/
Function.prototype.bind = Function.prototype.bind || function(thisp, ...args) {
  return (...args2) => this.apply(thisp, [...args, ...args2]);
};
/*eslint-enable*/

// Run all tests that match the GREP RegExp
var tests = require.context('.', true, GREP);
tests.keys().forEach(tests);
