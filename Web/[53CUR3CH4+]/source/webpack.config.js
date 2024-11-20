const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env, argv) => {
    const prod = argv.mode === 'production';

    return {
        mode: prod ? 'production' : 'development',
        entry: './app/index.tsx',
        output: {
            path: path.resolve(__dirname, 'task/public'),
            publicPath: '/',
            filename: '[name].[contenthash].js',
            clean: true
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx']
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: 'babel-loader',
                    include: path.resolve(__dirname, './app'),
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        {
                            loader: 'css-loader',
                            options: {
                                modules: {
                                    localIdentName: prod
                                        ? '[hash:base64:5]'
                                        : '[name]__[local]_[hash:base64:5]',
                                    exportLocalsConvention: 'camelCaseOnly'
                                },
                                importLoaders: 1,
                                esModule: false
                            }
                        },
                        'postcss-loader'
                    ],
                    exclude: /node_modules/
                },
                {
                    test: /\.svg$/,
                    use: ['svg-sprite-loader'],
                    include: path.resolve('./app/components/icon/glyphs/')
                },
                {
                    test: /\.(svg|png|gif|webp|woff2)?$/,
                    type: 'asset/resource',
                    exclude: path.resolve('./app/components/icon/glyphs/'),
                    generator: {
                        filename: 'assets/[name].[contenthash][ext][query]'
                    }
                }
            ]
        },
        plugins: [
            new webpack.ProgressPlugin(),
            new MiniCssExtractPlugin({
                filename: prod ? '[name].[contenthash].css' : 'index.css'
            }),
            new HtmlWebpackPlugin({
                title: 'Watermark App',
                filename: 'index.html',
                template: 'public/index.html',
                favicon: 'public/favicon.png'
            })
        ],
        performance: {
            hints: false
        },
        devServer: {
            client: {
                overlay: true,
                progress: true
            },
            compress: false,
            historyApiFallback: true,
            hot: true,
            port: 3001
        }
    };
};
