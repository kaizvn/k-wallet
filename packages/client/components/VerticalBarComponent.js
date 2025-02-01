import { Icon } from '@revtech/rev-shared/layouts';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createLink } from '@revtech/rev-shared/libs';
import { withRouter } from 'next/router';
import Link from 'next/link';
import React from 'react';
import cx from 'classnames';

import { pick } from 'lodash/fp';

import {
  CHANGE_PATH,
  SELECT_PARENT_PATH,
  WINDOW_RESIZE
} from '../stores/NavigationState';

const connectToRedux = connect(
  pick(['childPath', 'parentPath', 'currentPath']),
  dispatch => ({
    changePath: (type, payload) =>
      dispatch({
        type,
        payload
      }),
    resize: payload =>
      dispatch({
        type: WINDOW_RESIZE,
        payload
      }),
    dispatchAction: action => dispatch(action())
  })
);

const enhance = compose(
  withRouter,
  connectToRedux
);

const DropdownChildItem = ({ url, label, active, onClick, dispatchAction }) =>
  onClick ? (
    <a
      className={cx('dropdown-item', { 'ks-active': active })}
      onClick={() => dispatchAction(onClick)}
    >
      {label}
    </a>
  ) : (
    <Link href={url}>
      <a className={cx('dropdown-item', { 'ks-active': active })}>{label}</a>
    </Link>
  );

const DropdownMenu = ({ parentPath, childPath, subPaths, ...props }) => (
  <div className="dropdown-menu">
    {subPaths.map((childTab, index) => (
      <DropdownChildItem
        key={index}
        label={childTab.label}
        active={childPath === childTab.name}
        url={createLink(['user', parentPath, childTab.name])}
        onClick={childTab.onClick}
        {...props}
      />
    ))}
  </div>
);

const NavbarItemComponent = ({
  icon,
  label,
  name,
  childPath,
  parentPath,
  changePath,
  currentPath,
  subPaths = [],
  ...props
}) => (
  <li
    className={cx('nav-item', {
      open: parentPath === name,
      dropdown: subPaths
    })}
    onClick={() => {
      if (parentPath !== name) {
        if (props.onClick) {
          props.dispatchAction(props.onClick);
        }

        subPaths.length
          ? changePath(SELECT_PARENT_PATH, name)
          : changePath(CHANGE_PATH, createLink(['user', name]));
      } else if (subPaths.length && !childPath) {
        changePath(SELECT_PARENT_PATH, currentPath);
      }
    }}
  >
    {subPaths.length ? (
      <React.Fragment>
        <a className="nav-link dropdown-toggle">
          <Icon>{icon}</Icon>
          <span>{label}</span>
        </a>

        <DropdownMenu
          parentPath={name}
          subPaths={subPaths}
          childPath={childPath}
          {...props}
        />
      </React.Fragment>
    ) : (
      <Link href={createLink(['user', name])}>
        <a className="nav-link">
          <Icon>{icon}</Icon>
          <span>{label}</span>
        </a>
      </Link>
    )}
  </li>
);

class VerticalBarComponent extends React.Component {
  componentWillMount() {
    this.props.changePath(CHANGE_PATH, this.props.router.pathname);
  }

  render() {
    const props = this.props;

    return (
      <div id="sc-sidebar" className="ks-column ks-sidebar ks-fuchsia-pink">
        <div className="ks-wrapper ks-sidebar-wrapper">
          <ul className="nav nav-pills nav-stacked">
            {props.navbarStructures.map((menuItem, index) => (
              <NavbarItemComponent key={index} {...props} {...menuItem} />
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

export default enhance(VerticalBarComponent);
