import js from "@eslint/js";

export default [
    {
        ignores: ["tests/fixtures"]
    },
    js.configs.recommended,
    {
        languageOptions: {
            globals: {
                process: false,
                URL: false,
                console: false
            },
        },
        rules: {
            indent: [
                "error",
                4
            ],
            "linebreak-style": [
                "error",
                "unix"
            ],
            quotes: [
                "error",
                "double"
            ],
            semi: [
                "error",
                "always"
            ]
        }
    }
];
