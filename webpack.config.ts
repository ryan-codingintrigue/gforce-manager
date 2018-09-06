import webpack from "webpack";
import path from "path";
import fs from "fs";
import WebpackBar from "webpackbar";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import WebpackPwaManifest from "webpack-pwa-manifest";
// @ts-ignore
import ServiceWorkerPlugin from "serviceworker-webpack-plugin";

const envConfig = JSON.parse(fs.readFileSync(path.resolve("./.env-cmdrc"), "utf8"));
const environmentVariables = Object.keys(envConfig)
    .reduce((prev: string[], key) => [...prev, ...Object.keys(envConfig[key])], []);

const shared: webpack.Configuration = {
    mode: process.env.NODE_ENV === "production" ? "production" : "development",
    devtool: process.env.NODE_ENV === "production" ? false : "source-map",
    stats: "errors-only",
    // @ts-ignore
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader
                    },
                    "css-loader"
                ]
            }
        ]
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "styles/[name].css",
            chunkFilename: "[id].css"
        })
    ]
};

const client: webpack.Configuration = {
    ...shared,
    ...{
        entry: "./src/client/index.tsx",
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "dist/client"),
            publicPath: "/client/",
            chunkFilename: "[id].[hash].js"
        },
        module: {
            rules: [
                // @ts-ignore
                ...shared.module.rules,
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                outputPath: "images/",
                                publicPath: "/client/images/"
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new WebpackBar({ name: "Client", color: "#ED8507" }),
            new webpack.EnvironmentPlugin(["NODE_ENV", ...environmentVariables]),
            new webpack.ProvidePlugin({
                React: "react"
            }),
            new ServiceWorkerPlugin({
                entry: path.join(__dirname, "src/client/sw.ts")
            }),
            new WebpackPwaManifest({
                name: "G-Force Manager",
                short_name: "G-Force Man",
                description: "Manage and store presets for your Gibson G-Force tuner",
                background_color: "#FFF",
                theme_color: "#00B7FF",
                filename: "manifest/manifest.json",
                icons: [
                    {
                        src: path.resolve("src/images/icon.svg"),
                        destination: "manifest",
                        sizes: [96, 128, 192, 256, 384, 512, 1024] // multiple sizes
                    }
                ],
                publicPath: "/client"
            }),
            // @ts-ignore
            ...shared.plugins
        ]
    }
};

const server = {
    ...shared,
    ...{
        entry: "./src/server/index.ts",
        target: "node",
        node: {
            __dirname: false
        },
        externals: {
            express: "commonjs express"
        },
        module: {
            rules: [
                // @ts-ignore
                ...shared.module.rules,
                {
                    test: /\.ico$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                outputPath: "images/",
                                publicPath: "images/"
                            }
                        }
                    ]
                },
                {
                    test: /\.(png|jpg|gif|svg)$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                outputPath: "images/",
                                publicPath: "/client/images/",
                                emitFile: false
                            }
                        }
                    ]
                }
            ]
        },
        output: {
            filename: "bundle.js",
            path: path.resolve(__dirname, "dist/server")
        },
        plugins: [
            new WebpackBar({ name: "Server", color: "#00B7FF" }),
            new webpack.ProvidePlugin({
                XMLHttpRequest: ["xmlhttprequest", "XMLHttpRequest"],
                React: "react"
            }),
            // @ts-ignore
            ...shared.plugins
        ]
    }
};

export default [client, server];