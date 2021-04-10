const isProd = () => {
  if (process.env.NODE_ENV === 'prod') {
    return true;
  }
  if (process.env.NODE_ENV === 'production') {
    return true;
  }
  return false;
};

module.exports = {
  extend (config, ctx) {
    if (ctx.isDev || !isProd()) {
      config.devtool = ctx.isClient ? 'source-map' : 'inline-source-map';
    }
  }
};
