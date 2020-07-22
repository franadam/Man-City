import React, { Component } from 'react'
import {firebaseMatches} from '../../../../firebase';
import {firebaseLooper, reverseArray} from '../../../../shared/utils';

import SingleBlock from './SingleBlock'
import classes from './blocks.module.css';

const INTERVAL = 300;

export default class Block extends Component {
  state = {
    matches : []
  }

  componentDidMount() {
    firebaseMatches.limitToLast(6).once('value')
      .then(snapshot => {
        const matches = firebaseLooper(snapshot);
        this.setState({
          matches: reverseArray(matches)
        })
      })
      .then(snapshot => 
        this.timeout = setTimeout( () => {
          this.transitionHandler()
        }, INTERVAL))
      .catch(error => {
        console.log(error);
      })
      
  }

  componentWillUnmount () {
    clearInterval(this.timeout)
  }
  
  transitionHandler = () => {
    document.querySelectorAll(`.${classes.wrapper}`).forEach(w => w.style.transform = `translateY(0)`)
  }

  showMatches = matches => (
    matches ? 
      matches.map(match => (
        <div key={match.id} className={classes.item}>
          <div className={classes.wrapper}>
            <SingleBlock match={match}/>
          </div>
        </div>))
      : null
  )

  render() {
    return (
      <div className={classes.main}>
        {this.showMatches(this.state.matches)}
      </div>
    )
  }
}
