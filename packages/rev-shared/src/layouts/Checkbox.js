import React from 'react';

import NormalCheckbox from './NormalCheckbox';
import Switch from './Switch';

const Checkbox = ({ useSwitch = false, ...others }) => (
  <div className="mt-2">
    {useSwitch ? <Switch {...others} /> : <NormalCheckbox {...others} />}
  </div>
);

export default Checkbox;
