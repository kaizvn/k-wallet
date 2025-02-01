import { withState } from 'recompose';
import React from 'react';

import { generateQrcode } from '../libs/qrCodeGenerator';
import CopyTextComponent from './CopyTextComponent';
import { Grid } from '@material-ui/core';

const WithQrCodeState = withState('qrcode', 'setQrcode', '');

class QrCodeComponent extends React.Component {
  async componentDidMount() {
    const { text, setQrcode, size } = this.props;
    const qrcode = await generateQrcode(text, { width: size, height: size });

    setQrcode(qrcode);
  }
  render() {
    const {
      qrcode,
      text,
      showText,
      borderQR = false,
      justify = 'center'
    } = this.props;

    return qrcode ? (
      <Grid>
        <Grid container justify={justify}>
          <Grid container justify={justify} className="qrcode">
            <img alt="" src={qrcode} className={borderQR && 'borderQR'} />
          </Grid>
          <Grid>{showText && <CopyTextComponent text={text} />}</Grid>
          <style jsx>{`
            .qrcode {
              margin-bottom: 12px;
            }
            .borderQR {
              border: 12px solid #0052b4;
            }
          `}</style>
        </Grid>
      </Grid>
    ) : (
      <span> cannot generate QRCode</span>
    );
  }
}

export default WithQrCodeState(QrCodeComponent);
