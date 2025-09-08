module.exports = function (api) {
  api.cache(true);
  
  const plugins = [];
  
  if (process.env.REACT_COMPILER === 'true') {
    plugins.push(['babel-plugin-react-compiler', {
      target: 'react-native',
      compilationMode: 'annotation',
    }]);
  }
  
  plugins.push('react-native-reanimated/plugin');
  
  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
