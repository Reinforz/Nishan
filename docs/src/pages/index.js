import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';
import Head from "@docusaurus/Head";

const features = [
  {
    title: 'Easy to Use',
    imageUrl: 'img/root/easy.svg',
    description: (
      <>
        All the packages are well documented and crafted with ease of use in mind
      </>
    ),
  },
  {
    title: 'Multi Purpose',
    imageUrl: 'img/root/multi_purpose.svg',
    description: (
      <>
        Nishan's ecosystem provides various packages to do almost anything with notion
      </>
    ),
  },
  {
    title: 'Typescript Support',
    imageUrl: 'img/root/ts_support.svg',
    description: (
      <>
        Typescript support right out of the box for static typechecking.
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx('col col--4', styles.feature)}>
      <img src={imgUrl} alt={title} />
      <h3 className="features__title">{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="A whole ecosystem of npm packages to automate notion using typescript or javascript">
      <Head>
        <link rel="preconnect" href="https://fonts.gstatic.com"/>
        <link href="https://fonts.googleapis.com/css2?family=Nunito+Sans:wght@400;600;700&display=swap" rel="stylesheet"/>
      </Head>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <img height="250" src={`${siteConfig.favicon}`}/>
          <p className="hero__subtitle"><b>{siteConfig.tagline}</b></p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/')}>
              Get Started
            </Link>
          </div>
          <a className="github-star" href="https://github.com/Devorein/Nishan">
            <img height="25" src="https://img.shields.io/github/stars/devorein/nishan?style=social"/>
          </a>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
