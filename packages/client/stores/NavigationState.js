import { flow, split } from 'lodash/fp';

export const CHANGE_PATH = 'CHANGE_PAGE';
export const SELECT_PARENT_PATH = 'SELECT_PARENT_PATH';
export const WINDOW_RESIZE = 'WINDOW_RESIZE';
export const TOGGLE_SIDEBAR = 'TOGGLE_SIDEBAR';

const breakpoints = {
  xxl: 1442,
  xl: 1440,
  lg: 992,
  md: 768,
  sm: 544,
  xs: 320
};

const defaultScreenWidth = () =>
  typeof window === 'object' ? window.innerWidth : null;

const isMobile = () => defaultScreenWidth() <= breakpoints.lg;

export const getParentPaths = flow(
  split('/'),
  paths => paths[2] || ''
);

export const getChildPaths = flow(
  split('/'),
  paths => paths[3] || ''
);

export default {
  currentPath: (state = '', { type, payload }) => {
    if (type === CHANGE_PATH) {
      return getParentPaths(payload);
    }

    return state;
  },
  parentPath: (state = '', { type, payload }) => {
    if (type === CHANGE_PATH) {
      return getParentPaths(payload);
    }
    if (type === SELECT_PARENT_PATH) {
      return payload;
    }

    return state;
  },
  childPath: (state = '', { type, payload }) => {
    if (type === CHANGE_PATH) {
      return getChildPaths(payload);
    }

    return state;
  },
  screenWidth: (state = defaultScreenWidth(), { type, payload }) => {
    if (typeof document === 'undefined') {
      return state;
    }

    const sidebar = document.getElementById('sc-sidebar');

    if (type === WINDOW_RESIZE) {
      if (!payload) {
        return state;
      }

      if (payload > breakpoints.lg) {
        document.body.classList.remove(
          'ks-sidebar-compact-open',
          'ks-sidebar-collapsed'
        );

        document.getElementById('mobile-overlay').classList.remove('ks-open');
        sidebar && sidebar.classList.remove('ks-open');
      } else {
        document.body.classList.add(
          'ks-sidebar-collapsed',
          'ks-sidebar-compact-open'
        );
      }

      return payload;
    }

    return state;
  },
  showSidebar: (state = false, { type, payload }) => {
    if (typeof document === 'undefined') {
      return state;
    }

    if (type === TOGGLE_SIDEBAR) {
      payload = !state;
      const sidebar = document.getElementById('sc-sidebar');
      if (isMobile()) {
        if (payload) {
          document.getElementById('mobile-overlay').classList.add('ks-open');
          sidebar && sidebar.classList.add('ks-open');
        } else {
          document.getElementById('mobile-overlay').classList.remove('ks-open');
          sidebar && sidebar.classList.remove('ks-open');
        }
      } else {
        if (payload) {
          document.body.classList.add(
            'ks-sidebar-collapsed',
            'ks-sidebar-compact-open'
          );
          //sidebar.classList.add('ks-open');
        } else {
          document.body.classList.remove(
            'ks-sidebar-collapsed',
            'ks-sidebar-compact-open'
          );
          //sidebar.classList.remove('ks-open');
        }
      }

      return !!payload;
    }

    if (
      type === WINDOW_RESIZE &&
      typeof payload === 'number' &&
      payload > breakpoints.lg
    ) {
      return false;
    }

    return state;
  }
};
