import React from 'react'
import classes from './admin_layout.module.css'
import Sidebar from '../../containers/Admin/Sidebar/Sidebar'

export default function admin_layout(props) {
  return (
      <div className={classes.main}>
        <Sidebar />
        <div className={classes.content}>
          {props.children}
        </div>
      </div>
  )
}
