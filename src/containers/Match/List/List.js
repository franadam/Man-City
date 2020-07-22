import React, { Component } from 'react';

import Spinner from '../../../UI/Spinner/Spinner';
import classes from './list.module.css'

class MatchesList extends Component {
  state = {
    matchesList: []
  }

  static getDerivedStateFromProps(props, state) {
    return state = {
      matchesList: props.matches
    }
  }

  render() {
    const { matchesList } = this.state;
    let list = <Spinner />
    if (matchesList) {
      list = (
        <div className={classes.boxes}>
          {matchesList.map(match => (
            <div key={match.id} className={classes.box}>
              <div className={classes.wrapper}>
                <div className={classes.block}>
                  <div 
                    className={classes.icon}
                    style={{background: `url(/images/team_icons/${match.localThmb}.png)`}}
                    ></div>
                  <div className={classes.team}>{match.local}</div>
                  <div className={classes.result}>{match.resultLocal}</div>
                </div>
                <div className={classes.block}>
                  <div 
                    className={classes.icon}
                    style={{background: `url(/images/team_icons/${match.awayThmb}.png)`}}
                    ></div>
                  <div className={classes.team}>{match.away}</div>
                  <div className={classes.result}>{match.resultAway}</div>
                </div>
              </div>

              <div className={`${classes.wrapper} ${classes.info}`}>
                <div className={classes.date}><strong>Date: </strong>{match.date}</div>
                <div className={classes.team}><strong>Referee: </strong>{match.referee}</div>
                <div className={classes.result}><strong>Stadium: </strong>{match.stadium}</div>
              </div>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div className={classes.main}>
        {list}
      </div>
    )
  }
};

export default MatchesList;