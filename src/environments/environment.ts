export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  auth0: {
    domain: 'deskops.eu.auth0.com',
    clientId: 'whjV97Oh1v1iwDGm1jzlJxqA5QmbYtEj',
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: 'https://api.deskops.com',
    },
    httpInterceptor: {
      allowedList: [
        {
          uri: 'http://localhost:8080/api/*',
          tokenOptions: {
            authorizationParams: {
              audience: 'https://api.deskops.com',
            },
          },
        },
      ],
    },
  },
};
