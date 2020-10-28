module.exports = {
	title: 'Nishan Docs',
	tagline: 'Documentation for nishan, an unofficial notion api',
	url: 'https://nishan-docs.netlify.app/',
	baseUrl: '/',
	onBrokenLinks: 'throw',
	favicon: 'img/logo.svg',
	organizationName: 'Nishan-Open-Source',
	projectName: 'Nishan-Docs',
	themeConfig: {
		navbar: {
			title: 'Nishan Docs',
			logo: {
				alt: 'My Site Logo',
				src: 'img/logo.svg'
			},
			items: [
				{
					to: 'docs/',
					activeBasePath: 'docs',
					label: 'Docs',
					position: 'left'
				},
				{
					href: 'https://github.com/Nishan-Open-Source/Nishan-Docs',
					label: 'GitHub',
					position: 'right'
				},
				{
					href: 'https://github.com/Nishan-Open-Source/Nishan',
					label: 'Nishan',
					position: 'left'
				}
			]
		},
		footer: {
			style: 'dark',
			links: [
				{
					title: 'Docs',
					items: [
						{
							label: 'Getting Started',
							to: 'docs/'
						}
					]
				},
				{
					title: 'More',
					items: [
						{
							label: 'GitHub',
							href: 'https://github.com/Nishan-Open-Source/Nishan-Docs'
						}
					]
				}
			],
			copyright: `Copyright © ${new Date().getFullYear()}. Made with ❤️ by devorein, hosted on netlify.`
		}
	},
	presets: [
		[
			'@docusaurus/preset-classic',
			{
				docs: {
					sidebarPath: require.resolve('./sidebars.js'),
					editUrl: 'https://github.com/Nishan-Open-Source/Nishan-Docs/edit/master/docs/'
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css')
				}
			}
		]
	],
	plugins: [
		[
			'docusaurus-plugin-typedoc',
			{
				inputFiles: [ '../dist' ],
				docsRoot: 'docs',
				out: 'api',
				sidebar: {
					sidebarFile: './typedoc-sidebars.js',
					fullNames: true
				},
				mode: 'modules',
				target: `ESNext`,
				disableOutputCheck: true,
				excludeExternals: true,
				ignoreCompilerErrors: true
			}
		]
	]
};
