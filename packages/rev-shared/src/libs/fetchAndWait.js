const fetchAndWait = (
  store,
  { actionCreator, dataSelector, errorSelector },
  ...params
) =>
  new Promise((resolve, reject) => {
    store.dispatch(actionCreator(...params));
    setTimeout(reject, 30000, new Error('timeout'));
    const unsubscribe = store.subscribe(() => {
      const state = store.getState();
      if (dataSelector(state) || errorSelector(state)) {
        unsubscribe();
        return resolve(dataSelector(state));
      }
    });
  });

export default fetchAndWait;
