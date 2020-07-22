import React, { Component } from 'react';

import { firebaseMatches } from '../../firebase';
import { firebaseLooper, reverseArray } from '../../shared/utils';

import Spinner from '../../UI/Spinner/Spinner';
import LeagueTable from './Table/Table';
import MatchesList from './List/List';
import Filter from './Filter/Filter'

import classes from './match.module.css';

class Match extends Component {
  state= {
    isLoading: true,
    matches: [],
    filteredMatches: [],
    playedFilter: 'All',
    resultFilter: 'All'

  }

  componentDidMount() {
    this.fetchMatches();
  }

  fetchMatches = async () => {
    try {
      const snapshot = await firebaseMatches.once('value');
      const matches = firebaseLooper(snapshot);
      console.log(matches);
      this.setState({
        isLoading: false,
        matches: reverseArray(matches),
        filteredMatches: reverseArray(matches)
      });
    } catch (error) {
      console.log('fetch Error', error);
    }
  }

  showPlayed = played => {
    const filteredMatches = this.state.matches.filter(match => {
      return match.final === played;
    });

    this.setState({
      filteredMatches: played === 'All' ? this.state.matches : filteredMatches,
      playedFilter: played,
      resultFilter: 'All'
    });
  }

  showResult = result => {
    const filteredMatches = this.state.matches.filter(match => {
      return match.result === result;
    });

    this.setState({
      filteredMatches: result === 'All' ? this.state.matches : filteredMatches,
      resultFilter: result,
      playedFilter: 'All'
    });
  }

  render() {
    const { filteredMatches, playedFilter, resultFilter } = this.state
    return (
      <div className={classes.main}>
        <Filter 
          showPlayed={this.showPlayed}
          criteria={{played: playedFilter, result: resultFilter}}
          showResult={this.showResult}
        />
        <LeagueTable />
        <MatchesList matches={filteredMatches} />
      </div>
    )
  }
};

export default Match;