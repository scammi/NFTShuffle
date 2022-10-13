const webpack = require('webpack');

exports.onCreateWebpackConfig = ({ stage, loaders, actions, plugins, getConfig }) => {
  // Fix process
  // if (stage === 'build-javascript' || stage === 'develop') {
  //   actions.setWebpackConfig({
  //     plugins: [
  //       plugins.provide({ process: 'process/browser' }),
  //     ],
  //   });
  // }

  actions.setWebpackConfig({
    plugins: [
      new webpack.IgnorePlugin({
        resourceRegExp: /^electron$/,
      }),
      new webpack.ProvidePlugin({ Buffer: ['buffer', 'Buffer'] }),
    ],
    resolve: {
      alias: {
        path: require.resolve('path-browserify'),
      },
      fallback: {
        assert: false,
        fs: false,
        url: false,
        os: require.resolve('os-browserify/browser'),
        https: require.resolve('https-browserify'),
        stream: require.resolve('stream-browserify'),
        http: require.resolve('stream-http'),
        crypto: require.resolve('crypto-browserify'),
      },
    },
  });


  if (stage === 'build-html' || stage === 'develop-html') {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /react-graceful-image/,
            use: loaders.null(),
          },
          {
            test: /web3modal/,
            use: loaders.null(),
          },
        ],
      },
    });
  }

};
