import React from 'react'
import {Route, Switch} from 'react-router-dom'

import Create from './Create'
import List from './List'
import View from './View';
import StudentView from './StudentView';
import StudentAssignView from './StudentAssignView';
import Editor from "./Editor";
import StudentInfoView from './StudentInfoView';
import ParentEditor from "./ParentEditor";
import ParentView from "./ParentView";
import StudentEditor from "./StudentEditor";
import TeacherView from "./TeacherView";
import AssignClassView from "./AssignClassView";
import ClockedView from "./ClockedView";
import StudentSituation from "./StudentSituation";
import ContractView from "../../Service/Customer/ContractView"
import StudentSituationChangeClassAdd from "../../Academy/Class/StudentSituationChangeClassAdd";
import StudentSituationPauseClassAdd from "../../Academy/Class/StudentSituationPauseClassAdd";
import StudentSituationBackMoneyAdd from "../../Academy/Class/StudentSituationBackMoneyAdd";
import CheckOn from "./CheckOn";

const Account = ({commands, location, match, profile, changedCrmGroup}) => {
    let groupCommands = commands.filter(item => (item.id == '6-1'));
    groupCommands = groupCommands[0];
    return (
        <Switch>
            <Route path={`${match.url}/situation/changeClassAdd/:contractId`} render={(props) => (
                <StudentSituationChangeClassAdd key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                                                changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource} />
            )}/>
            <Route path={`${match.url}/situation/pauseClassAdd/:contractId`} render={(props) => (
                <StudentSituationPauseClassAdd key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                                               changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource} />
            )}/>
            <Route path={`${match.url}/situation/backMoneyAdd/:contractId`} render={(props) => (
                <StudentSituationBackMoneyAdd key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                                              changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource} />
            )}/>
            <Route path={`${match.url}/situation/:contractId`} render={(props) => (
                <StudentSituation key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                                  changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource} />
            )}/>
            <Route path={`${match.url}/clocked/:contractId/checkon`} render={(props) => (
                <CheckOn key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                             changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/clocked/:contractId`} render={(props) => (
                <ClockedView key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                             changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/student/assign/:contractId`} render={(props) => (
                <StudentAssignView key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                                   changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/student/customer/:studentId`} render={(props) => (
                <StudentInfoView key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                                   changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/student/customer/:studentId/edit`} render={(props) => (
                <StudentEditor {...props} profile={profile} changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/teacher/:contractId`} render={(props) => (
                <TeacherView key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                             changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/assignClass/:contractId`} render={(props) => (
                <AssignClassView key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                                 changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/parent/:studentId/edit`} render={(props) => (
                <ParentEditor {...props} profile={profile} changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/parent/:studentId`} render={(props) => (
                <ParentView key={props.match.params.studentId} {...props} profile={profile} commands={groupCommands.commands}
                            changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/contract/:studentId`} render={(props) => (
                <ContractView {...props} profile={profile} changedCrmGroup={changedCrmGroup} commands={[]}
                              sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/student/:contractId`} render={(props) => (
                <StudentView key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                             changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/create`} render={(props) => (
                <Create {...props} profile={profile} changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/:contractId/edit`} render={(props) => (
                <Editor {...props} profile={profile} changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}/:contractId`} render={(props) => (
                <View key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                      changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
            <Route path={`${match.url}`} render={(props) => (
                <List {...props} profile={profile} commands={groupCommands.commands} changedCrmGroup={changedCrmGroup} sonView={groupCommands.sonResource}/>
            )}/>
        </Switch>
    )
};

export default Account;