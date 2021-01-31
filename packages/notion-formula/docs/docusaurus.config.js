module.exports = {
  title: '@nishans/notion-formula',
  tagline: 'A package to convert string into notion formula and vice versa',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.svg',
  organizationName: 'Nishan',
  projectName: '@nishans/notion-formula',
  themeConfig: {
    /* prism: {
      theme: require('prism-react-renderer/themes/dracula'),
    }, */
    hideableSidebar: true,
    navbar: {
      title: 'Notion Formula',
      logo: {
        alt: 'notion-formula logo',
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
          to: 'docs/theory/',
          activeBasePath: 'docs',
          label: 'Theory',
          position: 'left',
        },
        /* {
          to: 'docs/api/',
          activeBasePath: 'docs',
          label: 'API',
          position: 'left',
        }, */
        {
          to: 'docs/examples/',
          activeBasePath: 'docs',
          label: 'Examples',
          position: 'left',
        },
        {
          href: 'https://github.com/Devorein/Nishan/blob/master/packages/notion-formula/README.md',
          position: 'right',
          class: "header-github-link header-link"
        },
        {
          href: 'https://www.npmjs.com/package/@nishans/notion-formula',
          position: 'right',
          class: "header-npm-link header-link"
        },
        {
          position: 'right',
          href: 'https://discord.gg/SpwHCz8ysx',
          class: "header-discord-link header-link"
        },
        {
          label: 'Discussions',
          href: 'https://github.com/Devorein/Nishan/discussions',
          position: 'right',
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
  plugins: [
    [
      'docusaurus-plugin-typedoc',
      {
        // TypeDoc options
        entryPoints: ['../src/index.ts'],
        tsconfig: '../tsconfig.json',
        plugin: [],
        mode: "node",
        // Plugin options
        docsRoot: 'docs',
        out: 'api',
        sidebar: {
          sidebarFile: 'notion-formula.js',
          fullNames: true,
          readmeLabel: 'Overview'
        },
      },
    ],
  ],
};
