import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AdminLayout from '../../../hoc/admin/admin_layout';
import Spinner from '../../../UI/Spinner/Spinner';

import {firebasePlayers} from '../../../firebase';
import {firebaseLooper, reverseArray} from '../../../shared/utils';

import classes from '../Matches/matches.module.css';

class Players extends Component {

  state = {
    isLoading: true,
    players: []
  }

  componentDidMount() {
    this.fetchPlayer();
  }

  fetchPlayer = async () => {
    try {
      const snapshot = await firebasePlayers.once('value');
      const players = firebaseLooper(snapshot);
      console.log(players)
      this.setState({
        isLoading: false,
        players: reverseArray(players)})
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    let rows = this.state.players.map(player => (
      <tr className={classes.rows} key={player.id}>
        <td>
          <Link className={classes.link} to={`/admin_players/edit_player/${player.id}`}>{player.name}</Link>
        </td>
        <td>
          <Link className={classes.link} to={`/admin_players/edit_player/${player.id}`}>{player.lastname}</Link>
        </td>
        <td>
          <Link className={classes.link} to={`/admin_players/edit_player/${player.id}`}>{player.number}</Link>
        </td>
        <td>
          <Link className={classes.link} to={`/admin_players/edit_player/${player.id}`}>{player.position}</Link>
        </td>
      </tr>
    ))
  let table = (
    <table className={classes.table}>
      <thead className={classes.head}>
          <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Number</th>
              <th>Position</th>
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
};

export default Players;