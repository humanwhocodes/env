# Env utility

by [Nicholas C. Zakas](https://humanwhocodes.com)

If you find this useful, please consider supporting my work with a [donation](https://humanwhocodes.com/donate).

## Description

A utility for verifying that environment variables are present in Node.js. The main use case is to easily throw an error when an environment variable is missing. This is most useful immediately after a Node.js program has been initiated, to fail fast and let you know that environment variables haven't been setup correctly.

## Folder Structure

The most recent packages are found in these directories:

* `src` - the implementation source code
* `tests` - tests for the implementation source code

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
import { Env } from "https://unpkg.com/@humanwhocodes/env/dist/env.js";
```

By default, an `Env` instance will read from `Deno.env()`.

### Browser

```js
import { Env } from "https://unpkg.com/@humanwhocodes/env/dist/env.js";
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

// read a variable and throw an error if it doesn't exist
const username = env.require("USERNAME");
```

You can also specify an alternate object to read variables from. This can be useful for testing or in the browser (where there is no environment variable to read from by default):

```js
const env = new Env({
    USERNAME: "humanwhocodes"
});

// read a variable and don't care if it's empty
const username = env.get("USERNAME");

// read a variable and throw an error if it doesn't exist
const username = env.require("PASSWORD");
```
