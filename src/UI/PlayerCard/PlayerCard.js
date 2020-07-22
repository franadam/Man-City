import React from 'react'
import classes from './PlayerCard.module.css';

export default function PlayerCard(props) {
  return (
    <div className={classes.main}>
      <div className={classes.picture}>
        <img src={props.image} alt='lol'/>
      </div>
      <div className={classes.info}>
        <div className={classes.number}>
          {props.number}
        </div>
        <div className={classes.name}>
          <p>{props.firstname} </p>
          <p> {props.lastname}</p>
        </div>
      </div>
    </div>
  )
}
