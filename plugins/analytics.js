/* eslint-disable  */
export default ({ app }) => {
  /*
    ** Only run on client-side and only in production mode
    */
  if (process.env.NODE_ENV !== 'production') { return; }

  /*
    ** Every time the route changes (fired on initialization too)
    */
  app.router.afterEach((to /* from */) => {

  });
};
/* eslint-enable */
