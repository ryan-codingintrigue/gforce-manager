module.exports = {
    transform: {
        "^.+\\.tsx?$": "ts-jest"
    },
    testRegex: "spec\\.(jsx?|tsx?)$",
    moduleFileExtensions: [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    setupFiles: ["<rootDir>/setup.ts"]
};