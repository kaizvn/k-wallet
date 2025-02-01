import getHeaders from './getHeaders';

export const intercepter = (next, getState) => async req => {
  try {
    if (!req.graphql) {
      return next(req);
    }

    const { graphql: query, variables, ...others } = req;

    // if any variable is a function, it will be invoked with current state
    const finalVariables = Object.entries(variables).reduce(
      (obj, [key, value]) => {
        return Object.assign(obj, {
          [key]: typeof value === 'function' ? value(getState()) : value
        });
      },
      {}
    );

    const finalRequest = {
      ...others,
      body: JSON.stringify({
        query,
        variables: finalVariables
      })
    };

    return next(finalRequest);
  } catch (error) {
    throw error;
  }
};

export const gql = (queryTemplate, ...params) => (
  variables = {},
  opts = {}
) => ({
  endpoint: '/graphql',
  method: 'POST',
  headers: getHeaders(opts.headers),
  graphql: appendFragments(
    params.reduce(
      (acc, cur, index) => acc + cur + queryTemplate[index + 1],
      queryTemplate[0]
    ),
    opts.fragments
  ),
  variables
});

const appendFragments = (query, fragments = []) => {
  if (fragments.length === 0) return query;

  return `${query}\n${fragments.join('\n')}`;
};
