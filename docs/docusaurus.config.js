const path = require('path');

module.exports = {
	title: 'Nishan Docs',
	tagline: 'Documentation for nishan, an unofficial notion api for Typescript',
	url: 'https://nishan-docs.netlify.app/',
	baseUrl: '/',
	onBrokenLinks: 'throw',
	favicon: 'img/logo.svg',
	organizationName: 'Devorein',
	projectName: 'Nishan-Docs',
	themeConfig: {
		navbar: {
			title: 'Nishan Docs',
			logo: {
				alt: 'Nishan Logo',
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
					href: 'https://github.com/Devorein/Nishan/tree/master/docs',
					label: 'GitHub',
					position: 'right'
				},
				{
					href: 'https://github.com/Devorein/Nishan',
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
							href: 'https://github.com/Devorein/Nishan/tree/master/docs'
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
					editUrl: 'https://github.com/Devorein/Nishan/edit/master/docs/'
				},
				theme: {
					customCss: require.resolve('./src/css/custom.css')
				}
			}
		]
	]
};
