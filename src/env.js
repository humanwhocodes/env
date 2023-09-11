/**
 * @fileoverview A utility for ensuring that environment variables are present.
 */

/*global Deno*/

//-----------------------------------------------------------------------------
// Helpers
//-----------------------------------------------------------------------------

// create a default env source that will work regardless of environment
const defaultEnvSource = (() => {

    // Node.js
    if (typeof process === "object") {
        return process.env;
    }

    // Deno
    // @ts-ignore
    if (typeof Deno !== "undefined") {
        // @ts-ignore
        return Deno.env.toObject();
    }

    // Otherwise
    return {};

})();

//-----------------------------------------------------------------------------
// Errors
//-----------------------------------------------------------------------------

/**
 * The error thrown when a required key is not found.
 */
export class EnvKeyNotFoundError extends Error {

    /**
     * Creates a new instance.
     * @param {string} key The key that wasn't found. 
     */
    constructor(key) {

        super(`Required environment variable '${key}' not found.`);

        /**
         * The key that wasn't found.
         * @type {string}
         */
        this.key = key;

        /**
         * Easily identifiable name for this error type.
         * @type {string}
         */
        this.name = "EnvKeyNotFoundError";
    }
}

/**
 * The error thrown when a required key is present but is an empty string.
 */
export class EnvEmptyStringError extends Error {

    /**
     * Creates a new instance.
     * @param {string} key The key that wasn't found. 
     */
    constructor(key) {

        super(`Required environment variable '${key}' is an empty string.`);

        /**
         * The key that wasn't found.
         * @type {string}
         */
        this.key = key;

        /**
         * Easily identifiable name for this error type.
         * @type {string}
         */
        this.name = "EnvEmptyStringError";
    }
}

//-----------------------------------------------------------------------------
// Main
//-----------------------------------------------------------------------------

/**
 * A utility for interacting with environment variables
 */
export class Env {

    /**
     * Creates a new instance of Env.
     * @param {object} [source] The environment variable object to read from. 
     */
    constructor(source = defaultEnvSource) {

        /**
         * The object from which to read environment information.
         * @type {object}
         */
        this.source = source;
    }

    /**
     * Retrieves an environment variable without checking for its presence.
     * Optionally returns a default value if the environment variable doesn't
     * exist.
     * @template [S=undefined]
     * @param {string} key The environment variable name to retrieve.
     * @param {S} [defaultValue] The default value to return if the
     *      environment variable is not found.
     * @returns {S extends string ? S : (string|S)} The environment variable value if found or undefined if not.
     */
    get(key, defaultValue) {
        /** @type {S extends string ? S : undefined} */
        let value = undefined;
        if (typeof defaultValue !== "undefined") {
            value = /** @type {S extends string ? S : undefined} */(String(defaultValue));
        }

        return (key in this.source) ? this.source[key] : value;
    }

    /**
     * Determines if a given environment variable exists.
     * @param {string} key The environment variable name to check.
     * @returns {boolean} True if the environment variable exists,
     *      false if not.
     */
    has(key) {
        return key in this.source;
    }

    /**
     * Retrieves the first environment variable found in a list of environment
     * variable names. 
     * Optionally returns a default value if the environment variable doesn't
     * exist.
     * @template [S=undefined]
     * @param {string[]} keys An array of environment variable names.
     * @param {S} [defaultValue] The default value to return if the
     *      environment variable is not found.
     * @returns {S extends string ? S : (string|S)} The environment variable value if found or undefined if not.
     * @throws {TypeError} If keys is not an array with at least one item.
     */
    first(keys, defaultValue) {

        if (!Array.isArray(keys) || keys.length < 1) {
            throw new TypeError("First argument must be an array of one or more strings.");
        }

        for (const key of keys) {
            if (key in this.source) {
                return this.source[key];
            }
        }
        /** @type {S extends string ? S : undefined} */
        let value = undefined;
        if (typeof defaultValue !== "undefined") {
            value = /** @type {S extends string ? S : undefined} */(String(defaultValue));
        }

        return value;
    }

    /**
     * Retrieves an environment variable. If the environment variable does
     * not exist or is an empty string, then it throws an error.
     * @param {string} key The environment variable name to retrieve.
     * @returns {string} The environment variable value.
     * @throws {Error} When the environment variable doesn't exist or is an
     *      empty string.
     */
    require(key) {
        const value = this.get(key);
        if (typeof value === "undefined") {
            throw new Env.KeyNotFoundError(key);
        } else if (value === "") {
            throw new Env.EmptyStringError(key);
        } else {
            return value;
        }
    }

    /**
     * Retrieves the first environment variable found in a list of environment
     * variable names and throws an error if none of the variables are found. 
     * @param {string[]} keys An array of environment variable names.
     * @returns {string} The environment variable value.
     * @throws {TypeError} If keys is not an array with at least one item.
     * @throws {Error} When the environment variable doesn't exist or is an
     *      empty string.
     */
    requireFirst(keys) {

        const value = this.first(keys);
        if (typeof value === "undefined") {
            throw new Env.KeyNotFoundError(`[${keys}]`);
        } else if (value === "") {
            throw new Env.EmptyStringError(`[${keys}]`);
        } else {
            return value;
        }
    }

    /**
     * Lazy-loading property containing a proxy that can be used to
     * automatically throw errors when an undefined environment variable
     * is accessed.
     * @returns {object} A proxy object.
     */
    get exists() {

        const existsProxy = new Proxy(this.source, {
            get(target, key) {
                if (key in target) {
                    return target[key];
                }
                
                throw new Env.KeyNotFoundError(key);
            }
        });

        // redefine this property as a data attribute
        Object.defineProperty(this, "exists", {
            value: existsProxy,
            writable: false,
            enumerable: false,
            configurable: false
        });

        /** @type {object} */
        return existsProxy;
    }

    /**
     * Lazy-loading property containing a proxy that can be used to
     * automatically throw errors when an undefined or empty string
     * environment variable is accessed.
     * @returns {object} A proxy object.
     */
    get required() {

        const requiredProxy = new Proxy(this.source, {
            get(target, key) {
                if (key in target) {
                    if (target[key] === "") {
                        throw new Env.EmptyStringError(key);
                    }

                    return target[key];
                }
                
                throw new Env.KeyNotFoundError(key);
            }
        });

        // redefine this property as a data attribute
        Object.defineProperty(this, "required", {
            value: requiredProxy,
            writable: false,
            enumerable: false,
            configurable: false
        });

        /** @type {object} */
        return requiredProxy;
    }

}

/**
 * The error to use when a key isn't found.
 * @type {new (key: PropertyKey) => Error}
 */
Env.KeyNotFoundError = EnvKeyNotFoundError;

/**
 * The error to use when a key isn't found.
 * @type {new (key: PropertyKey) => Error}
 */
Env.EmptyStringError = EnvEmptyStringError;
