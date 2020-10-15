/**
 * A utility for interacting with environment variables
 */
export class Env {
    /**
     * Creates a new instance of Env.
     * @param {object} [source] The environment variable object to read from.
     */
    constructor(source?: object);
    /**
     * The object from which to read environment information.
     * @property source
     * @type object
     */
    source: object;
    /**
     * Retrieves an environment variable without checking for its presence.
     * Optionally returns a default value if the environment variable doesn't
     * exist.
     * @param {string} key The environment variable name to retrieve.
     * @param {string} [defaultValue] The default value to return if the
     *      environment variable is not found.
     * @returns {string|undefined} The environment variable value if found or undefined if not.
     */
    get(key: string, defaultValue?: string): string | undefined;
    /**
     * Determines if a given environment variable exists.
     * @param {string} key The environment variable name to check.
     * @returns {boolean} True if the environment variable exists,
     *      false if not.
     */
    has(key: string): boolean;
    /**
     * Retrieves the first environment variable found in a list of environment
     * variable names.
     * Optionally returns a default value if the environment variable doesn't
     * exist.
     * @param {string[]} keys An array of environment variable names.
     * @param {string} [defaultValue] The default value to return if the
     *      environment variable is not found.
     * @returns {string|undefined} The environment variable value if found or undefined if not.
     */
    first(keys: string[], defaultValue?: string): string | undefined;
    /**
     * Retrieves an environment variable. If the environment variable does
     * not exist or is an empty string, then it throws an error.
     * @param {string} key The environment variable name to retrieve.
     * @returns {string|undefined} The environment variable value.
     * @throws {Error} When the environment variable doesn't exist or is an
     *      empty string.
     */
    require(key: string): string | undefined;
    /**
     * Lazy-loading property containing a proxy that can be used to
     * automatically throw errors when an undefined environment variable
     * is accessed.
     * @returns {object} A proxy object.
     */
    get exists(): any;
    /**
     * Lazy-loading property containing a proxy that can be used to
     * automatically throw errors when an undefined or empty string
     * environment variable is accessed.
     * @returns {object} A proxy object.
     */
    get required(): any;
}
