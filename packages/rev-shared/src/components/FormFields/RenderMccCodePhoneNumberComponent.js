import { Field } from 'redux-form';
import { OPTIONS, VALIDATIONS } from '@revtech/rev-shared/utils';
import React from 'react';

import RenderFieldComponent from './RenderFieldComponent';

const { getMccCodeMappingOptions } = OPTIONS;
const { numberValidation, required } = VALIDATIONS;

const RenderMccCodePhoneNumberComponent = ({ mccCode }) => (
  <React.Fragment>
    <div className="form-group row">
      <div className="col-3 col-md-3 mb-2">
        <div className="form-group">
          <label> Mcc Code </label>

          <select {...mccCode.input} className="form-control ks-select">
            <option value={''}>---</option>
            {getMccCodeMappingOptions().map(item => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
          {mccCode.meta.touched &&
            (mccCode.meta.error && (
              <span style={{ color: 'red' }}>{mccCode.meta.error}</span>
            ))}
        </div>
      </div>
      <div className="col-4 col-md-4 mb-2">
        <Field
          className="form-control"
          name="phone"
          component={RenderFieldComponent}
          col="12"
          label="Phone Number"
          type="text"
          validate={[required, e => numberValidation(e)]}
        />
      </div>
    </div>
  </React.Fragment>
);
export default RenderMccCodePhoneNumberComponent;
