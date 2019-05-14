const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');

const outputFile = path.join(process.cwd(), 'mocha-output.json');

describe('reporter - no hierarchy mode', function() {
  this.timeout(10000);

  it('reporter outputs json file', () => {
    const res = fs.existsSync(outputFile);
    assert.isTrue(res);
  });

  it('json file formatted as expected', () => {
    const contents = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
    const stats = contents.stats;
    delete stats.start;
    delete stats.end;
    delete stats.duration;
    assert.deepEqual(stats, {
      "suites": 4,
      "tests": 7,
      "passes": 4,
      "pending": 1,
      "failures": 2,
    });
    const suites = contents.suites.map(s => {
      return Object.assign(s, {
        tests: s.tests.map(t => {
          delete t.duration;
          return t;
        })
      })
    });
    assert.deepEqual(suites, [
      {
        "title": "suite 1",
        "tests": [
          {
            "fullTitle": "suite 1 test pass",
            "title": "test pass",
            "result": "passed",
            "err": {}
          },
          {
            "fullTitle": "suite 1 test fail",
            "title": "test fail",
            "result": "failed",
            "err": {
              "stack": `AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:\n\n  assert.ok(null)\n\n    at Context.it (${path.join('test','sample-test.js')}:7:32)`,
              "message": "The expression evaluated to a falsy value:\n\n  assert.ok(null)\n",
              "generatedMessage": true,
              "name": "AssertionError [ERR_ASSERTION]",
              "code": "ERR_ASSERTION",
              "actual": null,
              "expected": true,
              "operator": "=="
            }
          },
          {
            "fullTitle": "suite 1 skipped test",
            "title": "skipped test",
            "result": "pending",
            "err": {}
          }
        ]
      },
      {
        "title": "nested describe",
        "tests": [
          {
            "fullTitle": "nested describe nested test pass",
            "title": "nested test pass",
            "result": "passed",
            "err": {}
          },
          {
            "fullTitle": "nested describe nested test fail",
            "title": "nested test fail",
            "result": "failed",
            "err": {
              "stack": `AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:\n\n  assert.ok(null)\n\n    at Context.it (${path.join('test','sample-test.js')}:11:41)`,
              "message": "The expression evaluated to a falsy value:\n\n  assert.ok(null)\n",
              "generatedMessage": true,
              "name": "AssertionError [ERR_ASSERTION]",
              "code": "ERR_ASSERTION",
              "actual": null,
              "expected": true,
              "operator": "=="
            }
          }
        ]
      },
      {
        "title": "nested describe 2",
        "tests": [
          {
            "fullTitle": "nested describe 2 nested d2 test",
            "title": "nested d2 test",
            "result": "passed",
            "err": {}
          }
        ]
      },
      {
        "title": "suite 2",
        "tests": [
          {
            "fullTitle": "suite 2 suite2 pass",
            "title": "suite2 pass",
            "result": "passed",
            "err": {}
          }
        ]
      }
    ]);
    assert.deepEqual(contents.pending, [{
      "err": {},
      "result": "pending",
      "fullTitle": "suite 1 skipped test",
      "title": "skipped test"
    }]);
    const failures = contents.failures.map(f => {
      delete f.duration;
      return f;
    });
    assert.deepEqual(failures, [
      {
        "fullTitle": "suite 1 test fail",
        "title": "test fail",
        "result": "failed",
        "err": {
          "stack": `AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:\n\n  assert.ok(null)\n\n    at Context.it (${path.join('test','sample-test.js')}:7:32)`,
          "message": "The expression evaluated to a falsy value:\n\n  assert.ok(null)\n",
          "generatedMessage": true,
          "name": "AssertionError [ERR_ASSERTION]",
          "code": "ERR_ASSERTION",
          "actual": null,
          "expected": true,
          "operator": "=="
        }
      },
      {
        "fullTitle": "nested describe nested test fail",
        "title": "nested test fail",
        "result": "failed",
        "err": {
          "stack": `AssertionError [ERR_ASSERTION]: The expression evaluated to a falsy value:\n\n  assert.ok(null)\n\n    at Context.it (${path.join('test','sample-test.js')}:11:41)`,
          "message": "The expression evaluated to a falsy value:\n\n  assert.ok(null)\n",
          "generatedMessage": true,
          "name": "AssertionError [ERR_ASSERTION]",
          "code": "ERR_ASSERTION",
          "actual": null,
          "expected": true,
          "operator": "=="
        }
      }
    ]);

    const passes = contents.passes.map(p => {
      delete p.duration;
      return p;
    });;
    assert.deepEqual(passes, [
      {
        "fullTitle": "suite 1 test pass",
        "title": "test pass",
        "result": "passed",
        "err": {}
      },
      {
        "fullTitle": "nested describe nested test pass",
        "title": "nested test pass",
        "result": "passed",
        "err": {}
      },
      {
        "fullTitle": "nested describe 2 nested d2 test",
        "title": "nested d2 test",
        "result": "passed",
        "err": {}
      },
      {
        "fullTitle": "suite 2 suite2 pass",
        "title": "suite2 pass",
        "result": "passed",
        "err": {}
      }
    ])
  });
});
