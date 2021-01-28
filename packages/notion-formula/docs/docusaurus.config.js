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
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Getting Started',
              to: 'docs/',
            },
            {
              label: 'Formula Transformation',
              to: 'docs/doc2/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Discord',
              href: 'https://discord.gg/SpwHCz8ysx',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/Devorein/Nishan/discussions',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Nishan Inc. Built with Docusaurus.`,
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
