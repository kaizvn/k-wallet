import React from 'react';
import Modal from 'react-modal';
import { Button } from '../../layouts';

const getModalClassNameByType = ({ small, medium, large }) => {
  switch (true) {
    case large:
      return 'large';
    case medium:
      return 'medium';
    case small:
      return 'small';
    default:
      return 'small';
  }
};

const PopupComponent = ({
  notCloseOnOverLay,
  large,
  medium,
  small,
  children,
  title,
  onOk,
  okContent,
  onCancel,
  cancelContent,
  onAfterClose,
  visible,
  setIsVisible,
  destroyOnOk,
  destroyOnCancel,
  headerStyle
}) => (
  <Modal
    className={`${getModalClassNameByType({
      small,
      medium,
      large
    })} ReactModal__Content modal-dialog modal-dialog-centered `}
    isOpen={visible}
    onRequestClose={notCloseOnOverLay ? '' : () => setIsVisible(false)}
    ariaHideApp={false}
    onAfterClose={onAfterClose}
  >
    <div className="modal-content">
      <div className="modal-header" style={headerStyle}>
        <h4 className="modal-title">{title}</h4>
        <button
          type="button"
          className="close"
          onClick={() => setIsVisible(false)}
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-body">{children}</div>
      {!(destroyOnCancel && destroyOnOk) && (
        <div className="modal-footer">
          <div className="d-flex flex-wrap justify-content-end">
            {!destroyOnCancel && (
              <div className="ml-auto p-2">
                <Button light onClick={onCancel}>
                  {cancelContent}
                </Button>
              </div>
            )}

            {!destroyOnOk && (
              <div className="p-2">
                <Button type="button" onClick={onOk}>
                  {okContent}
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
    <style jsx global>
      {`
        .ReactModal__Content {
          max-width: 800px;
          margin: 0 auto;
        }
        @media only screen and (max-width: 600px) {
          .ReactModal__Content {
            width: 80% !important;
          }
        }
        .ReactModal__Content.small {
          width: 30%;
        }
        .ReactModal__Content.medium {
          width: 50%;
        }
        .ReactModal__Content.large {
          width: 70%;
        }
      `}
    </style>
  </Modal>
);

export default PopupComponent;
