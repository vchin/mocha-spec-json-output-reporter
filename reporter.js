const mocha = require('mocha');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const inherits = require('util').inherits;

module.exports = Reporter;

function Reporter(runner, options) {
  mocha.reporters.Spec.call(this, runner);

  const self = this;
  const tests = [];
  const pending = [];
  const failures = [];
  const passes = [];

  const date = moment().format('YYYYMMDDHHmmss');
  const defaultFileName = `mocha-output-${date}.json`;
  const defaultFilePath = process.cwd();

  let fileName = defaultFileName;
  let filePath = path.join(defaultFilePath, fileName); ;

  if (options && options.reporterOptions) {
    if (options.reporterOptions.fileName) {
      fileName = options.reporterOptions.fileName;
      filePath = path.join(defaultFilePath, fileName);
    }
    if (options.reporterOptions.filePath) {
      filePath = path.join(options.reporterOptions.filePath, fileName);
    }
  }

  runner.on('test end', (test) => {
    tests.push(test);
  });

  runner.on('pass', (test) => {
    passes.push(test);
  });

  runner.on('fail', (test) => {
    failures.push(test);
  });

  runner.on('pending', (test) => {
    pending.push(test);
  });

  runner.once('end', () => {
    const obj = {
      stats: self.stats,
      tests: tests.map(clean),
      pending: pending.map(clean),
      failures: failures.map(clean),
      passes: passes.map(clean),
    };

    runner.testResults = obj;

    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2));
  });
}

const clean = (test) => ({
  title: test.title,
  fullTitle: test.fullTitle(),
  duration: test.duration,
  currentRetry: test.currentRetry(),
  err: errorJSON(test.err || {}),
});

const errorJSON = (err) => {
  const res = {};
  Object.getOwnPropertyNames(err).forEach((key) => {
    res[key] = err[key];
  }, err);
  return res;
};

inherits(Reporter, mocha.reporters.Spec);
