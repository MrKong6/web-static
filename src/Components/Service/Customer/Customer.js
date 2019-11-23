import React from 'react'
import {Route, Switch} from 'react-router-dom'

import List from './List'
import StudentView from './StudentView';
import ParentView from './ParentView';
import ContractView from './ContractView';
import StudentEditor from './StudentEditor';
import ParentEditor from './ParentEditor';
import AccountView from "./AccountView";
import ContractCreate from "../Contract/Create"

const Customer = ({commands, location, match, profile, changedCrmGroup}) => {
    let groupCommands = commands.filter(item => (item.id == '3-2'));
    groupCommands = groupCommands[0];
    return (
        <Switch>
            <Route path={`/home/service/contract/create`} render={(props) => (
                <ContractCreate {...props} profile={profile} changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/student/:studentId/edit`} render={(props) => (
                <StudentEditor {...props} profile={profile} changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/student/:studentId`} render={(props) => (
                <StudentView key={props.match.params.studentId} {...props} profile={profile}
                             commands={groupCommands.commands}
                             changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/parent/:studentId/edit`} render={(props) => (
                <ParentEditor {...props} profile={profile} changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/parent/:studentId`} render={(props) => (
                <ParentView key={props.match.params.studentId} {...props} profile={profile}
                            commands={groupCommands.commands}
                            changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/contract/:studentId`} render={(props) => (
                <ContractView key={props.match.params.studentId} {...props} profile={profile}
                              commands={groupCommands.commands}
                              changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/account/:studentId`} render={(props) => (
                <AccountView key={props.match.params.studentId} {...props} profile={profile}
                             commands={groupCommands.commands}
                             changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}`} render={(props) => (
                <List {...props} profile={profile} commands={groupCommands.commands} changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
        </Switch>
    )
};

export default Customer;