import React from 'react';

import PropTypes from 'prop-types';

const FilterComponent = ({ id, placeholder, type, onChange }) => {
  return (
    <input
      type={type}
      className="form-control"
      placeholder={placeholder}
      id={id}
      onChange={onChange}
    />
  );
};

FilterComponent.propTypes = {
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default FilterComponent;
