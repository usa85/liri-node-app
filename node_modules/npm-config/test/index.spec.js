var assert = require('assert')
  , config = require('../')
;

assert.ok(config('development', 'database', 'host') == '127.0.0.1');