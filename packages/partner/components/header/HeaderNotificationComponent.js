import React from 'react';

const HeaderNotificationComponent = () => (
  <div className="nav-item dropdown ks-notifications">
    <a
      className="nav-link dropdown-toggle"
      data-toggle="dropdown"
      href="#"
      role="button"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <span className="la la-bell ks-icon" aria-hidden="true">
        <span className="badge badge-pill badge-fuchsia-pink">7</span>
      </span>
      <span className="ks-text">Notifications</span>
    </a>
    <div
      className="dropdown-menu dropdown-menu-right"
      aria-labelledby="Preview"
    >
      <ul className="nav nav-tabs ks-nav-tabs ks-fuchsia-pink" role="tablist">
        <li className="nav-item">
          <a
            className="nav-link active"
            href="#"
            data-toggle="tab"
            data-target="#navbar-notifications-all"
            role="tab"
          >
            All
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="#"
            data-toggle="tab"
            data-target="#navbar-notifications-activity"
            role="tab"
          >
            Activity
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            href="#"
            data-toggle="tab"
            data-target="#navbar-notifications-comments"
            role="tab"
          >
            Comments
          </a>
        </li>
      </ul>
      <div className="tab-content">
        <div
          className="tab-pane ks-notifications-tab active"
          id="navbar-notifications-all"
          role="tabpanel"
        >
          <div className="ks-wrapper ks-scrollable">
            <a href="#" className="ks-notification">
              <div className="ks-avatar">
                <img
                  alt=""
                  src="/static/kosmo/assets/img/avatars/avatar-3.jpg"
                  width="36"
                  height="36"
                />
              </div>
              <div className="ks-info">
                <div className="ks-user-name">
                  Emily Carter
                  <span className="ks-description">has uploaded 1 file</span>
                </div>
                <div className="ks-text">
                  <span className="la la-file-text-o ks-icon" /> logo vector doc
                </div>
                <div className="ks-datetime">1 minute ago</div>
              </div>
            </a>
            <a href="#" className="ks-notification">
              <div className="ks-action">
                <span className="ks-default">
                  <span className="la la-briefcase ks-icon" />
                </span>
              </div>
              <div className="ks-info">
                <div className="ks-user-name">New project created</div>
                <div className="ks-text">Dashboard UI</div>
                <div className="ks-datetime">1 minute ago</div>
              </div>
            </a>
            <a href="#" className="ks-notification">
              <div className="ks-action">
                <span className="ks-error">
                  <span className="la la-times-circle ks-icon" />
                </span>
              </div>
              <div className="ks-info">
                <div className="ks-user-name">File upload error</div>
                <div className="ks-text">
                  <span className="la la-file-text-o ks-icon" /> logo vector doc
                </div>
                <div className="ks-datetime">10 minutes ago</div>
              </div>
            </a>
          </div>

          <div className="ks-view-all">
            <a href="#">Show more</a>
          </div>
        </div>
        <div
          className="tab-pane ks-empty"
          id="navbar-notifications-activity"
          role="tabpanel"
        >
          There are no activities.
        </div>
        <div
          className="tab-pane ks-empty"
          id="navbar-notifications-comments"
          role="tabpanel"
        >
          There are no comments.
        </div>
      </div>
    </div>
  </div>
);

export default HeaderNotificationComponent;
