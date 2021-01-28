module.exports = {
  title: '@nishans/notion-formula',
  tagline: 'A package to convert string into notion formula and vice versa',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'Nishan',
  projectName: '@nishans/notion-formula',
  themeConfig: {
    hideableSidebar: true,
    navbar: {
      title: 'Notion Formula',
      logo: {
        alt: 'notion-formula',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/Devorein/Nishan/blob/master/packages/notion-formula/README.md',
          label: 'GitHub',
          position: 'right',
        },
        {
          position: 'right',
          label: 'Discord',
          href: 'https://discord.gg/SpwHCz8ysx',
        },
        {
          label: 'Discussions',
          href: 'https://github.com/Devorein/Nishan/discussions',
        },
      ],
    },
    footer: {
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/Devorein/Nishan/edit/master/packages/notion-formula/docs',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
