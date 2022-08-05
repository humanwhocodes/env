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
    if (typeof Deno !== "undefined") {
        return Deno.env.toObject();
    }

    // Otherwise
    return {};

})();

/**
 * Throws an error saying that the key was not found.
 * @param {string} key The key to report as missing.
 * @returns {void}
 * @throws {Error} Always. 
 */
function keyNotFound(key) {
    throw new Error(`Required environment variable '${key}' not found.`);
}

/**
 * Throws an error saying that the key was an empty string.
 * @param {string} key The key to report as an empty string.
 * @returns {void}
 * @throws {Error} Always.
 */
function emptyString(key) {
    throw new Error(`Required environment variable '${key}' is an empty string.`);
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
         * @property source
         * @type object
         */
        this.source = source;
    }

    /**
     * Retrieves an environment variable without checking for its presence.
     * Optionally returns a default value if the environment variable doesn't
     * exist.
     * @param {string} key The environment variable name to retrieve.
     * @param {string} [defaultValue] The default value to return if the
     *      environment variable is not found.
     * @returns {string|undefined} The environment variable value if found or undefined if not.
     */
    get(key, defaultValue) {
        if (typeof defaultValue !== "undefined") {
            defaultValue = String(defaultValue);
        }

        return (key in this.source) ? this.source[key] : defaultValue;
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
     * @param {string[]} keys An array of environment variable names.
     * @param {string} [defaultValue] The default value to return if the
     *      environment variable is not found.
     * @returns {string|undefined} The environment variable value if found or undefined if not.
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

        if (typeof defaultValue !== "undefined") {
            defaultValue = String(defaultValue);
        }

        return defaultValue;
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
            keyNotFound(key);
        } else if (value === "") {
            emptyString(key);
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
            keyNotFound(`[${keys}]`);
        } else if (value === "") {
            emptyString(`[${keys}]`);
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
                
                keyNotFound(key);
            }
        });

        // redefine this property as a data attribute
        Object.defineProperty(this, "exists", {
            value: existsProxy,
            writable: false,
            enumerable: false,
            configurable: false
        });

        /** @type object */
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
                        emptyString(key);
                    }

                    return target[key];
                }
                
                keyNotFound(key);
            }
        });

        // redefine this property as a data attribute
        Object.defineProperty(this, "required", {
            value: requiredProxy,
            writable: false,
            enumerable: false,
            configurable: false
        });

        /** @type object */
        return requiredProxy;
    }

}
