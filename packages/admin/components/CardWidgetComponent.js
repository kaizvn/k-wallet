import React from 'react';

import CardWidgetTitleComponent from './CardWidgetTitleComponent';

const CardWidgetComponent = ({
  title,
  subtitle,
  children,
  exClassName,
  style
}) => (
  <div style={style} className={`card card-outline-info mb-3 ${exClassName}`}>
    <CardWidgetTitleComponent title={title} />
    <div className="card-block">{subtitle}</div>
    {children}
  </div>
);
export default CardWidgetComponent;
