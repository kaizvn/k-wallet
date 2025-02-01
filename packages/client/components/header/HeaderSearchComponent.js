import React from 'react';

const HeaderSearchComponent = () => (
  <form className="ks-search-form">
    <a className="ks-search-open" href="">
      <span className="la la-search" />
    </a>
    <div className="ks-wrapper">
      <div className="input-icon icon-right icon icon-lg icon-color-primary">
        <input
          id="input-group-icon-text"
          type="text"
          className="form-control"
          placeholder="Search..."
        />
        <span className="icon-addon">
          <span className="la la-search ks-icon" />
        </span>
      </div>
      <a className="ks-search-close" href="#">
        <span className="la la-close" />
      </a>
    </div>
  </form>
);

export default HeaderSearchComponent;
