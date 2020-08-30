const path = require("path");

module.exports = {
    entry: "./src/app.js",
    output: {
        filename: "main.js",
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
        ],
    },
};
