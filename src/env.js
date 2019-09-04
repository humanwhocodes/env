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
        return Deno.env();
    }

    // Otherwise
    return {};

})();

/**
 * Throws an error saying that the key was found.
 * @param {string} key The key to report as missing.
 * @returns {void}
 * @throws {Error} Always. 
 */
function keyNotFound(key) {
    throw new Error(`Required environment variable '${key}' not found.`);
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
     * @param {Object} source The environment variable object to read from. 
     */
    constructor(source = defaultEnvSource) {
        this.source = source;
    }

    /**
     * Retrieves an environment variable without checking for its presence.
     * Optionally returns a default value if the environment variable doesn't
     * exist.
     * @param {string|array} key The environment variable name or names to retrieve.
     * @param {string} [defaultValue] The default value to return if the
     *      environment variable is not found.
     * @returns {string?} The environment variable value if found or null if not.
     */
    get(key, defaultValue = null) {
        if (Array.isArray(key)) {
            key = key.find(k => k in this.source);
        }

        return (key in this.source) ? this.source[key] : defaultValue;
    }

    /**
     * Retrieves an environment variable. If the environment variable does
     * not exist, then it throws an error.
     * @param {string} key The environment variable name to retrieve.
     * @returns {string?} The environment variable value.
     * @throws {Error} When the environment variable doesn't exist.
     */
    require(key) {
        const value = this.get(key);
        if (value === null) {
            keyNotFound(key);
        } else {
            return value;
        }
    }

    /**
     * Lazy-loading property containing a proxy that can be used to
     * automatically throw errors when an undefined environment variable
     * is accessed.
     */
    get required() {

        const proxy = new Proxy(this.source, {
            get(target, key) {
                if (key in target) {
                    return target[key];
                }
                
                keyNotFound(key);
            }
        });

        // redefine this property as a data attribute
        Object.defineProperty(this, "required", {
            value: proxy,
            writable: false,
            enumerable: false,
            configurable: false
        });

        return proxy;
    }

}
