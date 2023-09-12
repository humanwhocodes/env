/**
 * @fileoverview Tests that env.d.ts is valid.
 */
/* eslint-disable no-console */

import { execSync } from "child_process";
execSync("cd tests/fixtures/typescript-project && npm i");
console.log("env.d.ts load: success");
