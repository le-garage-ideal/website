const config = ({ env })=>({
  upload: {
    config: {
      providerOptions: {
        localServer: {
          maxage: 300000
        },
      },
    },
  },
  'strapi-plugin-populate-deep': {
    config: {
      defaultDepth: 3, // Default is 5
    }
  },
});
export default config;
