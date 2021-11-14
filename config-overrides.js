/* eslint-disable */
const { injectBabelPlugin } = require('react-app-rewired')
const rewireLess = require('react-app-rewire-less')
const rewireStyledComponents = require('react-app-rewire-styled-components')
const rewireEslint = require('react-app-rewire-eslint')

module.exports = function override(config, env) {
  config = injectBabelPlugin(['import', { libraryName: 'antd', style: true }], config)
  config = rewireLess.withLoaderOptions({
    modifyVars: { '@primary-color': '#1890ff' },
    javascriptEnabled: true
  })(config, env)
  config = rewireStyledComponents(config, env, {
    displayName: true,
    fileName: false,
  })
  config = rewireEslint(config, env)
  return config
};
