const assert = require('assert');
const fs = require('fs');
const path = require('path');

describe('suite 1', function() {
  it('test pass', () => null);
  it('test fail', () => assert.ok(null));
  it.skip('skipped test', () => null);
  describe('nested describe', () => {
    it('nested test pass', () => null);
    it('nested test fail', () => assert.ok(null));
  });
  describe('nested describe 2', () => {
    it('nested d2 test', () => null);
  });
});

describe('suite 2', function() {
  it('suite2 pass', () => null);
});
