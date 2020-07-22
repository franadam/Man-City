import React, { Component } from 'react'
import classes from './promotion.module.css'
import jersey from '../../../Resources/images/jersey.jpg';
import Enroll from './Enroll/Enroll';

const INTERVAL = 1500;

export default class Promotion extends Component {
  componentDidMount(){
    this.timeout = setTimeout( () => {
      this.transitionHandler()
    }, INTERVAL)
  }

  componentWillUnmount () {
    clearInterval(this.timeout)
  }

  transitionHandler = () => {
    document.querySelector(`.${classes.text}`).style.transform = `scale(1)`;
    document.querySelector(`.${classes.imageContainer}`).style.transform = `scale(1)`;
  }

  render() {
    return (
      <div className={classes.main}>
        <div className={classes.animation}>
          <div className={classes.text}>
            <p>Win a </p>
            <p>jersey</p>
          </div>
          <div className={classes.imageContainer}>
            <img className={classes.image} src={jersey} alt='jersey' />
          </div>
        </div>
        <div className={classes.enroll}>
          <Enroll />
        </div>
      </div>
    )
  }
}
