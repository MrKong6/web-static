import React from 'react'
import {Route, Switch} from 'react-router-dom'

import Create from './Create'
import List from './List'
import View from './View';
import StudentView from './StudentView';
import StudentAssignView from './StudentAssignView';
import TeacherView from './TeacherView';
import Editor from "./Editor";
import AssignClassView from "./AssignClassView";
import ClockedView from "./ClockedView";

const Account = ({commands, location, match, profile, changedCrmGroup}) => {
    let groupCommands = commands.filter(item => (item.id == '5-4'));
    groupCommands = groupCommands[0];
    return (
        <Switch>
            <Route path={`${match.url}/clocked/:contractId`} render={(props) => (
                <ClockedView key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                             changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource} />
            )}/>
            <Route path={`${match.url}/student/assign/:contractId`} render={(props) => (
                <StudentAssignView key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                                   changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource} />
            )}/>
            <Route path={`${match.url}/student/:contractId`} render={(props) => (
                <StudentView key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                             changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource} />
            )}/>
            <Route path={`${match.url}/teacher/:contractId`} render={(props) => (
                <TeacherView key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                             changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource} />
            )}/>
            <Route path={`${match.url}/assignClass/:contractId`} render={(props) => (
                <AssignClassView key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                             changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource} />
            )}/>
            <Route path={`${match.url}/create`} render={(props) => (
                <Create {...props} profile={profile} changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource} />
            )}/>
            <Route path={`${match.url}/:contractId/edit`} render={(props) => (
                <Editor {...props} profile={profile} changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource} />
            )}/>
            <Route path={`${match.url}/:contractId`} render={(props) => (
                <View key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                      changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource} />
            )}/>
            <Route path={`${match.url}`} render={(props) => (
                <List {...props} profile={profile} commands={groupCommands.commands} changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource} />
            )}/>
        </Switch>
    )
};

export default Account;