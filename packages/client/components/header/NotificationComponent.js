import React from 'react';
import cx from 'classnames';

const NotificationTab = ({ label, target, isActive }) => (
  <li className="nav-item">
    <a
      className={cx({ 'nav-link': true, active: isActive })}
      href=""
      data-toggle="tab"
      data-target={target}
      //data-target="#navbar-notifications-all"
      role="tab"
    >
      {label}
    </a>
  </li>
);

const AllNotificationTabContent = () => (
  <div
    className="tab-pane ks-notifications-tab active"
    id="navbar-notifications-all"
    role="tabpanel"
  >
    <div className="ks-wrapper ks-scrollable">
      <NotificationItem
        iconComponent={
          <div className="ks-avatar">
            <img
              alt=""
              src="/static/kosmo/assets/img/avatars/avatar-3.jpg"
              width="36"
              height="36"
            />
          </div>
        }
      >
        <div className="ks-user-name">
          Emily Carter{' '}
          <span className="ks-description">has uploaded 1 file</span>
        </div>
      </NotificationItem>
      <NotificationItem
        iconComponent={
          <div className="ks-action">
            <span className="ks-default">
              <span className="la la-briefcase ks-icon" />
            </span>
          </div>
        }
      >
        <div className="ks-user-name">New project created</div>
        <div className="ks-text">Dashboard UI</div>
        <div className="ks-datetime">1 minute ago</div>
      </NotificationItem>
      <NotificationItem
        iconComponent={
          <div className="ks-action">
            <span className="ks-error">
              <span className="la la-times-circle ks-icon" />
            </span>
          </div>
        }
      >
        <div className="ks-user-name">File upload error</div>
        <div className="ks-text">
          <span className="la la-file-text-o ks-icon" /> logo vector doc
        </div>
        <div className="ks-datetime">10 minutes ago</div>
      </NotificationItem>
    </div>

    <div className="ks-view-all">
      <a href="#">Show more</a>
    </div>
  </div>
);

const ActivityNotificationTabContent = () => (
  <div
    className="tab-pane ks-empty"
    id="navbar-notifications-activity"
    role="tabpanel"
  >
    There are no activities.
  </div>
);

const CommentNotificationTabContent = () => (
  <div
    className="tab-pane ks-empty"
    id="navbar-notifications-comments"
    role="tabpanel"
  >
    There are no comments.
  </div>
);

const tabs = [
  {
    label: 'All',
    target: '#navbar-notifications-all',
    isActive: true
  },
  {
    label: 'Activity',
    target: '#navbar-notifications-activity'
  },
  {
    label: 'Comments',
    target: '#navbar-notifications-comments'
  }
];

const NotificationItem = ({ iconComponent, children }) => (
  <a href="#" className="ks-notification">
    {iconComponent}
    <div className="ks-info">{children}</div>
  </a>
);

const NotificationMainModal = () => (
  <div className="dropdown-menu dropdown-menu-right" aria-labelledby="Preview">
    <ul className="nav nav-tabs ks-nav-tabs ks-fuchsia-pink" role="tablist">
      {tabs.map((tab) => (
        <NotificationTab key={tab.label} {...tab} />
      ))}
    </ul>
    <div className="tab-content">
      <AllNotificationTabContent />
      <ActivityNotificationTabContent />
      <CommentNotificationTabContent />
    </div>
  </div>
);

//todo : display notification: // <span className="badge badge-pill badge-fuchsia-pink">7</span>

const NotificationComponent = () => (
  <div className="nav-item dropdown ks-notifications">
    <a
      className="nav-link dropdown-toggle"
      data-toggle="dropdown"
      href="#"
      role="button"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <span className="la la-bell ks-icon" aria-hidden="true" />
      <span className="ks-text">Notifications</span>
    </a>
    <NotificationMainModal />
  </div>
);

export default NotificationComponent;
