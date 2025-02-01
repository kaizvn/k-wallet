import React from 'react';

const DropdownItemComponent = ({ dropdownItem, index, onClick }) => (
  <span className="dropdown-item" href="" onClick={() => onClick()} key={index}>
    {dropdownItem}
    <style jsx>{`
      span {
        cursor: pointer;
      }
    `}</style>
  </span>
);
const DropdownComponent = ({ items }) => (
  <div className="dropdown">
    <a
      className="btn btn-link"
      id="dropdownMenu1"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <span className="ks-icon la la-ellipsis-h" />
    </a>
    <div
      className="dropdown-menu dropdown-menu-right"
      aria-labelledby="dropdownMenu1"
    >
      {items &&
        items.map((item, i) => (
          <DropdownItemComponent
            dropdownItem={item.label}
            onClick={item.action}
            index={i}
            key={i}
          />
        ))}
    </div>
  </div>
);
export default DropdownComponent;
