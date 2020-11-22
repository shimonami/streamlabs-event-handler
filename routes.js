import AuthCredentials from './src/providers/AuthCredentials/index.js';

const registerRoutes = (app) => {
  app.get('/auth', (req, res) => {
    AuthCredentials.getAuthKeys(req, res);
  });
}

export default {
  registerRoutes,
}
