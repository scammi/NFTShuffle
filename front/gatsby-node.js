const webpack = require('webpack');

exports.onCreateWebpackConfig = ({ stage, loaders, actions, plugins, getConfig }) => {
  // Fix process
  if (stage === 'build-javascript' || stage === 'develop') {
    actions.setWebpackConfig({
      plugins: [
        plugins.provide({ process: 'process/browser' }),
      ],
    });
  }

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
        ],
      },
    });
  }

  if (stage === 'build-html') {
    actions.setWebpackConfig({
      // Don't bundle modules that reference browser globals such as `window` and `IDBIndex` during SSR.
      // See: https://github.com/gatsbyjs/gatsby/issues/17725
      externals: getConfig().externals.concat(function ({ context, request }, callback) {
        // Exclude bundling firebase* and react-firebase*
        // These are instead required at runtime.
        if (/^@?firebase(\/(.+))?/.test(request)) {
          console.log('Excluding bundling of: ' + request);
          return callback(null, 'commonjs ' + request);
        }
        callback();
      }),
    });
  }

  // if (stage === 'build-html') {
  //     actions.setWebpackConfig({
  //         module: {
  //             rules: [
  //                 {
  //                     test: /portis\.js|authereum\.js|fortmatic\.js|torus-embed|qrcode-modal|walletconnect/,
  //                     use: loaders.null(),
  //                 },
  //             ],
  //         },
  //     });
  // }
};
