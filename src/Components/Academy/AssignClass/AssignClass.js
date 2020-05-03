import React from 'react'
import {Route, Switch} from 'react-router-dom'

import List from './List'
import View from './View';
import Editor from "./Editor";
import Create from "./Create";

const Account = ({commands, location, match, profile, changedCrmGroup}) => {
  const groupCommands = commands.find(item => (item.rule.test(location.pathname) === true));

  return (
    <Switch>
      <Route path={`${match.url}/:contractId/edit`} render={(props) => (
        <Editor {...props} profile={profile} changedCrmGroup={changedCrmGroup}/>
      )}/>
    <Route path={`${match.url}/create`} render={(props) => (
        <Create {...props} profile={profile} changedCrmGroup={changedCrmGroup}/>
    )}/>
      <Route path={`${match.url}/:contractId`} render={(props) => (
        <View key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
              changedCrmGroup={changedCrmGroup}/>
      )}/>
      <Route path={`${match.url}`} render={(props) => (
        <List {...props} profile={profile} commands={groupCommands.commands} changedCrmGroup={changedCrmGroup}/>
      )}/>
    </Switch>
  )
};

export default Account;