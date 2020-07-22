import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import {firebase} from '../../../firebase';
import {connect} from 'react-redux';
import classes from './Sidebar.module.css';

import * as actions from '../../../store/actions/auth'

class Sidebar extends Component {
  
  logoutHandler = () => {
    this.props.onLogout();
  }

  render() {
    
    const links = [
      {
        title: 'Matches',
        to: '/admin_matches'
      },
      {
        title: 'Add Matche',
        to: '/admin_matches/edit_match'
      },
      {
        title: 'Players',
        to: '/admin_players'
      },
      {
        title: 'Add Players',
        to: '/admin_players/edit_player'
      }
    ];

    const renderItems = () => (
      links.map(l => (
        <div className={classes.wrapper} key={l.title}>
          <Link className={classes.link} to={l.to}>
            {l.title}
          </Link>
          <hr className={classes.separator}/>
        </div>
      ))
    )

    return (
      <div className={classes.main}>
        {renderItems()}
        <Link 
          className={`${classes.link} ${classes.logout}`} 
          to={'/'}
          onClick={() => this.logoutHandler()}>
            Log Out
          </Link>
      </div>
    )
  }
};

const mapDispatchToProps = dispatch =>{
  return {
    onLogout: () => dispatch(actions.logout()) 
  }
}

export default connect(null, mapDispatchToProps)(Sidebar);