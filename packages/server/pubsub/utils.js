import { isArray, keys } from 'lodash/fp';

export const createListenerCallback = (listenerName, callback) => (
  eventName
) => async (...args) => {
  try {
    console.log('**Emit event ', eventName, 'to listener: ', listenerName);
    await callback(...args);
  } catch (error) {
    console.error(
      `"${listenerName}" was failed while listen event  ${eventName}`
    );

    if (error.response) {
      console.log({ error: error.response });
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log('error response:', error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
  }
};

export const addEventListeners = (eventEmitter) => (eventRegisters) =>
  keys(eventRegisters).forEach((eventName) => {
    let callbacks = eventRegisters[eventName];

    if (!isArray(callbacks)) {
      callbacks = [callbacks];
    }

    for (let cb of callbacks) {
      eventEmitter.on(eventName, cb(eventName));
    }
  });
