import React from 'react'
import {Route, Switch} from 'react-router-dom'

import List from './List'

const Import = ({commands, location, match, profile}) => {
  const cmd = commands.find(item => (item.rule.test(location.pathname) === true));

  return (
    <Switch>
      <Route path={`${match.url}`} render={(props) => (
        <List {...props} profile={profile} commands={cmd.commands}/>
      )}/>
    </Switch>
  )
};

export default Import;