import axios from 'axios';
import open from 'open';
import Events from '../Events/index.js';
import database from '../../configs/database.js';
import environment from '../../configs/environment.js';

const getUserApproval = async () => {
  let url = "https://streamlabs.com/api/v1.0/authorize?";

  try {
    const params = {
      'client_id': environment.variables().streamlabsClientId,
      'redirect_uri': `${environment.variables().serverName}/auth`,
      'response_type': 'code',
      'scope': 'socket.token',
    }

    // not encoding params
    const userApprovalUrl = url += Object.keys(params).map(key => `${key}=${params[key]}`).join('&');

    await open(userApprovalUrl);
  } catch (error) {
    console.log(`Error on ${url}`, error)
  };
};

const getAuthKeys = async (request, response) => {
  const code = request.query.code
  const url = "https://streamlabs.com/api/v1.0/token";

  try {
    const tokenResponse = await axios.post(url, {
      grant_type: 'authorization_code',
      client_id: environment.variables().streamlabsClientId,
      redirect_uri: `${environment.variables().serverName}/auth`,
      client_secret: environment.variables().streamlabsClientSecret,
      code: code
    });

    const { access_token, refresh_token } = tokenResponse.data;

    const db = await database.open();

    const socketToken = await getSocketToken(access_token);

    db.run(
      "INSERT INTO `streamlabs_auth` (access_token, refresh_token, socket_token) VALUES (?,?,?)",
      [access_token, refresh_token, socketToken],
      () => {
        environment.addVariable('STREAMLABS_ACCESS_TOKEN', access_token);
        environment.addVariable('STREAMLABS_SOCKET_TOKEN', socketToken);
        console.log('Added token on database', { access_token, refresh_token, socketToken })

        Events.startListener();
      }
    );

    response.send('OK!');
  } catch(error) {
    console.log(`Error on ${url}`, error)
    response.send('Error!')
  };
};

const getSocketToken = async (accessToken) => {
  const url = "https://streamlabs.com/api/v1.0/socket/token";

  try {
    const params =  {
      access_token: accessToken,
    };

    const socketTokenResponse = await axios.get(url, { params });

    const { socket_token } = socketTokenResponse.data;

    return socket_token;
  } catch (error) {
    console.log(`Error on ${url}`, error)
  }
};

export default {
  getUserApproval,
  getAuthKeys,
  getSocketToken,
}
