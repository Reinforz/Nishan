import React from 'react';
import clsx from 'clsx';
import { useThemeConfig } from '@docusaurus/theme-common';
import useUserPreferencesContext from '@theme/hooks/useUserPreferencesContext';
import styles from './styles.module.css';

function AnnouncementBar() {
  const {
    isAnnouncementBarClosed,
    closeAnnouncementBar
  } = useUserPreferencesContext();
  const {
    announcementBar
  } = useThemeConfig();

  if (!announcementBar) {
    return null;
  }

  const {
    content,
    isCloseable
  } = announcementBar;

  if (!content || isCloseable && isAnnouncementBarClosed) {
    return null;
  }

  return <div className={styles.announcementBar} role="banner">
      <div className={clsx(styles.announcementBarContent, {
      [styles.announcementBarCloseable]: isCloseable
    })} // Developer provided the HTML, so assume it's safe.
    dangerouslySetInnerHTML={{
      __html: content
    }} />
      {isCloseable ? <button type="button" className={styles.announcementBarClose} onClick={closeAnnouncementBar} aria-label="Close">
          <span aria-hidden="true">×</span>
        </button> : null}
    </div>;
}

export default AnnouncementBar;