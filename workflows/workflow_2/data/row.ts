import { category, language } from "./options";

interface Item {
  category: category,
  title: string,
  image: string,
  language?: language
}

const Items: Item[] = [
  {
    category: "Language",
    title: "Typescript",
    image: "https://miro.medium.com/max/816/1*mn6bOs7s6Qbao15PMNRyOA.png",
    language: "Javascript"
  },
  {
    category: "Library",
    title: "React",
    image: "https://cdn4.iconfinder.com/data/icons/logos-3/600/React.js_logo-512.png",
    language: "Javascript"
  },
  {
    category: "Database",
    title: "MongoDB",
    image: "https://1000logos.net/wp-content/uploads/2020/08/MongoDB-Emblem.jpg",
  },
  {
    category: "Language",
    title: "Sass",
    image: "https://sass-lang.com/assets/img/logos/logo-b6e1ef6e.svg",
    language: "CSS"
  },
  {
    category: "Language",
    title: "Dart",
    image: "https://cdn-images-1.medium.com/max/1200/1*knHF_qpxdtS8h0Z8EeqowA.png",
  },
  {
    category: "Language",
    title: "Node",
    image: "https://seeklogo.com/images/N/nodejs-logo-FBE122E377-seeklogo.com.png",
    language: "Javascript"
  },
  {
    category: "Language",
    title: "Go",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ0oElC31fXBNSwZ2hKCa_3Oa1VEmmSIUlAfwxfa8N42mbXTZbK&usqp=CAU",
  },
  {
    category: "Language",
    title: "HTML",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/512px-HTML5_logo_and_wordmark.svg.png"
  },
  {
    category: "Language",
    title: "Javascript",
    image: "https://pluspng.com/img-png/logo-javascript-png-file-javascript-logo-png-1052.png"
  },
  {
    category: "Language",
    title: "CSS",
    image: "https://cdn.worldvectorlogo.com/logos/css3.svg"
  },
  {
    category: "Language",
    title: "Python",
    image: "https://sdtimes.com/wp-content/uploads/2019/08/opengraph-icon-200x200.png"
  },
  {
    category: "Tools",
    title: "NGinx",
    image: "https://linuxtips.us/wp-content/uploads/nginx-logo.png"
  },
  {
    category: "Language",
    title: "Pug",
    image: "https://camo.githubusercontent.com/a43de8ca816e78b1c2666f7696f449b2eeddbeca/68747470733a2f2f63646e2e7261776769742e636f6d2f7075676a732f7075672d6c6f676f2f656563343336636565386664396431373236643738333963626539396431663639343639326330632f5356472f7075672d66696e616c2d6c6f676f2d5f2d636f6c6f75722d3132382e737667",
    language: "HTML"
  },
  {
    category: "Framework",
    title: "Tailwind",
    image: "https://seeklogo.com/images/T/tailwind-css-logo-5AD4175897-seeklogo.com.png",
    language: "CSS"
  },
  {
    category: "Framework",
    title: "Electron",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Electron_Software_Framework_Logo.svg/1024px-Electron_Software_Framework_Logo.svg.png",
    language: "Javascript"
  },
  {
    category: "Framework",
    title: "Express",
    image: "https://cdn.glitch.com/project-avatar/fa1f1a9a-054c-42b2-93ab-83ec4f40695d.png?2017-09-13T18:38:00.967Z",
    language: "Node"
  },
  {
    category: "Technology",
    title: "JWT",
    image: "https://i0.wp.com/blog.fossasia.org/wp-content/uploads/2017/07/pic_logo.png?fit=500%2C500&ssl=1",
  },
  {
    category: "Technology",
    title: "XSS",
    image: "https://2.bp.blogspot.com/-Apx93gzFnPw/V3PAczYyH8I/AAAAAAAAASw/ZdEdpMnstbwMRkrEmP9866u8edcFed67ACLcB/s1600/XSS.png",
  },
  {
    category: "Technology",
    title: "JSON",
    image: "https://cdn.freebiesupply.com/logos/large/2x/json-logo-png-transparent.png"
  },
  {
    category: "Technology",
    title: "SVG",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/SVG_logo.svg/1024px-SVG_logo.svg.png"
  },
  {
    category: "Technology",
    title: "GraphQL",
    image: "https://i0.wp.com/blog.knoldus.com/wp-content/uploads/2019/06/graphql.png?fit=600%2C600&ssl=1"
  },
  {
    category: "Technology",
    title: "REST",
    image: "https://www.geekmusthave.com/wp-content/uploads/2018/11/restapi.png"
  },
  {
    category: "Technology",
    title: "Regex",
    image: "https://kasunkodagoda.gallerycdn.vsassets.io/extensions/kasunkodagoda/regex-match-replace/2.1.5/1567104415777/Microsoft.VisualStudio.Services.Icons.Default"
  },
  {
    category: "Library",
    title: "Babel",
    image: "https://user-images.githubusercontent.com/56288/58110630-8a3c1080-7bb5-11e9-8f16-afa391dc4223.jpg",
    language: "Javascript"
  },
  {
    category: "Library",
    title: "ESLint",
    image: "https://eslint.org/assets/img/favicon.512x512.png",
    language: "Javascript"
  },
  {
    category: "Library",
    title: "Webpack",
    image: "https://raw.githubusercontent.com/webpack/media/master/logo/icon-square-big.png",
    language: "Javascript"
  },
  {
    category: "Library",
    title: "Jest",
    image: "https://miro.medium.com/max/600/1*i37IyHf6vnhqWIA9osxU3w.png",
    language: "Javascript"
  },
  {
    category: "Library",
    title: "Mongoose",
    image: "https://opencollective-production.s3-us-west-1.amazonaws.com/7a00cdd0-fae4-11e7-ae09-7f36f712693a.png",
    language: "Javascript"
  },
  {
    category: "Tools",
    title: "Docker",
    image: "https://www.docker.com/sites/default/files/d8/2019-07/vertical-logo-monochromatic.png"
  },
  {
    category: "Tools",
    title: "Kubernetes",
    image: "https://logos-download.com/wp-content/uploads/2018/09/Kubernetes_Logo.png"
  },
  {
    category: "Tools",
    title: "Vim",
    image: "https://cdn.freebiesupply.com/logos/large/2x/vim-logo-png-transparent.png"
  },
  {
    category: "Tools",
    title: "VSCode",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9a/Visual_Studio_Code_1.35_icon.svg/1024px-Visual_Studio_Code_1.35_icon.svg.png"
  },
  {
    category: "Tools",
    title: "Github Actions",
    image: "https://miro.medium.com/max/300/0*EOBenMCWMDaPdeJL.png"
  },
  {
    category: "Tools",
    title: "Chrome Devtools",
    image: "https://developers.google.com/web/tools/images/chrome-devtools-16x9.png"
  },
  {
    category: "Tools",
    title: "Postman",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcTQwqKK2UfH60mxJjus8X3-Fa3WMnlQY3QwPi-424bq6DlRkTBR&usqp=CAU"
  },
  {
    category: "Tools",
    title: "NPM",
    image: "https://cdn.worldvectorlogo.com/logos/npm-2.svg",
    language: "Javascript"
  },
  {
    category: "Tools",
    title: "Git",
    image: "https://git-scm.com/images/logos/downloads/Git-Icon-1788C.png"
  },
  {
    category: "Tools",
    title: "Github",
    image: "https://cdn0.iconfinder.com/data/icons/octicons/1024/mark-github-512.png"
  },
  {
    category: "Database",
    title: "PostgreSQL",
    language: "SQL",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Postgresql_elephant.svg/1200px-Postgresql_elephant.svg.png"
  }
]

export default Items