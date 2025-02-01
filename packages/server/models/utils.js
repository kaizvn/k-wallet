import { FEMALE, MALE } from '../graphql/enums/userGender';

export const formatGender = (data) => {
  data.gender = data.title === 'Mr' ? MALE : FEMALE;

  return data;
};

export const updateTimeWhenSave = function (next) {
  this.updated_at = Date.now();
  next();
};

export const updateDocBuilder = ({ formatData } = {}) => {
  return function (data) {
    if (formatData) {
      data = formatData(data);
    }

    Object.keys(data).forEach((key) => (this[key] = data[key]));

    return this;
  };
};
