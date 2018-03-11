const mocha = require('mocha');
const fs = require('fs');
const path = require('path');
const moment = require('moment');
const inherits = require('util').inherits;
const uuidV4 = require('uuid').v4;

module.exports = Reporter;

function Reporter(runner, options) {
  mocha.reporters.Spec.call(this, runner);

  const self = this;
  const suites = [];
  const pending = [];
  const failures = [];
  const passes = [];

  const date = moment().format('YYYYMMDDHHmmss');
  const defaultFileName = `mocha-output-${date}.json`;
  const defaultFilePath = process.cwd();

  let fileName = defaultFileName;
  let filePath = path.join(defaultFilePath, fileName);
  let hierarchyMode = false;
  let currentSuite = null;

  if (options && options.reporterOptions) {
    if (options.reporterOptions.fileName) {
      fileName = options.reporterOptions.fileName;
      filePath = path.join(defaultFilePath, fileName);
    }
    if (options.reporterOptions.filePath) {
      filePath = path.join(options.reporterOptions.filePath, fileName);
    }
    if (options.reporterOptions.hierarchy) {
      hierarchyMode = options.reporterOptions.hierarchy === 'true';
    }
  }

  runner.on('suite', (suite) => {
    if (suite.title) {
      const id = uuidV4();
      suite.id = id;
      const newSuite = {
        parentId: null,
        id,
        title: suite.title,
        tests: []
      };
      if (hierarchyMode) {
        newSuite.suites = [];
        if (currentSuite) {
          newSuite.parentId = currentSuite.id;
          currentSuite.suites.push(newSuite);
        } else {
          suites.push(newSuite);
        }
      } else {
        suites.push(newSuite);
      }
      currentSuite = newSuite;
    }
  });

  runner.on('suite end', (suite) => {
    if (hierarchyMode) {
      currentSuite = suites.find(s => s.id === suite.parentId);
    }
  });

  runner.on('test end', (test) => {
    currentSuite.tests.push(formatTest(test));
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
    const cleanedSuites = suites.map(removeIds);
    const obj = {
      stats: self.stats,
      suites: cleanedSuites,
      pending: pending.map(formatTest),
      failures: failures.map(formatTest),
      passes: passes.map(formatTest),
    };

    fs.writeFileSync(filePath, JSON.stringify(obj, null, 2));
  });
}

const removeIds = (suite) => {
  delete suite.id;
  delete suite.parentId;
  return suite;
};

const formatTest = (test) => ({
  title: test.title,
  duration: test.duration,
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
