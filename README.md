# mocha-spec-json-output-reporter
mocha spec + json output file reporter

Combines the spec and json reporter but instead of outputting the json to the console, writes it to a file

# Install
```
npm install --save-dev mocha-spec-json-output-reporter
```

# Run with Mocha
```
mocha -R mocha-spec-json-output-reporter
```

# Output file
The default file output will be `mocha-output-<date>` in the current working directory

## Reporter Options
* fileName - specify exact name of output file
* filePath - specify exact directory to put output file - this path must exist

```
mocha --reporter-options fileName=my-file.json filePath=/mydirectory/subfolder
```
