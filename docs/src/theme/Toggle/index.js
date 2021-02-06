/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React from 'react';
import Toggle from 'react-toggle';
import { useThemeConfig } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import clsx from 'clsx';
import styles from './styles.module.css';

const Dark = () => <img className={clsx("react-toggle_icon", styles.toggle, styles.dark)} src="/img/root/moon.svg"/>;

const Light = () => <img className={clsx("react-toggle_icon", styles.toggle, styles.light)} src="/img/root/sun.svg"/>;

export default function (props) {
  const {
    colorMode: {
      switchConfig: {
        darkIcon,
        darkIconStyle,
        lightIcon,
        lightIconStyle
      }
    }
  } = useThemeConfig();
  const {
    isClient
  } = useDocusaurusContext();
  return <Toggle disabled={!isClient} icons={{
    checked: <Dark icon={darkIcon} style={darkIconStyle} />,
    unchecked: <Light icon={lightIcon} style={lightIconStyle} />
  }} {...props} />;
}