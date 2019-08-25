module.exports = {
    input: "src/env.js",
    output: [
        {
            file: "dist/env.cjs.js",
            format: "cjs"
        },
        {
            file: "dist/env.js",
            format: "esm"
        }
    ]
};
