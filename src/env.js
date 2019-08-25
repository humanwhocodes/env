/**
 * @fileoverview A utility for ensuring that environment variables are present.
 */

/**
 * A utility for interacting with environment variables
 */
export class Env {

    /**
     * Creates a new instance of Env.
     * @param {Object} source The environment variable object to read from. 
     */
    constructor(source = process.env) {
        this.source = source;
    }

    /**
     * Retrieves an environment variable without checking for its presence.
     * Optionally returns a default value if the environment variable doesn't
     * exist.
     * @param {string} key The environment variable name to retrieve.
     * @param {string} [defaultValue] The default value to return if the
     *      environment variable is not found.
     * @returns {string?} The environment variable value if found or null if not.
     */
    get(key, defaultValue = null) {
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
            throw new Error(`Required environment variable '${key}' not found.`);
        } else {
            return value;
        }
    }

}
