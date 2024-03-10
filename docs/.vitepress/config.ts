import vitepressHelper, { config } from '@huyikai/vitepress-helper';

import { defineConfigWithTheme } from 'vitepress';

const vitepressHelperConfig = {
  directory: 'docs',
  collapsible: true
};
const vitepressConfig = {
  base: '/tree-conver/',
  title: 'Tree-Conver',
  description: 'Tree data conversion tool',
  head: [
    ['link', { rel: 'icon', href: 'favicon.ico' }] //浏览器标签icon
  ],
  themeConfig: {
    siteTitle: 'Tree-Conver', //导航栏左侧名称
    logo: '/static/logo.svg', //导航栏左侧头像
    lastUpdated: true, //最后更新时间
    outlineTitle: 'Catalog', //右侧 侧边栏标题

    search: {
      provider: 'local' // 离线搜索
    },

    // 社交链接
    socialLinks: [
      { icon: 'github', link: 'https://github.com/huyikai/tree-conver.git' }
    ],
    // 网站页脚
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2022'
    },
    // 文档页脚-上下页显示文字
    docFooter: {
      prev: 'Pervious',
      next: 'Next'
    }
  },
  locales: {
    root: {
      label: '简体中文',
      lang: 'zh'
    },

    en: {
      label: 'English',
      lang: 'en'
    }
  }
};
export default async () => {
  const vitepressHelperInstance: any = await vitepressHelper({
    ...vitepressHelperConfig,
    ...vitepressConfig
  });
  return defineConfigWithTheme({
    extends: config,
    ...vitepressHelperInstance
  });
};
