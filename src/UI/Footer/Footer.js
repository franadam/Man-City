import React from 'react'
import { Logo } from '../Logo/logo'
import classes from './Footer.module.css';

export default function Footer() {
  return (
    <div className={classes.main}>
      <div className={classes.logo_container}>
        <Logo />
      </div>
      <div className={classes.info}>
        Manchester city 2018. All rights reserved.
      </div>
    </div>
  )
};