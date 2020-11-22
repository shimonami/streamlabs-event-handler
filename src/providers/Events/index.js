import io from 'socket.io-client';
import environment from '../../configs/environment.js';

const startListener = async () => {
  const url = 'https://sockets.streamlabs.com';
  const socketToken = environment.variables().streamlabsSocketToken;

  const streamlabs = io(`${url}?token=${socketToken}`, { transports: ['websocket'] });

  //Perform Action on event
  console.log('Starting Socket events listener')
  streamlabs.on('event', (eventData) => {
    console.log('new event!!!', eventData)
    if (!eventData.for && eventData.type === 'donation') {
      //code to handle donation events
      console.log(eventData.message);
    }

    if (eventData.for === 'twitch_account') {
      switch(eventData.type) {
        case 'follow':
          //code to handle follow events
          console.log(eventData.message);
          break;
        case 'subscription':
          //code to handle subscription events
          console.log(eventData.message);
          break;
        default:
          console.log(eventData.message);
      }
    }
  });
}

export default {
  startListener,
}
