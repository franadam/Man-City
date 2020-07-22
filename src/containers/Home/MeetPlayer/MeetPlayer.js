import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import {firebasePlayers} from '../../../firebase'
import PlayerCard from '../../../UI/PlayerCard/PlayerCard';
import {firebaseLooper, reverseArray} from '../../../shared/utils';
import classes from './MeetPlayer.module.css';

import player01 from '../../../Resources/images/players/player_to_upload/DEF/benjamin_mendy.png'
import player02 from '../../../Resources/images/players/player_to_upload/DEF/danilo_brabosa.png'
import player03 from '../../../Resources/images/players/player_to_upload/DEF/aymeric_laporte.png'
import player04 from '../../../Resources/images/players/player_to_upload/DEF/nicolas_otamendi.png'

const playersD = [player01, player02, player03, player04]
const INTERVAL = 1000;

export default class MeetPlayer extends Component {

  state = {
    players: []
  }

  componentDidMount() {
    firebasePlayers.once('value')
    .then(snapshot => {
      const players = firebaseLooper(snapshot);
      this.setState({
        players:  players.filter(p => p.position === "Defence").slice(0,4)
      })
    })
    .then(snapshot => 
      this.timeout = setTimeout( () => {
        this.transitionHandler();
      }, INTERVAL))
    .catch(error => {
      console.log(error);
    })
  }

  componentWillUnmount () {
    clearInterval(this.timeout)
  }
  
  transitionHandler = () => {
    document.querySelectorAll(`.${classes.wrapper}`)
      .forEach((w, i)=> {
        const x = window.matchMedia("(max-width: 400px)");
        if (x) {
          w.style.transform = `translate(${8 - i * 2}rem, ${1 + i*2}rem)`;
        }
        else {
          w.style.transform = `translate(${16 - i * 4.5}rem, ${1 + i*1.8}rem)`;
        }
      })
  }

  showPlayers = players => (
    players ? 
      players.map((player, idx) => (
        <div key={player.id} className={classes.item}>
          <div className={classes.wrapper}>
            <PlayerCard 
              firstname={player.name}
              lastname={player.lastname}
              image={playersD[idx]}
              number={player.number}
              />
          </div>
        </div>))
      : null
  )

  render() {
    return (
      <div className={classes.main}>
        <div className={classes.players}>
          {this.showPlayers(this.state.players)}
        </div>
        <div className={classes.text}>
          <div className={classes.titles}>
            <h2 className={classes.title}>Meet</h2>
            <h2 className={classes.title}>The</h2>
            <h2 className={classes.title}>Players</h2>
          </div>
          <Link className={classes.link} to='/the_team' >
            <div className={classes.tag}>Meet them here</div>
          </Link>
        </div>
      </div>
    )
  }
}
