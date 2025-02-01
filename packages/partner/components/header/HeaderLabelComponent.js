import React from 'react';
import Link from 'next/link';

const DropDownItem = ({ item }) => (
  <Link href={item.url}>
    <a className={item.active ? 'dropdown-item ks-active' : 'dropdown-item'}>
      {item.label}
    </a>
  </Link>
);

const HeaderLabelComponent = ({ label, dropdownItems = [] }) =>
  dropdownItems && dropdownItems.length ? (
    <div className="nav-item dropdown">
      <a
        className="nav-link dropdown-toggle"
        data-toggle="dropdown"
        role="button"
        aria-haspopup="true"
        aria-expanded="false"
      >
        {label}
      </a>
      <div className="dropdown-menu ks-fuchsia-pink" aria-labelledby="Preview">
        {dropdownItems.map((item, index) => (
          <DropDownItem item={item} key={index} />
        ))}
      </div>
    </div>
  ) : (
    <a className="nav-item nav-link">{label}</a>
  );

export default HeaderLabelComponent;
