import vitepressHelper from '@huyikai/vitepress-helper';
export default async () => {
  const instance: any = await vitepressHelper({
    directory: 'docs',
    collapsible: true
  });
  return {
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
      // 导航栏
      nav: instance.nav,
      search: {
        provider: 'local' // 离线搜索
      },
      // 侧边栏
      sidebar: instance.sidebar,
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
    }
  };
};
