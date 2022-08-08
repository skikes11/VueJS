const Dotenv = require('dotenv-webpack');

module.exports = {
    "runtimeCompiler": true,
    configureWebpack: {
      plugins: [
        new Dotenv()
      ]
    }
  };