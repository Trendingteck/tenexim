const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

/** @type {import("eslint").Linter.Config} */
module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project,
        sourceType: "module",
    },
    globals: {
        React: "readonly",
        JSX: "readonly",
    },
    env: {
        node: true,
        browser: true,
    },
    settings: {
        "import/resolver": {
            typescript: {
                project,
            },
        },
    },
    ignorePatterns: [
        // Ignore dotfiles
        ".*.js",
        "node_modules/",
        ".next/",
        "dist/"
    ],
    plugins: ["@typescript-eslint", "only-warn"],
    rules: {
        "import/no-default-export": "off",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
            "warn",
            {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
            },
        ],
    },
};