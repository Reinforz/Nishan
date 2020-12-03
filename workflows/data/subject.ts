import { TTextColor } from '../../types';

import { TFor } from "./for";
import { TCategory } from "./category";

interface Item {
  category: TCategory[],
  title: string,
  image: string,
  for?: TFor[],
  color: TTextColor,
}

const arr: Item[] = [
  {
    color: "default",
    title: "Apollo",
    category: ["Stack"],
    for: ["Javascript", "GraphQL"],
    image: "https://seeklogo.com/images/A/apollo-logo-DC7DD3C444-seeklogo.com.png"
  },
  {
    color: "default",
    title: "Axios",
    image: "https://i2.wp.com/digiday.com/wp-content/uploads/2017/01/axiosmainer2.jpg?resize=1030%2C438&ssl=1",
    category: ["HTTP", "Library"],
    for: ["Javascript"]
  },
  {
    color: "yellow",
    title: "Babel",
    category: ["Transpiler", "Library"],
    image: "https://user-images.githubusercontent.com/56288/58110630-8a3c1080-7bb5-11e9-8f16-afa391dc4223.jpg",
    for: ["Javascript"]
  },
  {
    color: "blue",
    title: "CSS",
    category: ["Language"],
    image: "https://seeklogo.com/images/C/css3-logo-8724075274-seeklogo.com.png"
  },
  {
    color: "default",
    title: "Chrome Devtools",
    category: ["Tools"],
    image: "https://developers.google.com/web/tools/images/chrome-devtools-16x9.png"
  },
  {
    color: "blue",
    title: "Docker",
    category: ["PAAS", "Tools"],
    image: "https://www.docker.com/sites/default/files/d8/2019-07/vertical-logo-monochromatic.png"
  },
  {
    color: "green",
    title: "Docusaurus",
    image: "https://v2.docusaurus.io/img/docusaurus_keytar.svg",
    category: ["Doc Generator", "Library"],
    for: ["Javascript", "Markdown"]
  },
  {
    image: "https://eslint.org/assets/img/favicon.512x512.png",
    category: ["Linter", "Library"],
    for: ["Javascript"],
    color: "blue",
    title: "ESLint"
  },
  {
    color: "gray",
    title: "Electron",
    category: ["Framework"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Electron_Software_Framework_Logo.svg/1024px-Electron_Software_Framework_Logo.svg.png",
    for: ["Javascript"]
  },
  {
    category: ["Server", "Framework"],
    color: "default",
    title: "Express",
    for: ["Node"],
    image: "https://cdn.glitch.com/project-avatar/fa1f1a9a-054c-42b2-93ab-83ec4f40695d.png?2017-09-13T18:38:00.967Z"
  },
  {
    color: "purple",
    title: "Gatsby",
    image: "https://cdn.auth0.com/blog/gatsby-react-webtask/logo.png",
    for: ["React"],
    category: ["SSG", "Framework"]
  },
  {
    color: "red",
    title: "Git",
    category: ["Version Control", "Tools"],
    image: "https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png"
  },
  {
    color: "default",
    title: "Github",
    category: ["Tools"],
    image: "https://image.flaticon.com/icons/png/512/25/25231.png"
  },
  {
    color: "default",
    category: ["CI", "CD", "Tools"],
    image: "https://avatars1.githubusercontent.com/u/44036562?s=280&v=4",
    title: "Github Actions"
  },
  {
    color: "pink",
    title: "GraphQL",
    category: ["Language", "Technology"],
    image: "https://i0.wp.com/blog.knoldus.com/wp-content/uploads/2019/06/graphql.png?fit=600%2C600&ssl=1"
  },
  {
    color: "orange",
    title: "HTML",
    category: ["Markup", "Language"],
    image: "https://i.stack.imgur.com/PgcSR.png"
  },
  {
    color: "purple",
    title: "Heroku",
    image: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.crunchbase.com%2Forganization%2Fheroku&psig=AOvVaw11u9e1x1vmoLz-QKP7u_Gs&ust=1607009535401000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCMDa0pjPr-0CFQAAAAAdAAAAABAD",
    category: ["Cloud Platform", "Tools"]
  },
  {
    color: "blue",
    title: "JSX",
    category: ["Markup", "Language"],
    for: ["React"],
    image: ""
  },
  {
    color: "blue",
    category: ["Technology"],
    title: "JWT",
    image: "https://i0.wp.com/blog.fossasia.org/wp-content/uploads/2017/07/pic_logo.png?fit=500%2C500&ssl=1"
  },
  {
    color: "yellow",
    title: "Javascript",
    category: ["Language"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/480px-JavaScript-logo.png"
  },
  {
    image: "https://miro.medium.com/max/600/1*i37IyHf6vnhqWIA9osxU3w.png",
    category: ["Testing", "Library"],
    color: "brown",
    for: ["Javascript"],
    title: "Jest"
  },
  {
    color: "blue",
    title: "Kubernetes",
    category: ["Orchestration", "Tools"],
    image: "https://logos-download.com/wp-content/uploads/2018/09/Kubernetes_Logo.png"
  },
  {
    color: "yellow",
    title: "MDX",
    image: "https://seeklogo.com/images/M/mdx-logo-60628A5188-seeklogo.com.png",
    for: ["Markdown", "React"],
    category: ["Language"]
  },
  {
    color: "default",
    title: "MERN",
    for: ["Javascript"],
    category: ["Stack"],
    image: "https://blog.hyperiondev.com/wp-content/uploads/2018/09/Blog-Article-MERN-Stack.jpg"
  },
  {
    color: "default",
    title: "Markdown",
    category: ["Language"],
    image: "https://cdn.onlinewebfonts.com/svg/img_2398.png"
  },
  {
    color: "blue",
    title: "Material UI",
    for: ["React"],
    category: ["Design System", "Framework"],
    image: "https://opencollective-production.s3.us-west-1.amazonaws.com/ada636e0-395b-11ea-8ab7-b3f0317bbc7c.png"
  },
  {
    category: ["Database"],
    color: "green",
    title: "MongoDB",
    image: "https://1000logos.net/wp-content/uploads/2020/08/MongoDB-Emblem.jpg"
  },
  {
    image: "https://opencollective-production.s3-us-west-1.amazonaws.com/7a00cdd0-fae4-11e7-ae09-7f36f712693a.png",
    category: ["ORM", "Library"],
    color: "default",
    title: "Mongoose",
    for: ["MongoDB", "Javascript"]
  },
  {
    color: "green",
    category: ["Reverse Proxy", "Load Balancer", "Server"],
    title: "NGinx",
    image: "https://linuxtips.us/wp-content/uploads/nginx-logo.png"
  },
  {
    color: "red",
    title: "NPM",
    image: "https://authy.com/wp-content/uploads/npm-logo.png",
    category: ["Package Manager"],
    for: ["Javascript"]
  },
  {
    color: "green",
    title: "Netlify",
    category: ["Cloud Platform", "Tools"],
    image: "https://www.netlify.com/img/press/logos/logomark.png"
  },
  {
    color: "gray",
    title: "Next",
    for: ["React"],
    category: ["SSR", "SSG", "Framework"],
    image: "https://cdn.iconscout.com/icon/free/png-512/react-1-282599.png"
  },
  {
    color: "green",
    title: "Node",
    category: ["Runtime"],
    for: ["Javascript"],
    image: "https://seeklogo.com/images/N/nodejs-logo-FBE122E377-seeklogo.com.png"
  },
  {
    color: "default",
    title: "Notion",
    category: ["Tools"],
    image: "https://seeklogo.com/images/N/notion-app-logo-009B1538E8-seeklogo.com.png"
  },
  {
    color: "blue",
    title: "Parcel",
    image: "https://parceljs.org/assets/parcel-og.png",
    category: ["Bundler"],
    for: ["Javascript"]
  },
  {
    color: "blue",
    title: "PostgreSQL",
    for: ["SQL"],
    category: ["Database"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/1200px-Postgresql_elephant.svg.png"
  },
  {
    category: ["API Testing", "Tools"],
    color: "orange",
    title: "Postman",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTQwqKK2UfH60mxJjus8X3-Fa3WMnlQY3QwPi-424bq6DlRkTBR&usqp=CAU"
  },
  {
    color: "blue",
    title: "Powershell",
    category: ["Shell Scripting", "Tools"],
    image: "https://upload.wikimedia.org/wikipedia/commons/a/af/PowerShell_Core_6.0_icon.png"
  },
  {
    color: "default",
    title: "Prisma",
    image: "https://cdn.worldvectorlogo.com/logos/prisma-2.svg",
    for: ["Javascript"],
    category: ["ORM"]
  },
  {
    color: "brown",
    category: ["Template Engine", "Markup", "Language"],
    title: "Pug",
    for: ["HTML"],
    image: "https://camo.githubusercontent.com/a43de8ca816e78b1c2666f7696f449b2eeddbeca/68747470733a2f2f63646e2e7261776769742e636f6d2f7075676a732f7075672d6c6f676f2f656563343336636565386664396431373236643738333963626539396431663639343639326330632f5356472f7075672d66696e616c2d6c6f676f2d5f2d636f6c6f75722d3132382e737667"
  },
  {
    color: "blue",
    title: "Python",
    image: "https://sdtimes.com/wp-content/uploads/2019/08/opengraph-icon-200x200.png",
    category: ["Language"]
  },
  {
    color: "red",
    title: "RTL",
    for: ["React"],
    category: ["Testing", "Library"],
    image: "https://testing-library.com/img/octopus-128x128.png"
  },
  {
    color: "blue",
    title: "React",
    for: ["Javascript"],
    category: ["Library"],
    image: "https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png"
  },
  {
    color: "red",
    title: "Redis",
    category: ["Database"],
    image: "https://cdn4.iconfinder.com/data/icons/redis-2/1451/Untitled-2-512.png"
  },
  {
    color: "purple",
    title: "Redux",
    for: ["Javascript"],
    category: ["State Management", "Library"],
    image: "https://assets.stickpng.com/images/5848309bcef1014c0b5e4a9a.png"
  },
  {
    color: "blue",
    title: "Regex",
    category: ["Language"],
    image: "https://kasunkodagoda.gallerycdn.vsassets.io/extensions/kasunkodagoda/regex-match-replace/2.1.5/1567104415777/Microsoft.VisualStudio.Services.Icons.Default"
  },
  {
    color: "pink",
    title: "SVG",
    category: ["Language"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/SVG_logo.svg/1024px-SVG_logo.svg.png"
  },
  {
    color: "pink",
    title: "Sass",
    for: ["CSS"],
    image: "https://sass-lang.com/assets/img/logos/logo-b6e1ef6e.svg",
    category: ["Pre-processor", "Language"]
  },
  {
    color: "gray",
    category: ["Technology"],
    title: "Socket.io",
    image: "https://assets.stickpng.com/images/58482deccef1014c0b5e4a64.png"
  },
  {
    color: "purple",
    category: ["Framework"],
    image: "https://seeklogo.com/images/T/tailwind-css-logo-5AD4175897-seeklogo.com.png",
    title: "Tailwind",
    for: ["CSS"]
  },
  {
    color: "gray",
    title: "Typedoc",
    image: "https://typedoc.org/images/logo-32.png",
    for: ["Typescript"],
    category: ["Doc Generator", "Library"]
  },
  {
    color: "pink",
    title: "Typegraphql",
    image: "https://typegraphql.com/img/logo.png",
    for: ["Typescript"],
    category: ["Library"]
  },
  {
    color: "orange",
    title: "Typeorm",
    image: "https://avatars2.githubusercontent.com/u/20165699?s=400&v=4",
    for: ["Javascript"],
    category: ["ORM"]
  },
  {
    color: "blue",
    title: "Typescript",
    image: "https://miro.medium.com/max/816/1*TpbxEQy4ckB-g31PwUQPlg.png",
    for: ["Javascript"],
    category: ["Superset", "Language"]
  },
  {
    color: "blue",
    title: "VSCode",
    category: ["Editor", "Tools"],
    image: "https://user-images.githubusercontent.com/674621/71187801-14e60a80-2280-11ea-94c9-e56576f76baf.png"
  },
  {
    color: "default",
    category: ["Editor"],
    title: "Vim",
    image: "https://cdn.freebiesupply.com/logos/large/2x/vim-logo-png-transparent.png"
  },
  {
    color: "green",
    title: "Vue",
    category: ["Framework"],
    for: ["Javascript"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Vue.js_Logo_2.svg/1184px-Vue.js_Logo_2.svg.png"
  },
  {
    color: "orange",
    title: "WSL",
    category: ["Tools"],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/800px-Tux.svg.png"
  },
  {
    image: "https://raw.githubusercontent.com/webpack/media/master/logo/icon-square-big.png",
    category: ["Bundler"],
    color: "blue",
    title: "Webpack",
    for: ["Javascript"]
  },
  {
    color: "blue",
    title: "yarn",
    category: ["Package Manager"],
    image: "https://seeklogo.com/images/Y/yarn-logo-F5E7A65FA2-seeklogo.com.png"
  }
];

export default arr;
