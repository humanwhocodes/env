/**
 * @fileoverview Tests for the Env class.
 */
/*global describe, it, beforeEach, afterEach*/

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

import { Env, EnvKeyNotFoundError, EnvEmptyStringError } from "../src/env.js";
import { assert } from "chai";

//-----------------------------------------------------------------------------
// Tests
//-----------------------------------------------------------------------------

describe("Env", () => {

    describe("new Env()", () => {

        it("should set source property to process.env when called without an argument", () => {
            const env = new Env();
            assert.strictEqual(env.source, process.env);
        });

        it("should set source property to argument when called with an argument", () => {
            const source = {};
            const env = new Env(source);
            assert.strictEqual(env.source, source);
        });

    });

    describe("get()", () => {

        const source = {
            USERNAME: "humanwhocodes"
        };

        it("should get an environment variable when it exists", () => {
            const env = new Env(source);
            const value = env.get("USERNAME");
            assert.strictEqual(value, source.USERNAME);
        });

        it("should return undefined when the environment variable doesn't exist and there's no default", () => {
            const env = new Env(source);
            const value = env.get("PASSWORD");
            assert.isUndefined(value);
        });

        it("should return the string 123 when the environment variable doesn't exist and 123 is the default", () => {
            const env = new Env(source);
            const value = env.get("PASSWORD", 123);
            assert.strictEqual(value, "123");
        });


    });

    describe("has()", () => {

        const source = {
            USERNAME: "humanwhocodes"
        };

        it("should return true when the environment variable exists", () => {
            const env = new Env(source);
            assert.isTrue(env.has("USERNAME"));
        });

        it("should return false when the environment variable doesn't exist", () => {
            const env = new Env(source);
            assert.isFalse(env.has("OTHER"));
        });

    });

    describe("first()", () => {

        const source = {
            USERNAME: "humanwhocodes",
            USERNAME2: "nzakas"
        };

        it("should throw an error when the first argument is not an array", () => {
            const env = new Env(source);

            assert.throws(() => {
                env.first("USERNAME");
            }, /First argument/);

        });

        it("should throw an error when the first argument doesn't have at least one item", () => {
            const env = new Env(source);

            assert.throws(() => {
                env.first([]);
            }, /First argument/);

        });

        it("should get the first environment variable when one exists", () => {
            const env = new Env(source);
            const value = env.first(["USERNAME"]);
            assert.strictEqual(value, source.USERNAME);
        });

        it("should get the first environment variable when only one exists", () => {
            const env = new Env(source);
            const value = env.first(["USERNAME", "ALT_USERNAME"]);
            assert.strictEqual(value, source.USERNAME);
        });

        it("should get the first environment variable when both exist exists", () => {
            const env = new Env(source);
            const value = env.first(["USERNAME", "USERNAME2"]);
            assert.strictEqual(value, source.USERNAME);
        });

        it("should get the second environment variable when it exists and the first doesn't", () => {
            const env = new Env(source);
            const value = env.first(["ALT_USERNAME", "USERNAME"]);
            assert.strictEqual(value, source.USERNAME);
        });

        it("should return undefined when none of environment variables exist and there's no default", () => {
            const env = new Env(source);
            const value = env.first(["PASSWORD", "OTHER_PASSWORD"]);
            assert.isUndefined(value);
        });

        it("should return the string '123' when none of the environment variables exist and 123 is the default", () => {
            const env = new Env(source);
            const value = env.first(["PASSWORD", "OTHER_PASSWORD"], 123);
            assert.strictEqual(value, "123");
        });


    });

    describe("require()", () => {

        const source = {
            USERNAME: "humanwhocodes",
            OTHER: ""
        };

        it("should get an environment variable when it exists", () => {
            const env = new Env(source);
            const value = env.require("USERNAME");
            assert.strictEqual(value, source.USERNAME);
        });

        it("should throw an error when the environment variable doesn't exist", () => {
            const env = new Env(source);

            assert.throws(() => {
                env.require("PASSWORD");
            }, Env.KeyNotFoundError, /PASSWORD/);
        });

        it("should throw an error when the environment variable is an empty string", () => {
            const env = new Env(source);

            assert.throws(() => {
                env.require("OTHER");
            }, Env.EmptyStringError, /OTHER/);
        });

    });

    describe("requireFirst()", () => {

        const source = {
            USERNAME: "humanwhocodes",
            USERNAME2: "nzakas"
        };

        it("should throw an error when the first argument is not an array", () => {
            const env = new Env(source);

            assert.throws(() => {
                env.requireFirst("USERNAME");
            }, /First argument/);

        });

        it("should throw an error when the first argument doesn't have at least one item", () => {
            const env = new Env(source);

            assert.throws(() => {
                env.requireFirst([]);
            }, /First argument/);

        });

        it("should throw an error when none of the arguments exist", () => {
            const env = new Env(source);

            assert.throws(() => {
                env.requireFirst(["foo", "bar"]);
            }, Env.KeyNotFoundError, /Required environment variable '\[foo,bar\]' not found/);

        });

        it("should get the first environment variable when one exists", () => {
            const env = new Env(source);
            const value = env.requireFirst(["USERNAME"]);
            assert.strictEqual(value, source.USERNAME);
        });

        it("should get the first environment variable when only one exists", () => {
            const env = new Env(source);
            const value = env.requireFirst(["USERNAME", "ALT_USERNAME"]);
            assert.strictEqual(value, source.USERNAME);
        });

        it("should get the first environment variable when both exist exists", () => {
            const env = new Env(source);
            const value = env.requireFirst(["USERNAME", "USERNAME2"]);
            assert.strictEqual(value, source.USERNAME);
        });

        it("should get the second environment variable when it exists and the first doesn't", () => {
            const env = new Env(source);
            const value = env.requireFirst(["ALT_USERNAME", "USERNAME"]);
            assert.strictEqual(value, source.USERNAME);
        });

    });

    describe("exists", () => {

        const source = {
            USERNAME: "humanwhocodes",
            OTHER: ""
        };

        it("should get an environment variable when it exists", () => {
            const env = new Env(source);
            const { USERNAME: value } = env.exists;
            assert.strictEqual(value, source.USERNAME);
        });

        it("should get an environment variable when it is an empty string", () => {
            const env = new Env(source);
            const { OTHER: value } = env.exists;
            assert.strictEqual(value, source.OTHER);
        });

        it("should throw an error when the environment variable doesn't exist", () => {
            const env = new Env(source);

            assert.throws(() => {
                env.exists.PASSWORD;
            }, Env.KeyNotFoundError, /PASSWORD/);
        });

    });

    describe("required", () => {

        const source = {
            USERNAME: "humanwhocodes",
            OTHER: ""
        };

        it("should get an environment variable when it exists", () => {
            const env = new Env(source);
            const { USERNAME: value } = env.required;
            assert.strictEqual(value, source.USERNAME);
        });

        it("should throw an error when the environment variable doesn't exist", () => {
            const env = new Env(source);

            assert.throws(() => {
                env.required.PASSWORD;
            }, Env.KeyNotFoundError, /PASSWORD/);
        });

        it("should throw an error when the environment variable is an empty string", () => {
            const env = new Env(source);

            assert.throws(() => {
                env.required.OTHER;
            }, Env.EmptyStringError, /OTHER/);
        });

    });

    describe("Custom Errors", () => {

        const source = {
            USERNAME: "humanwhocodes",
            OTHER: ""
        };

        class MyError1 extends Error {
            constructor(key) {
                super(key);
            }
        }

        class MyError2 extends Error {
            constructor(key) {
                super(key);
            }
        }

        beforeEach(() => {
            Env.KeyNotFoundError = MyError1;
            Env.EmptyStringError = MyError2;
        });
        
        afterEach(() => {
            Env.KeyNotFoundError = EnvKeyNotFoundError;
            Env.EmptyStringError = EnvEmptyStringError;
        });

        it("should throw an error when the environment variable doesn't exist", () => {
            const env = new Env(source);

            assert.throws(() => {
                env.require("PASSWORD");
            }, MyError1, /PASSWORD/);
        });

        it("should throw an error when the environment variable is an empty string", () => {
            const env = new Env(source);

            assert.throws(() => {
                env.require("OTHER");
            }, MyError2, /OTHER/);
        });

        it("should throw an error when none of the arguments exist", () => {
            const env = new Env(source);

            assert.throws(() => {
                env.requireFirst(["foo", "bar"]);
            }, MyError1, /foo,bar/);

        });

        it("should throw an error when the environment variable doesn't exist", () => {
            const env = new Env(source);

            assert.throws(() => {
                env.exists.PASSWORD;
            }, MyError1, /PASSWORD/);
        });

        it("should throw an error when the environment variable doesn't exist", () => {
            const env = new Env(source);

            assert.throws(() => {
                env.required.PASSWORD;
            }, MyError1, /PASSWORD/);
        });

        it("should throw an error when the environment variable is an empty string", () => {
            const env = new Env(source);

            assert.throws(() => {
                env.required.OTHER;
            }, MyError2, /OTHER/);
        });

    });
});
