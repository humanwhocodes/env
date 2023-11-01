import minify from "@rollup/plugin-terser";

export default [
    {
        input: "src/env.js",
        output: [
            {
                file: "dist/env.cjs",
                format: "cjs"
            },
            {
                file: "dist/env.mjs",
                format: "esm"
            },
            {
                file: "dist/env.js",
                format: "esm"
            }
        ]
    },
    {
        input: "src/env.js",
        plugins: [minify({
            format: {comments: false},
            mangle: {
                keep_classnames: true
            }
        })],
        output: {
            file: "dist/env.min.js",
            format: "esm"
        }
    }    
];
