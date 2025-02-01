import { withState } from 'recompose';
import React from 'react';

import { generateQrcode } from '@revtech/rev-shared/libs';
import { CopyTextComponent } from '@revtech/rev-shared/components';

const WithQrCodeState = withState('qrcode', 'setQrcode', '');

class QrCodeComponent extends React.Component {
  async componentWillMount() {
    const { text, setQrcode, size } = this.props;
    const qrcode = await generateQrcode(text, { width: size, height: size });

    setQrcode(qrcode);
  }
  render() {
    const { qrcode, text, showText } = this.props;

    return qrcode ? (
      <React.Fragment>
        <div className="qrcode">
          <img className="img-container" alt="" src={qrcode} />
        </div>
        <div className="text">
          {showText && <CopyTextComponent text={text} />}
        </div>
        <style jsx>{`
          .qrcode {
            display: flex;
            margin-bottom: 12px;
          }
          .text {
            width: 80%;
          }
        `}</style>
      </React.Fragment>
    ) : (
      <span> cannot generate QRCode</span>
    );
  }
}

export default WithQrCodeState(QrCodeComponent);
