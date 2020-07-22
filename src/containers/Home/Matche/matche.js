import React from 'react'
import classes from './matche.module.css';
import Block from './Bloks/Blocks';

export default function matche() {
  return (
    <div className={classes.main}>
      <h1 className={classes.tag}>Matches</h1>
      <Block/>
      <div className={classes.tag}>See more matches</div>
    </div>
  )
}
