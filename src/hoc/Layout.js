import React, { Component } from 'react';
import {connect} from 'react-redux';
import Navbar from '../containers/Navbar/Navbar';
import Sidebar from '../containers/Admin/Sidebar/Sidebar';
import Footer from '../UI/Footer/Footer';
import classes from './layout.module.css';

class Layout extends Component {
  render() {
    return (
      <div className={classes.main}>
        <Navbar isAuthenticated={this.props.isAuthenticated}/>
        <main className={classes.content}>
          {this.props.children}
        </main>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  }
};

export default connect(mapStateToProps)(Layout);