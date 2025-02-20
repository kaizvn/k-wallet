import { ACTIONS } from 'redux-api-call';

const apiPrefix = (base) => () => (next) => (action) => {
  if (
    action.type === ACTIONS.START &&
    action.payload.endpoint &&
    action.payload.endpoint[0] === '/'
  ) {
    require('isomorphic-fetch');
    const nextAction = {
      ...action,
      payload: {
        ...action.payload,
        endpoint: base + action.payload.endpoint
      }
    };

    return next(nextAction);
  }

  return next(action);
};

export default apiPrefix;
