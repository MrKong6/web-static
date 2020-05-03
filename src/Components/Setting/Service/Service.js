import React from 'react'
import {Route, Switch} from 'react-router-dom'

import SettingService from './SettingService'
import View from './View';
import Editor from "./Editor";
import Create from "./Create";
import TeacherView from "./TeacherView";
import TeacherEdit from "./TeacherEdit";
import RoomView from "./RoomView";
import RoomEditor from "./RoomEditor";
import RoomCreate from "./RoomCreate";
import TeacherCreate from "./TeacherCreate";
//教务管理
const Account = ({commands, location, match, profile, changedCrmGroup}) => {
    const groupCommands = commands.find(item => (item.rule.test(location.pathname) === true));
    return (
        <Switch>
            <Route path={`${match.url}/teacherView/add`} render={(props) => (
                <TeacherCreate key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                               changedCrmGroup={changedCrmGroup}/>
            )}/>
            <Route path={`${match.url}/roomView/add`} render={(props) => (
                <RoomCreate key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                            changedCrmGroup={changedCrmGroup}/>
            )}/>
            <Route path={`${match.url}/roomView/:contractId/edit`} render={(props) => (
                <RoomEditor key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                          changedCrmGroup={changedCrmGroup}/>
            )}/>
            <Route path={`${match.url}/roomView/:contractId`} render={(props) => (
                <RoomView key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                             changedCrmGroup={changedCrmGroup}/>
            )}/>
            <Route path={`${match.url}/teacherView/:contractId/edit`} render={(props) => (
                <TeacherEdit key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
                             changedCrmGroup={changedCrmGroup}/>
            )}/>
            <Route path={`${match.url}/teacherView/:contractId`} render={(props) => (
                <TeacherView key={props.match.params.contractId} {...props} profile={profile} commands={groupCommands.commands}
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
                <SettingService {...props} profile={profile} commands={groupCommands.commands} changedCrmGroup={changedCrmGroup}/>
            )}/>
        </Switch>
    )
};

export default Account;