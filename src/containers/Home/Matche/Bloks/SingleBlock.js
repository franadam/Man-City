import React from 'react'
import classes from './singleBlock.module.css'

export default function SingleBlock({match}) {
  return (
    <div className={classes.main}>
      <div className={classes.date}>
        {match.final ? match.date: `Match not played yet: ${match.date}`}
      </div>
      <div className={classes.wrapper}>
        <div className={classes.topItem}>
          <div className={classes.left}>
            <div className={classes.icon} style={{background: `url(/images/team_icons/${match.localThmb}.png)`}}></div>
            <div className={classes.teamName}>{match.local}</div>
          </div>
          <div className={classes.right}>
          {match.final ? match.resultLocal : '-'}
          </div>
        </div>
        <div className={classes.bottomItem}>
          <div className={classes.left}>
          <div className={classes.icon} style={{background: `url(/images/team_icons/${match.awayThmb}.png)`}}></div>
            <div className={classes.teamName}>{match.away}</div>
          </div>
          <div className={classes.right}>
          {match.final ? match.resultAway : '-'}
          </div>
        </div>
        
      </div>
    </div>
  )
}
