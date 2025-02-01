import React from 'react';

const SelectFieldTable = ({
  className,
  options,
  placeholder = 'All',
  onChange
}) => (
  <select className={className} onChange={onChange}>
    {placeholder && <option value={''}>{placeholder}</option>}
    {options.map(op => (
      <option key={op.value} value={op.value}>
        {op.label}
      </option>
    ))}
  </select>
);

export default SelectFieldTable;
