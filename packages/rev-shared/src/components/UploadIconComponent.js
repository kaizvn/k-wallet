import React, { Component } from 'react';
import AvatarEditor from 'react-avatar-editor';
import { withTranslation } from '../i18n';
import Button from '../layouts/Button';
import {
  getImageMBFromBase64,
  doErrorNotify,
  IMAGE_MB_LIMITED,
  imageTypeSupported
} from '../utils';
import { get } from 'lodash/fp';
import { Grid } from '@material-ui/core';
import AlertDialog from '../layouts/AlertDialog';
import { CloudUpload } from '@material-ui/icons';

class UploadIconComponent extends Component {
  state = {
    currentIcon: '',
    isOpenModal: false
  };
  setIsOpenModal = status => {
    this.setState({ ...this.state, isOpenModal: status });
  };
  setEditorRef = editor => (this.editor = editor);
  onImageChange = elem => {
    const file = elem.target.files[0];
    this.setState({ currentIcon: file });
  };
  onClickSave = () => {
    const { setUrlIcon } = this.props;
    if (typeof setUrlIcon !== 'function') {
      return;
    }
    if (this.editor) {
      const imageContentType = get('props.image.type')(this.editor);

      if (!imageTypeSupported.includes(imageContentType)) {
        setUrlIcon('');
        this.setIsOpenModal(false);
        return;
      }

      const canvasScaledBase64 = this.editor
        .getImageScaledToCanvas()
        .toDataURL();

      if (getImageMBFromBase64(canvasScaledBase64) > IMAGE_MB_LIMITED) {
        doErrorNotify({
          message: this.props.t('rev_shared.upload_icon.error_limit_size', {
            imageSize: IMAGE_MB_LIMITED
          })
        });
        setUrlIcon('');
        return;
      }

      setUrlIcon(canvasScaledBase64);

      this.setIsOpenModal(false);
    }
  };
  render() {
    const { currentIcon, isOpenModal } = this.state;
    const { t } = this.props;
    return (
      <Grid container justify="center">
        <Grid>
          <Button size="small" onClick={() => this.setIsOpenModal(true)}>
            {t('rev_shared.upload_icon.trigger_label')}
          </Button>

          <AlertDialog
            title={t('rev_shared.upload_icon.trigger_label')}
            isOpenDialog={isOpenModal}
            setIsOpenDialog={this.setIsOpenModal}
            onOk={() => this.onClickSave()}
            okText={t('rev_shared.upload_icon.ok')}
            onCancel={() => this.setIsOpenModal(false)}
            cancelText={t('common:rev_shared.popup.button.close')}
            destroyOnOk={!currentIcon}
            destroyOnCancel={!currentIcon}
            size="sm"
            fullWidth
            content={
              <Grid
                container
                justify="center"
                direction="column"
                alignItems="center"
              >
                <AvatarEditor
                  ref={this.setEditorRef}
                  image={currentIcon}
                  width={240}
                  height={240}
                  border={10}
                  color={[255, 255, 255, 0.6]} // RGBA
                  borderRadius={250}
                  scale={1.2}
                  rotate={0}
                />
                <Grid>
                  <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id="icon-file-upload"
                    type="file"
                    onChange={this.onImageChange}
                  />
                  <label htmlFor="icon-file-upload">
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                      startIcon={<CloudUpload />}
                    >
                      {t('rev_shared.upload_icon.choose_file')}
                    </Button>
                  </label>
                </Grid>
              </Grid>
            }
          />
        </Grid>
      </Grid>
    );
  }
}

export default withTranslation('common')(UploadIconComponent);
