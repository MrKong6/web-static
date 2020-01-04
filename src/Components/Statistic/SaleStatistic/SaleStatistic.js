import React from 'react'
import {Route, Switch} from 'react-router-dom'

import List from './List'
import SaleManageReport from './SaleManageReport'
import View from './View';
import Editor from "./Editor";

const SaleStatistic = ({commands, location, match, profile, changedCrmGroup}) => {
  const groupCommands = commands.find(item => (item.rule.test(location.pathname) === true));

  return (
    <Switch>
      <Route path={`${match.url}/create`} render={(props) => (
        <SaleManageReport {...props} profile={profile} changedCrmGroup={changedCrmGroup}/>
      )}/>
      <Route path={`${match.url}/:actId/edit`} render={(props) => (
        <Editor {...props} profile={profile} changedCrmGroup={changedCrmGroup}/>
      )}/>
      <Route path={`${match.url}/:actId`} render={(props) => (
        <View key={props.match.params.actId} {...props} profile={profile} commands={groupCommands.commands}
              changedCrmGroup={changedCrmGroup}/>
      )}/>
      <Route path={`${match.url}`} render={(props) => (
        <List {...props} profile={profile} commands={groupCommands.commands} changedCrmGroup={changedCrmGroup}/>
      )}/>
    </Switch>
  )
};

export default SaleStatistic;