const path = require("path");

module.exports = {
    entry: "./src/app.ts",
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "public"),
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader',
                ],
            },
            { test: /\.tsx?$/, loader: "ts-loader" }
        ],
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
};
