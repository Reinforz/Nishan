import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: 'Easy to Use',
    imageUrl: 'img/undraw_docusaurus_mountain.svg',
    description: (
      <>
        Generate notion formula with ease through object, array or string representation
      </>
    ),
  },
  {
    title: 'Emulates Original Parser',
    imageUrl: 'img/undraw_docusaurus_tree.svg',
    description: (
      <>
        Notion formula emulates and mimics the action formula parser and provide useful and intuitive error messages
      </>
    ),
  },
  {
    title: 'Typescript Support',
    imageUrl: 'img/undraw_docusaurus_react.svg',
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
      <h3>{title}</h3>
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
      description="Formulas are like superpowers in Notion. But formulas are difficult to create, in the way notion stores them. This package provides an api to create notion formulas with ease.">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
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

          <a href="https://github.com/Devorein/Nishan/tree/master/packages/notion-formula">
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
