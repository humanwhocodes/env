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
            USERNAME: "humanwhocodes",
            LASTNAME: "English"
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

        it("should find the first environment variable requested in an array", () => {
            const env = new Env(source);
            const value = env.get(["USERNAME", "LASTNAME"]);
            assert.strictEqual(value, source.USERNAME);
        });

        it("should find the first environment variable requested in an array", () => {
            const env = new Env(source);
            const value = env.get(["NOT_USERNAME", "USERNAME"]);
            assert.strictEqual(value, source.USERNAME);
        });

        it("should return null when no member of the array was found", () => {
            const env = new Env(source);
            const value = env.get(["NOT_USERNAME", "NOT_ANYTHING"]);
            assert.isNull(value);
        });

        it("should return default value when no member of the array was found", () => {
            const env = new Env(source);
            const value = env.get(["NOT_USERNAME", "NOT_ANYTHING"], 123);
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
