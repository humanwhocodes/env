/**
 * @fileoverview Tests that Common JS can access npm package.
 */

const { Env } = require("../");
new Env();
console.log("CommonJS load: success");
