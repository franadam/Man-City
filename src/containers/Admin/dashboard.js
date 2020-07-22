import React from 'react'
import {Switch, Route, Redirect} from 'react-router';
import AdminLayout from '../../hoc/admin/admin_layout';

import Matches from './Matches/Matches';
import classes from './dashboard.module.css';

export default function Dashboard() {
  return (
    <AdminLayout>
      <div className={classes.main}>
        This is your Dashboard !
      </div>
    </AdminLayout>
  )
}
