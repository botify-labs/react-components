// Run all tests that match the GREP RegExp
var tests = require.context('.', true, GREP);
tests.keys().forEach(tests);
