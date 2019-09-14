import React from 'react'
import {Route, Switch} from 'react-router-dom'

import Create from './Create'
import List from './List'
import View from './View';
import StudentView from './StudentView';
import StudentAssignView from './StudentAssignView';
import Editor from "./Editor";

const Account = ({commands, location, match, profile, changedCrmGroup}) => {
    const groupCommands = commands.find(item => (item.rule.test(location.pathname) === true));

    return (
        <Switch>
            <Route path={`${match.url}/student/assign/:contractId`} render={(props) => (
                <StudentAssignView key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                                   changedCrmGroup={changedCrmGroup}/>
            )}/>
            <Route path={`${match.url}/student/:contractId`} render={(props) => (
                <StudentView key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                             changedCrmGroup={changedCrmGroup}/>
            )}/>
            <Route path={`${match.url}/create`} render={(props) => (
                <Create {...props} profile={profile} changedCrmGroup={changedCrmGroup}/>
            )}/>
            <Route path={`${match.url}/:contractId/edit`} render={(props) => (
                <Editor {...props} profile={profile} changedCrmGroup={changedCrmGroup}/>
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