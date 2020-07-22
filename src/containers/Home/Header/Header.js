import React, { Component } from 'react'
import classes from './header.module.css';

import player from '../../../Resources/images/featured_player.png'

const INTERVAL = 400;

export default class Header extends Component {
  state = {
    stripes : [
      {
        background: '#98c5e9'
      },
      {
        background: '#ffffff'
      },
      {
        background: '#98c5e9'
      }
    ]
  }

  componentDidMount() {
    this.timeout = setTimeout( () => {
      this.transitionHandler()
    }, INTERVAL)
  }
  
  componentDidUpdate() {
    this.timeout = setTimeout( () => {
      this.transitionHandler()
    }, INTERVAL)
  }

  componentWillUnmount () {
    clearInterval(this.timeout)
  }

  transitionHandler = () => {
    const titles = document.querySelectorAll(`.${classes.title}`);
    document.getElementById('title1').style.transform = `rotateY(-720deg)`;
    document.getElementById('title2').style.transform = `translateX(0)`;
    document.getElementById('title3').style.transform = `translateX(0)`;
    document.getElementById('title3').style.transitionDelay = `.25s`;
    const imgPlayer = document.querySelector(`.${classes.background}`);
    imgPlayer.style.opacity = '1';
  }

  showStripes = () => (
    this.state.stripes.map((stripe, i) => (
      <div key={`stripe-${i}`} className={classes.stripe} style={{background: stripe.background, transform:`rotate(-75deg) translate(-4rem, ${-14 + 14*(i)}rem)`}}></div>
    ))
  ) 

  render() {
    return (
      <header className={classes.header}  style={{overflow: 'hidden'}}>
      <div className={classes.titles}>
        <h2 id='title1' className={classes.title}>3</h2>
        <h2 id='title2' className={classes.title}>League</h2>
        <h2 id='title3' className={classes.title}>Championships</h2>
      </div>
      <div className={classes.wrapperStripe}>
        {this.showStripes()}
      </div>
      <div className={classes.backgroundWrapper}>
        <img className={classes.background} src={player} alt='player' />
      </div>
    </header>
    )
  }
}
