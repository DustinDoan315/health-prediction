module.exports = {
  target: 'react-native',
  compilationMode: 'annotation',
  sources: (filename) => {
    return filename.indexOf('node_modules') === -1;
  },
  runtimeModule: 'react/compiler-runtime',
};
