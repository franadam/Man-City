import React from 'react';
import classes from './Filter.module.css';

export default function Filter(props) {
  return (
    <div className={classes.main}>
      <div className={classes.box}>
        <div className={classes.title}>Show Matches</div>
        <div className={classes.criteria}>
          <div className={`${classes.option} ${props.criteria.played === 'All' ? classes.active : ''}`} onClick={() => props.showPlayed('All')} >All</div>
          <div className={`${classes.option} ${props.criteria.played === 'Yes' ? classes.active : ''}`} onClick={() => props.showPlayed('Yes')} >Played</div>
          <div className={`${classes.option} ${props.criteria.played === 'No' ? classes.active : ''}`} onClick={() => props.showPlayed('No')} >Not Payed</div>
        </div>
      </div>
      <div className={classes.box}>
        <div className={classes.title}>Show Result</div>
        <div className={classes.criteria}>
          <div className={`${classes.option} ${props.criteria.result === 'All' ? classes.active : ''}`} onClick={() => props.showResult('All')} >All</div>
          <div className={`${classes.option} ${props.criteria.result === 'W' ? classes.active : ''}`} onClick={() => props.showResult('W')} >Win</div>
          <div className={`${classes.option} ${props.criteria.result === 'L' ? classes.active : ''}`} onClick={() => props.showResult('L')} >Lose</div>
          <div className={`${classes.option} ${props.criteria.result === 'D' ? classes.active : ''}`} onClick={() => props.showResult('D')} >Draw</div>
        </div>
      </div>
    </div>
  )
}
