import React from 'react';
import PropTypes from 'prop-types';

const OptionSelectComponent = ({ optionItem }) => (
  <option key={optionItem.value} value={optionItem.value}>
    {optionItem.label}
  </option>
);
const SelectFieldTable = ({
  onChange,
  className,
  placeholder = 'All',
  options
}) => (
  <select className={className} onChange={onChange}>
    {placeholder && <option value={''}>{placeholder}</option>}
    {options.map((option, i) => (
      <OptionSelectComponent optionItem={option} key={i} />
    ))}
  </select>
);
SelectFieldTable.propTypes = {
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired
};

export default SelectFieldTable;
