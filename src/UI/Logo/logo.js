import React from 'react';

import logo_src from '../../Resources/images/logos/manchester_city_logo.png';
import classes from './logo.module.css';
import { Link } from 'react-router-dom';

export const Logo = props => {
  let mainLogo = (
    <div className={classes.main}>
      <img className={classes.main} src={logo_src} alt='logo'/>
    </div>
  );
  
  if (props.link) {
    mainLogo = <Link to={props.link}>{mainLogo}</Link>
  }
    return (
      mainLogo
    )
}
