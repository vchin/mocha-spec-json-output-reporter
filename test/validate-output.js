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
    const contents = fs.readFileSync(outputFile, 'utf8');
    assert.deepEqual(JSON.parse(contents), {
      "stats": {
        "suites": 3,
        "tests": 5,
        "passes": 3,
        "pending": 0,
        "failures": 2,
        "start": "2018-03-08T03:37:58.025Z",
        "end": "2018-03-08T03:37:58.042Z",
        "duration": 17
      },
      "suites": [
        {
          "title": "suite 1",
          "tests": [
            {
              "title": "test pass",
              "fullTitle": "suite 1 test pass",
              "duration": 0,
              "currentRetry": 0,
              "err": {}
            },
            {
              "title": "test fail",
              "fullTitle": "suite 1 test fail",
              "duration": 1,
              "currentRetry": 0,
              "err": {
                "stack": "AssertionError [ERR_ASSERTION]: null == true\n    at Context.it (test\\test.js:16:32)",
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
              "fullTitle": "suite 1 nested describe nested test pass",
              "duration": 0,
              "currentRetry": 0,
              "err": {}
            },
            {
              "title": "nested test fail",
              "fullTitle": "suite 1 nested describe nested test fail",
              "duration": 0,
              "currentRetry": 0,
              "err": {
                "stack": "AssertionError [ERR_ASSERTION]: null == true\n    at Context.it (test\\test.js:21:41)",
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
              "fullTitle": "suite 2 suite2 pass",
              "duration": 0,
              "currentRetry": 0,
              "err": {}
            }
          ]
        }
      ],
      "pending": [],
      "failures": [
        {
          "title": "test fail",
          "fullTitle": "suite 1 test fail",
          "duration": 1,
          "currentRetry": 0,
          "err": {
            "stack": "AssertionError [ERR_ASSERTION]: null == true\n    at Context.it (test\\test.js:16:32)",
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
          "fullTitle": "suite 1 nested describe nested test fail",
          "duration": 0,
          "currentRetry": 0,
          "err": {
            "stack": "AssertionError [ERR_ASSERTION]: null == true\n    at Context.it (test\\test.js:21:41)",
            "message": "null == true",
            "generatedMessage": true,
            "name": "AssertionError [ERR_ASSERTION]",
            "code": "ERR_ASSERTION",
            "actual": null,
            "expected": true,
            "operator": "=="
          }
        }
      ],
      "passes": [
        {
          "title": "test pass",
          "fullTitle": "suite 1 test pass",
          "duration": 0,
          "currentRetry": 0,
          "err": {}
        },
        {
          "title": "nested test pass",
          "fullTitle": "suite 1 nested describe nested test pass",
          "duration": 0,
          "currentRetry": 0,
          "err": {}
        },
        {
          "title": "suite2 pass",
          "fullTitle": "suite 2 suite2 pass",
          "duration": 0,
          "currentRetry": 0,
          "err": {}
        }
      ]
    });
  });
});
