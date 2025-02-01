import { connect } from 'react-redux';
import React from 'react';
import Router from 'next/router';

//TODO: merge login pages or display the url more accuracy and more convenient

const connectToRedux = connect(null, dispatch => ({
  linkToLogin: () => {
    Router.push('/login');
    dispatch({ type: 'LINK_TO_LOGIN' });
  },
  linkToRegister: () => {
    Router.push('/register');
    dispatch({ type: 'LINK_TO_REGISTER' });
  }
}));

const HomePage = ({ linkToLogin, linkToRegister }) => (
  <div className="sc-home">
    <div className="circle-group">
      <img
        src="./static/kosmo/assets/img/img-home/circle1.png"
        alt=""
        className="img-fluid circle circle1"
      />
      <img
        src="./static/kosmo/assets/img/img-home/circle2.png"
        alt=""
        className="img-fluid circle circle2"
      />
      <img
        src="./static/kosmo/assets/img/img-home/circle3.png"
        alt=""
        className="img-fluid circle circle3"
      />
      <img
        src="./static/kosmo/assets/img/img-home/circle2.png"
        alt=""
        className="img-fluid circle circle4"
      />
    </div>
    <div className="container">
      <div className="row">
        <div className="col-lg-5 col-md-6">
          <div className="sc-main">
            <div className="description">
              <h1 className="title">REV PAYMENT</h1>
              <div className="sc-brief">
                <span className="mb-2">
                  RevPayment provides a Payment Solution for your
                  CryptoCurrencies: Safe, Fast, Reliable, and Easy to manage.
                </span>
                <span className="mb-2">
                  With experience in building Payment System since 2014,
                  Revollet Group believes Revpayment can make the CryptoCurrency
                  transactions be more simple than ever.
                </span>
              </div>
              <div className="sc-cta-group">
                <button className="btn sc-btn signin" onClick={linkToRegister}>
                  Join us today!
                </button>

                <button className="btn sc-btn signup" onClick={linkToLogin}>
                  Login
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="building col-lg-7 col-sm-6" align="center">
          <div className="sc-main">
            <div className="description">
              <img
                src="./static/kosmo/assets/img/img-home/smartcity2.png"
                alt=""
                className="img-fluid building-img"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <style jsx>{`
      span {
        display: block;
      }
    `}</style>
  </div>
);

export default connectToRedux(HomePage);
