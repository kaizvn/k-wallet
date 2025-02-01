import { DropdownComponent } from '@revtech/rev-shared/components';
import React from 'react';

const items = ['Add', 'Edit', 'Delete'];
const CardWidgetTitleComponent = ({ title, showDropdown }) => (
  <div className="card-header bg-info ">
    {title}
    {showDropdown && <DropdownComponent items={items} />}
  </div>
);

export default CardWidgetTitleComponent;
