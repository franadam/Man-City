import React from 'react';
import {Link} from 'react-router-dom'
import {Logo} from '../../UI/Logo/logo';
import classes from './Navbar.module.css';


export default function Navbar(props) {
  return (
    <div className={classes.main}>
      <div className={classes.logo_container}>
        <Logo link='/'/>
      </div>
      <nav className={classes.navbar} >
        <ul>
          <Link className={classes.link} to='/the_team' >The Team</Link>
          <Link className={classes.link} to='/the_matches' >Matches</Link>
          {!props.isAuthenticated
            ? <Link className={`${classes.link} ${classes.login}`} to='/sign_in' >Sign In</Link>
            : <React.Fragment>
                <Link className={classes.link} to='/dashboard'>Dashboard</Link>
                <Link className={`${classes.link} ${classes.logout}`} to='/log_out'>Log Out</Link>
            </React.Fragment>
          }
        </ul>
      </nav>
    </div>
  )
}
