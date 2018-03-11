const assert = require('chai').assert;
const fs = require('fs');
const path = require('path');

const outputFile = path.join(process.cwd(), 'mocha-output.json');

describe('reporter', function() {
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
      "suites": 3,
      "tests": 5,
      "passes": 3,
      "pending": 0,
      "failures": 2
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
            "title": "test pass",
            "err": {}
          },
          {
            "title": "test fail",
            "err": {
              "stack": `AssertionError [ERR_ASSERTION]: null == true\n    at Context.it (${path.join('test','test.js')}:16:32)`,
              "message": "null == true",
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
        "title": "nested describe",
        "tests": [
          {
            "title": "nested test pass",
            "err": {}
          },
          {
            "title": "nested test fail",
            "err": {
              "stack": `AssertionError [ERR_ASSERTION]: null == true\n    at Context.it (${path.join('test','test.js')}:21:41)`,
              "message": "null == true",
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
        "title": "suite 2",
        "tests": [
          {
            "title": "suite2 pass",
            "err": {}
          }
        ]
      }
    ]);

    assert.deepEqual(contents.pending, []);
    const failures = contents.failures.map(f => {
      delete f.duration;
      return f;
    });
    assert.deepEqual(failures, [
      {
        "title": "test fail",
        "err": {
          "stack": `AssertionError [ERR_ASSERTION]: null == true\n    at Context.it (${path.join('test','test.js')}:16:32)`,
          "message": "null == true",
          "generatedMessage": true,
          "name": "AssertionError [ERR_ASSERTION]",
          "code": "ERR_ASSERTION",
          "actual": null,
          "expected": true,
          "operator": "=="
        }
      },
      {
        "title": "nested test fail",
        "err": {
          "stack": `AssertionError [ERR_ASSERTION]: null == true\n    at Context.it (${path.join('test','test.js')}:21:41)`,
          "message": "null == true",
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
        "title": "test pass",
        "err": {}
      },
      {
        "title": "nested test pass",
        "err": {}
      },
      {
        "title": "suite2 pass",
        "err": {}
      }
    ])
  });
});
