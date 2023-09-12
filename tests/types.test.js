/**
 * @fileoverview Tests that env.d.ts is valid.
 */
/* eslint-disable no-console */

import { execSync } from "child_process";
try {
    execSync("cd tests/fixtures/typescript-project && npm i");
    console.log("env.d.ts load: success");
} catch (error) {
    console.error(error.stdout.toString());
    console.error(error.stderr.toString());
    process.exit(1);
}
