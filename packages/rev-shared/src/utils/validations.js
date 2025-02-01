export const required = value => (value ? undefined : 'Required field.');

export const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? 'Invalid email address.'
    : undefined;

export const zipCode = value =>
  value && !/^[0-9]{5,6}(?:-[0-9]{4,6})?$/i.test(value)
    ? 'Zip code is not valid.'
    : undefined;

export const numberValidation = value => {
  return value && isNaN(Number(value)) ? 'Must be a number.' : undefined;
};

export const positiveNumberValidation = value => {
  return value && (isNaN(Number(value)) || Number(value) < 0)
    ? 'Must be a positive number'
    : undefined;
};

export const idField = value =>
  value && /[^A-Z0-9_.]/i.test(value)
    ? 'Only accept ".", "_", characters and numbers.'
    : undefined;

export const isUrl = value =>
  value &&
  !/^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/.test(
    value
  )
    ? 'URL format is invalid.'
    : undefined;

export const passwordValidation = value =>
  value && !/^(?=.*).{8,}$/.test(value)
    ? 'Password must be at least 8 characters'
    : undefined;
