import React, { Component } from 'react';
import { Promise } from 'core-js'

import PlayerCard from '../../UI/PlayerCard/PlayerCard';
import Spinner from '../../UI/Spinner/Spinner';
import { firebase, firebasePlayers } from '../../firebase';
import {firebaseLooper} from '../../shared/utils';

import classes from './team.module.css';
import stripes from '../../Resources/images/stripes.png';

const INTERVAL = 500;

class Teams extends Component {

  state= {
    isLoading: true,
    players: []
  }

  componentDidMount() {
    this.fetchPlayers()
  }
  
  componentWillUnmount () {
    clearInterval(this.timeout)
  }

  fetchPlayers = async () => {
    try {
      const snapshot = await firebasePlayers.once('value');
      const players = firebaseLooper(snapshot);
      let promises = [];

      for (let key in players) {
        promises.push(
          new Promise((resolve, reject) => {
            firebase.storage().ref('players')
              .child(players[key].image).getDownloadURL()
              .then(url => {
                players[key].url = url;
                resolve()
              })
              .catch(error => {
                console.log('promise: ', error);
              });
          })
        )
      }

      Promise.all(promises)
        .then(() => {
          this.setState({
            isLoading: false,
            players: players
          });
        })
        .then(() => {
          this.timeout = setTimeout( () => {
            this.transitionHandler();
          }, INTERVAL)
        });
    } catch (error) {
      
    }
  }

  showPlayersByCategory = category => (
    this.state.players 
      ?  this.state.players.map((player, i) => {
        return player.position === category 
          ? (<div className={classes.item} key={player.name}>
              <PlayerCard
                image={player.url}
                number={player.number}
                firstname={player.name}
                lastname={player.lastname}
              />
          </div>)
          : null
      })
      : null
  )

  transitionHandler = () => {
    document.querySelectorAll(`.${classes.item}`)
      .forEach((w, i)=> {
        const x = window.matchMedia("(max-width: 400px)");
        if (x) {
          w.style.transform = `translateX(0)`; //`translate(${8 - i * 2}rem, ${1 + i*2}rem)`;
        }
        else {
          w.style.transform = `translateX(0)`;
        }
      })
  }
  render() {
    
    let team = <div className={classes.spinner}><Spinner /></div>

    if (!this.state.isLoading) {
      team = (
        <div className={classes.category}>
          <div className={classes.title}>Keeper</div>
          <div className={classes.teamCards}>
            {this.showPlayersByCategory('Keeper')}
          </div>
          
          <div className={classes.title}>Defence</div>
          <div className={classes.teamCards}>
            {this.showPlayersByCategory('Defence')}
          </div>
          
          <div className={classes.title}>Striker</div>
          <div className={classes.teamCards}>
            {this.showPlayersByCategory('Striker')}
          </div>
          
          <div className={classes.title}>Midfield</div>
          <div className={classes.teamCards}>
            {this.showPlayersByCategory('Midfield')}
          </div>
        </div>
      )
    }
    
  return (
      <div className={classes.main}>
        {team}
      </div>
    )
  }
}

export default Teams;