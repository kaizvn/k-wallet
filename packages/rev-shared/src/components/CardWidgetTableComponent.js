import React from 'react';

const CardHeaderControlComponent = ({ controllerTitle, moreOption }) => (
  <React.Fragment>
    <a href="#" className="ks-control-link">
      {controllerTitle}
    </a>
    {moreOption}
  </React.Fragment>
);

const CardWidgetTableComponent = ({
  title,
  controllerTitle,
  moreOption,
  tableContent,
  exClassName
}) => (
  <div className={`card ks-card-widget ${exClassName}`}>
    <h5 className="card-header">
      {title}
      <div className="ks-controls">
        <CardHeaderControlComponent
          controllerTitle={controllerTitle}
          moreOption={moreOption}
        />
      </div>
    </h5>
    <div className="card-block">{tableContent}</div>
  </div>
);
export default CardWidgetTableComponent;
