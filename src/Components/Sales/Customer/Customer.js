import React from 'react'
import {Route, Switch} from 'react-router-dom'

import List from './List'
import StudentView from './StudentView';
import ParentView from './ParentView';
import ContractView from './ContractView';
import StudentEditor from './StudentEditor';
import ParentEditor from './ParentEditor';
import StudentSituationChangeClassAdd from "../../Service/Customer/StudentSituationChangeClassAdd";
import StudentSituationPauseClassAdd from "../../Service/Customer/StudentSituationPauseClassAdd";
import StudentSituationBackMoneyAdd from "../../Service/Customer/StudentSituationBackMoneyAdd";
import StudentSituation from "./StudentSituation";

const Customer = ({commands, location, match, profile, changedCrmGroup}) => {
    let groupCommands = commands.filter(item => (item.id == '2-3'));
    groupCommands = groupCommands[0];
    return (
        <Switch>
            <Route path={`${match.url}/situation/changeClassAdd/:contractId`} render={(props) => (
                <StudentSituationChangeClassAdd key={props.match.params.contractId} {...props} profile={profile}
                                                commands={groupCommands.commands}
                                                changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/situation/pauseClassAdd/:contractId`} render={(props) => (
                <StudentSituationPauseClassAdd key={props.match.params.contractId} {...props} profile={profile}
                                               commands={groupCommands.commands}
                                               changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/situation/backMoneyAdd/:contractId`} render={(props) => (
                <StudentSituationBackMoneyAdd key={props.match.params.contractId} {...props} profile={profile}
                                              commands={groupCommands.commands}
                                              changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/situation/:contractId`} render={(props) => (
                <StudentSituation key={props.match.params.contractId} {...props} profile={profile}
                                  commands={groupCommands.commands}
                                  changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/student/:studentId/edit`} render={(props) => (
                <StudentEditor {...props} profile={profile} changedCrmGroup={changedCrmGroup}
                               sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/student/:studentId`} render={(props) => (
                <StudentView key={props.match.params.studentId} {...props} profile={profile}
                             commands={groupCommands.commands}
                             changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/parent/:studentId/edit`} render={(props) => (
                <ParentEditor {...props} profile={profile} changedCrmGroup={changedCrmGroup}
                              sonView={groupCommands.sonResource}/>
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
            <Route path={`${match.url}`} render={(props) => (
                <List {...props} profile={profile} commands={groupCommands.commands} changedCrmGroup={changedCrmGroup}
                      sonView={groupCommands.sonResource}/>
            )}/>
        </Switch>
    )
};

export default Customer;