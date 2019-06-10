import React from 'react'
import {Route, Switch} from 'react-router-dom'

import List from './List'
import StudentView from './StudentView';
import ParentView from './ParentView';
import ContractView from './ContractView';
import StudentEditor from './StudentEditor';
import ParentEditor from './ParentEditor';

const Customer = ({commands, location, match, profile, changedCrmGroup}) => {
  const groupCommands = commands.find(item => (item.rule.test(location.pathname) === true));

  return (
    <Switch>
      <Route path={`${match.url}/student/:studentId/edit`} render={(props) => (
        <StudentEditor {...props} profile={profile} changedCrmGroup={changedCrmGroup}/>
      )}/>
      <Route path={`${match.url}/student/:studentId`} render={(props) => (
        <StudentView key={props.match.params.studentId} {...props} profile={profile} commands={groupCommands.commands}
                     changedCrmGroup={changedCrmGroup}/>
      )}/>
      <Route path={`${match.url}/parent/:studentId/edit`} render={(props) => (
        <ParentEditor {...props} profile={profile} changedCrmGroup={changedCrmGroup}/>
      )}/>
      <Route path={`${match.url}/parent/:studentId`} render={(props) => (
        <ParentView key={props.match.params.studentId} {...props} profile={profile} commands={groupCommands.commands}
                    changedCrmGroup={changedCrmGroup}/>
      )}/>
      <Route path={`${match.url}/contract/:studentId`} render={(props) => (
        <ContractView key={props.match.params.studentId} {...props} profile={profile} commands={groupCommands.commands}
                      changedCrmGroup={changedCrmGroup}/>
      )}/>
      <Route path={`${match.url}`} render={(props) => (
        <List {...props} profile={profile} commands={groupCommands.commands} changedCrmGroup={changedCrmGroup}/>
      )}/>
    </Switch>
  )
};

export default Customer;