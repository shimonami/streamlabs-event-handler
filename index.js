import dotenv from 'dotenv';

import database from './src/configs/database.js';
import environment from './src/configs/environment.js';
import LocalServer from './src/providers/LocalServer/index.js';
import Routes from './routes.js'
import AuthCredentials from './src/providers/AuthCredentials/index.js';
import Events from './src/providers/Events/index.js';

(async () => {
  // Set the environment variables for the application
  dotenv.config();

  // Open database
  const db = await database.open()

  // Start local server with tunnel
  await LocalServer.start(async (app) => {
    await Routes.registerRoutes(app);

    await db.serialize(() => {
      db.run("CREATE TABLE IF NOT EXISTS `streamlabs_auth` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `access_token` CHAR(50), `refresh_token` CHAR(50), `socket_token` CHAR(50))");

      db.get("SELECT * FROM `streamlabs_auth` ORDER BY `id` DESC", (err, row) => {
        console.log('row', row)
        if (row && row.socket_token) {
          environment.addVariable('STREAMLABS_ACCESS_TOKEN', row.access_token)
          environment.addVariable('STREAMLABS_SOCKET_TOKEN', row.socket_token)

          Events.startListener();
          return;
        };

        AuthCredentials.getUserApproval();
      });
    });
  });
})()

