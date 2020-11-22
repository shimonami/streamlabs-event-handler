const variables = () => ({
  applicationPort: process.env.APPLICATION_PORT,
  streamlabsClientId: process.env.STREAMLABS_CLIENT_ID,
  streamlabsClientSecret: process.env.STREAMLABS_CLIENT_SECRET,
  serverName: process.env.SERVER_NAME,
  streamlabsAccessToken: process.env.STREAMLABS_ACCESS_TOKEN,
  streamlabsSocketToken: process.env.STREAMLABS_SOCKET_TOKEN,
});

const addVariable = (key, value) => {
  process.env[key] = value
}

export default {
  addVariable,
  variables,
};
