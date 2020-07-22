import React, { Component } from 'react';
import { firebaseDB } from '../../../firebase';
import { firebaseLooper } from '../../../shared/utils';

import Spinner from '../../../UI/Spinner/Spinner';

import classes from './table.module.css';

class LeagueTable extends Component {
	state = {
		isLoading: true,
    positions:[]
  }

  componentDidMount(){
    this.fetchPositions();  
  }

  fetchPositions = async () => {
    const snapshot = await firebaseDB.ref('positions').once('value');
    const positions = firebaseLooper(snapshot);
    this.setState({
			positions: positions,
			isLoading: false
    })
	}
	
	render() {
    let rows = this.state.positions.map((position, i) => (
      <tr className={classes.rows} key={position.id}>
        <td>
          {i}
        </td>
        <td>
          {position.team}
        </td>
        <td>
          {position.w}
        </td>
        <td>
          {position.d}
        </td>
        <td>
          {position.l}
        </td>
        <td>
          {position.pts}
        </td>
      </tr>
		));
		
		let table = (
			<table className={classes.table}>
				<thead className={classes.head}>
					<tr>
						<th>Pos</th>
						<th>Team</th>
						<th>W</th>
						<th>L</th>
						<th>D</th>
						<th>Pts</th>
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
			<div className={classes.main}>
				{table}
			</div>
		)
    }
};


export default LeagueTable;