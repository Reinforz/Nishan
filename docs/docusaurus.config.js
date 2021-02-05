module.exports = {
	title: 'Nishan Docs',
	tagline: 'Documentation for nishan, an ecosystem of packages for notion',
	url: 'https://nishan-docs.netlify.app/',
	baseUrl: '/',
	onBrokenLinks: 'throw',
	favicon: 'img/root/logo.svg',
	organizationName: 'Nishan',
	projectName: 'Nishan',
	themeConfig: {
    prism: {
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/vsDark'),
    },
    algolia: {
      apiKey: 'fee719740e392ae5f55e18c139ea1e12',
      indexName: 'nishan',
    },
    hideableSidebar: true,
		navbar: {
			title: 'Nishan',
			logo: {
				alt: 'Nishan Logo',
				src: 'img/root/logo.svg'
			},
			items: [
        {
					to: 'docs/core/Introduction/Introduction',
					activeBasePath: 'docs',
					label: 'Core',
					position: 'left'
        },
        {
					to: 'docs/types/Introduction/Introduction',
					activeBasePath: 'docs',
					label: 'Types',
					position: 'left'
        },
        {
					to: 'docs/endpoints/Introduction/Introduction',
					activeBasePath: 'docs',
					label: 'Endpoints',
					position: 'left'
        },
        {
					to: 'docs/sync/Introduction/Introduction',
					activeBasePath: 'docs',
					label: 'Sync',
					position: 'left'
        },
        {
					to: 'docs/markdown/Introduction/Introduction',
					activeBasePath: 'docs',
					label: 'Markdown',
					position: 'left'
        },
        {
					to: 'docs/notion-formula/Introduction/Introduction',
					activeBasePath: 'docs',
					label: 'NF',
					position: 'left'
        },
        {
					to: 'docs/utils/Introduction/Introduction',
					activeBasePath: 'docs',
					label: 'Utils',
					position: 'left'
        },
        {
          href: 'https://github.com/Devorein/Nishan',
          position: 'right',
          class: "header-github-link header-link"
        },
        {
          href: 'https://www.npmjs.com/search?q=%40nishans',
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
        }
			]
		},
		footer: {
			style: 'dark',
			links: [
				{
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/nishan',
            },
            {
              label: 'Github Discussions',
              href: 'https://github.com/Devorein/Nishan/discussions',
            },
            {
              label: 'Discord',
              href: 'https://discord.gg/SpwHCz8ysx',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/devorein',
            },
          ],
        }
			],
			copyright: `Copyright © ${new Date().getFullYear()}. Made by devorein, hosted on netlify.`
		}
	},
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
          showLastUpdateAuthor: false,
          showLastUpdateTime: true,
					sidebarPath: require.resolve('./sidebars.js'),
					editUrl: 'https://github.com/Devorein/Nishan/edit/master/docs/'
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css')
				}
			}
		]
	],
};
