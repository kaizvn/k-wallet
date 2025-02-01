import React from 'react';

const FrameComponent = ({ children, extraComponent }) => (
  <React.Fragment>
    <div className="ks-dashboard-tabbed-sidebar">
      <div className="ks-dashboard-tabbed-sidebar-widgets">
        <div className="card panel panel-default ks-information ks-light">
          {children}
        </div>
        {extraComponent}
      </div>
    </div>
  </React.Fragment>
);

export default FrameComponent;
