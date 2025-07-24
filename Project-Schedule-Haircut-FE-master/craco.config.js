module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // Tìm rule source-map-loader và thêm exclude
      const sourceMapLoaderRule = webpackConfig.module.rules.find(
        (rule) =>
          rule.oneOf &&
          rule.oneOf.find(
            (r) => r.loader && r.loader.includes('source-map-loader')
          )
      );
      if (sourceMapLoaderRule) {
        sourceMapLoaderRule.oneOf.forEach((r) => {
          if (r.loader && r.loader.includes('source-map-loader')) {
            r.exclude = [/(node_modules\\@antv\\util)/];
          }
        });
      }
      return webpackConfig;
    },
  },
}; 