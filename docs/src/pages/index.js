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
    imageUrl: 'img/Easy.svg',
    description: (
      <>
        Generate notion formula with ease through object, array or string representation
      </>
    ),
  },
  {
    title: 'Automate everything',
    imageUrl: 'img/automation.svg',
    description: (
      <>
        Almost everything that is possible in Notion can be done through nishan.
      </>
    ),
  },
  {
    title: 'Typescript Support',
    imageUrl: 'img/ts_support.svg',
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
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
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
      description="A whole ecosystem of npm packages to automate notion using typescript or javascript">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <img height="250" src={`${siteConfig.favicon}`}/>
          <pre className="hero__code"><div>npm install {siteConfig.title}</div></pre>
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
