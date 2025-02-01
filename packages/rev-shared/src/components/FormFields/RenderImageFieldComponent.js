import React from 'react';

import AvatarComponent from '../AvatarComponent';
import UploadAvatarComponent from '../UploadAvatarComponent';
import UploadIconComponent from '../UploadIconComponent';
import { Grid } from '@material-ui/core';

const RenderImageFieldComponent = ({
  meta,
  input: { value, onChange },
  icon = false
}) => {
  return (
    <React.Fragment>
      <Grid container justify="center">
        <Grid item sm={8}>
          <Grid container justify="center">
            <AvatarComponent icon={icon} url={value} large />
          </Grid>
          {icon ? (
            <UploadIconComponent setUrlIcon={onChange} />
          ) : (
            <UploadAvatarComponent setUrlAvatar={onChange} />
          )}
          {meta.touched && meta.error && (
            <span style={{ color: 'red' }}>{meta.error}</span>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default RenderImageFieldComponent;
