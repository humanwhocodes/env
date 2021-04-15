# Env utility

by [Nicholas C. Zakas](https://humanwhocodes.com)

If you find this useful, please consider supporting my work with a [donation](https://humanwhocodes.com/donate).

## Description

A utility for verifying that environment variables are present in Node.js and Deno. The main use case is to easily throw an error when an environment variable is missing. This is most useful immediately after a Node.js or Deno program has been initiated, to fail fast and let you know that environment variables haven't been setup correctly.

## Usage

### Node.js

Install using [npm][npm] or [yarn][yarn]:

```
npm install @humanwhocodes/env --save

# or

yarn add @humanwhocodes/env
```

Import into your Node.js project:

```js
// CommonJS
const { Env } = require("@humanwhocodes/env");

// ESM
import { Env } from "@humanwhocodes/env";
```

By default, an `Env` instance will read from `process.env`.

### Deno

Import into your Deno project:

```js
import { Env } from "https://cdn.skypack.dev/@humanwhocodes/env?dts";
```

By default, an `Env` instance will read from `Deno.env`.

### Browser

It's recommended to import the minified version to save bandwidth:

```js
import { Env } from "https://cdn.skypack.dev/@humanwhocodes/env?min";
```

However, you can also import the unminified version for debugging purposes:

```js
import { Env } from "https://cdn.skypack.dev/@humanwhocodes/env";
```

By default, an `Env` instance will read from an empty object.

## API

After importing, create a new instance of `Env` to start reading environment variables:

```js
const env = new Env();

// read a variable and don't care if it's empty
const username = env.get("USERNAME");

// read a variable and use a default if empty
const username = env.get("USERNAME", "humanwhocodes");

// determine if a variable exists
const usernameExists = env.has("USERNAME");

// read the first found variable and use a default is empty
const username = env.first(["USERNAME", "USERNAME2"], "humanwhocodes");

// read a variable and throw an error if it doesn't exist
// or is an empty string
const username = env.require("USERNAME");

// read the first found variable throw an error if none exist
const username = env.requireFirst(["USERNAME", "USERNAME2"]);
```

To retrieve more than one required environment variable at one time, you can use the `required` property with destructuring assignment:

```js
const env = new Env();

// throws if variables are undefined or an empty string
const {
    CLIENT_ID,
    CLIENT_SECRET
} = env.required;
```

In this example, an error is thrown if either `CLIENT_ID` or `CLIENT_SECRET` is missing or an empty string. The `required` property is a proxy object that throws an error whenever you attempt to access a property that doesn't exist.

If you don't want to throw an error for environment variables containing an empty string, use the `exists` property:

```js
const env = new Env();

// throws only if variables are not defined
const {
    CLIENT_ID,
    CLIENT_SECRET
} = env.exists;
```

You can also specify an alternate object to read variables from. This can be useful for testing or in the browser (where there is no environment variable to read from by default):

```js
const env = new Env({
    USERNAME: "humanwhocodes"
});

// read a variable and don't care if it's empty
const username = env.get("USERNAME");

// read a variable and throw an error if it doesn't exist
const password = env.require("PASSWORD");
```

## Developer Setup

1. Fork the repository
2. Clone your fork
3. Run `npm install` to setup dependencies
4. Run `npm test` to run tests

## License

BSD 3-Clause

[npm]: https://npmjs.com/
[yarn]: https://yarnpkg.com/
