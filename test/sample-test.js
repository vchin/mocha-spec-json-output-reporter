const assert = require('assert');
const fs = require('fs');
const path = require('path');

const outputFile = path.join(process.cwd(), 'mocha-output.json');

before(() => {
  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile);
  }
})

describe('suite 1', function() {
  it('test pass', () => null);

  it('test fail', () => assert.ok(null));

  describe('nested describe', () => {
    it('nested test pass', () => null);

    it('nested test fail', () => assert.ok(null));
  });
});

describe('suite 2', function() {
  it('suite2 pass', () => null);
});
