import React, { Component } from 'react'
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';

import AdminLayout from '../../../hoc/admin/admin_layout';
import Spinner from '../../../UI/Spinner/Spinner'
import {firebaseMatches} from '../../../firebase';
import {firebaseLooper, reverseArray} from '../../../shared/utils';

import classes from './matches.module.css';

class Matches extends Component {
  state = {
    isLoading: true,
    matches: []
  }

  componentDidMount() {
    console.log('token: ', this.props.token);
    this.fetchMatches();
  }
  
  fetchMatches =  async() => {
    try {
      const snapshot = await firebaseMatches.once('value');
      const matches = firebaseLooper(snapshot);
      console.log(matches)
      this.setState({
        isLoading: false,
        matches: reverseArray(matches)})
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    let rows = this.state.matches.map(m => (
      <tr className={classes.rows} key={m.id}>
        <td>{m.date}</td>
        <td><Link className={classes.link} to={`/admin_matches/edit_match/${m.id}`}>{m.local} - {m.away}</Link></td>
        <td>{m.resultLocal} - {m.resultAway}</td>
        <td style={{color:m.final === 'No' ? 'green' : 'red'}}>{m.final === 'No' ? 'Not played yet' : 'Final'}</td>
      </tr>
      ))
    let table = (
      <table className={classes.table}>
        <thead className={classes.head}>
            <tr>
                <th>Date</th>
                <th>Matches</th>
                <th>Result</th>
                <th>Final</th>
            </tr>
        </thead>
        <tbody className={classes.body}>
          {rows}
        </tbody>
      </table>
    );

    if (this.state.isLoading) {
      table = <Spinner />
    };

    return (
      <AdminLayout>
        {table}
      </AdminLayout>
    )
  }
}

const mapStateToProps = state => {
  console.log('Matches', state)
  return {
      loading: state.auth.loading,
      token: state.token
  };
};

export default connect(mapStateToProps)(Matches);