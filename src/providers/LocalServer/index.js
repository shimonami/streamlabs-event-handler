import express from 'express';
import localtunnel from 'localtunnel';

import environment from '../../configs/environment.js';

const app = express();
const port = 3000;

const start = async (callback) => {
  console.log('Starting local server...');

  await app.listen(port, async () => {
    try {
      const localhost = `http://localhost:${port}`;
      const { url } = await localtunnel(port, { subdomain: 'streamlabs-events-5acf6d2a' });

      environment.addVariable('SERVER_NAME', url);
      console.log(`StreamHandler is listening at ${url} -> ${localhost}`);
      callback(app);
    } catch (err) {
      console.log('Error starting local server', err);
    };
  });
};

export default {
  start,
}
