import React from 'react';

import { Theme } from '@revtech/rev-shared/layouts';
import DropdownComponent from '@revtech/rev-shared/components';
const { ThemeConsumer } = Theme;
const items = ['Add', 'Edit', 'Delete'];
const CardWidgetTitleComponent = ({ title, showDropdown }) => (
  <ThemeConsumer>
    {theme => (
      <div className="card-header royal-blue ">
        {title}
        {showDropdown && <DropdownComponent items={items} />}
        <style jsx>{`
          .royal-blue {
            background-color: ${theme.primaryColor};
            color: white;
          }
        `}</style>
      </div>
    )}
  </ThemeConsumer>
);

export default CardWidgetTitleComponent;
