import './styles/styles.css';

import theme, { VPButton } from '@huyikai/vitepress-helper/theme/index';

import Home from './home.vue';

export default {
  extends: theme,
  enhanceApp: ({ app }) => {
    app.component('Home', Home);
    app.component('VPButton', VPButton);
  }
};
