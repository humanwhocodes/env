/**
 * @fileoverview Tests that env.d.ts is valid.
 */
/* eslint-disable no-console */

const { execSync } = require("child_process");
execSync("cd tests/fixtures/typescript-project && npm i");
console.log("env.d.ts load: success");
