/**
 * @fileoverview Tests for the Env class.
 */
/*global describe, it*/

//-----------------------------------------------------------------------------
// Requirements
//-----------------------------------------------------------------------------

import { Env } from "../src/env.js";
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

        it("should return null when the environment variable doesn't exist and there's no default", () => {
            const env = new Env(source);
            const value = env.get("PASSWORD");
            assert.isNull(value);
        });

        it("should return 123 when the environment variable doesn't exist and 123 is the default", () => {
            const env = new Env(source);
            const value = env.get("PASSWORD", 123);
            assert.strictEqual(value, 123);
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

        it("should throw an error when the first argument doesn't have at least two items", () => {
            const env = new Env(source);

            assert.throws(() => {
                env.first(["USERNAME"]);
            }, /First argument/);

        });

        it("should get the first environment variable when it exists", () => {
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

        it("should return null when none of environment variables exist and there's no default", () => {
            const env = new Env(source);
            const value = env.first(["PASSWORD", "OTHER_PASSWORD"]);
            assert.isNull(value);
        });

        it("should return 123 when none of the environment variables exist and 123 is the default", () => {
            const env = new Env(source);
            const value = env.first(["PASSWORD", "OTHER_PASSWORD"], 123);
            assert.strictEqual(value, 123);
        });


    });

    describe("require()", () => {

        const source = {
            USERNAME: "humanwhocodes"
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
            }, /PASSWORD/);
        });

    });

    describe("required", () => {

        const source = {
            USERNAME: "humanwhocodes"
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
            }, /PASSWORD/);
        });

    });

});
