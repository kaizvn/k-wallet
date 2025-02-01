import React from 'react';

import { ThemeConsumer } from '../layouts/Theme';
import CardWidgetTitleComponent from './CardWidgetTitleComponent';

const CardWidgetComponent = ({
  title,
  subtitle,
  children,
  exClassName,
  style
}) => (
  <ThemeConsumer>
    {theme => (
      <div
        style={style}
        className={`card outline-royal-blue mb-3 ${exClassName}`}
      >
        <CardWidgetTitleComponent title={title} />
        <div className="card-block">{subtitle}</div>
        {children}
        <style jsx>
          {`
            .outline-royal-blue {
              border-color: ${theme.primaryColor};
            }
          `}
        </style>
      </div>
    )}
  </ThemeConsumer>
);
export default CardWidgetComponent;
