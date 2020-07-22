import React, { Component } from 'react'
import classes from './Home.module.css';

import Header from './Header/Header';
import Matche from './Matche/matche';
import MeetPlayer from './MeetPlayer/MeetPlayer';
import Promotion from './Promotion/Promotion';

export default class Home extends Component {
  render() {
    return (
      <div className={classes.main}>
        <Header/>
        <Matche/>
        <MeetPlayer />
        <Promotion />
      </div>
    )
  }
}
