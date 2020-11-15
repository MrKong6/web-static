import React from 'react'
import ReactDOM from "react-dom";
import DialogTips from "../../Dialog/DialogTips";
import DialogUser from '../../Dialog/DialogUser';

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import {Message} from "element-react";
import LeadsView from "../../Dic/LeadsView";


class View extends React.Component {

    constructor(props) {
        super(props);

        this.commands = this.props.commands.filter(command => (command.name !== 'Add' && command.name !== 'Import' && command.name !== 'Export' && command.name !== 'Mod'));
        this.ids = this.props.location.state.ids;
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            redirectToConvert: false,
            isAnimating: false,
            id: this.props.match.params.leadsId,
            data: null,
            typeId: 4, //访客类型
            fromWay: 1,//访客
        };
        
        this.convertAction = this.convertAction.bind(this);
        this.convertAccept = this.convertAccept.bind(this);
        this.assignAction = this.assignAction.bind(this);
        this.assignAccept = this.assignAccept.bind(this);
        this.back = this.back.bind(this);
    }

    componentDidMount() {
        mainSize();
    }

    convertAction() {
        const defaults = {
            groupId: this.state.data.organizationId,
            groupName: this.state.data.organizationName,
            userId: this.state.data.executiveId,
            userName: this.state.data.executiveName,
            type: 1
        };
        this.userContainer = document.createElement('div');
        ReactDOM.render(
            <DialogUser
                accept={this.convertAccept}
                title={this.state.data.student.name}
                container={this.userContainer}
                defaults={defaults}
                replace={this.props.history.replace}
                from={this.props.location}
                path="/mkt/leads/listAssignableUsers.do"
                typeName="1"
                ref={(dom) => {
                    this.user = dom
                }}
            />,
            document.body.appendChild(this.userContainer)
        );

        this.user.dialog.modal('show');
    }

    convertAccept(selected) {
        this.setState({isAnimating: true});
        const request = async () => {
            try {
                await ajax('/service/visitor/convert.do', {id: this.state.id, assigneeId: selected.user.id});
                this.setState({redirectToConvert: true});
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    this.createDialogTips(`${err.errCode}: ${err.errText}`);
                }
            } finally {
                this.setState({isAnimating: false});
            }
        };

        request()
    }

    assignAction() {
        const defaults = {
            groupId: this.state.data.organizationId,
            groupName: this.state.data.organizationName,
            userId: this.state.data.executiveId,
            userName: this.state.data.executiveName,
            type: 1
        };
        this.userContainer = document.createElement('div');
        ReactDOM.render(
            <DialogUser
                accept={this.assignAccept}
                title={this.state.data.student.name}
                container={this.userContainer}
                defaults={defaults}
                replace={this.props.history.replace}
                from={this.props.location}
                typeName="4"
                path="/mkt/leads/listAssignableUsers.do"
                ref={(dom) => {
                    this.user = dom
                }}
            />,
            document.body.appendChild(this.userContainer)
        );

        this.user.dialog.modal('show');

    }

    assignAccept(selected) {
        this.setState({isAnimating: true});
        const request = async () => {
            try {
                await ajax('/service/visitor/assign.do', {id: this.state.id, assigneeId: selected.user.id, type: (selected.typeId ? selected.typeId : 1)});
                let data = Object.assign({}, this.state.data);

                data.organizationId = selected.group.id;
                data.organizationName = selected.group.name;
                data.executiveId = selected.user.id;
                data.executiveName = selected.user.name;
                this.setState({data})
                Message({
                    message: "已分配",
                    type: 'info'
                });
                this.props.history.push(`/home/service/visitor`);
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    this.createDialogTips(`${err.errCode}: ${err.errText}`);
                }
            } finally {
                this.setState({isAnimating: false});
            }
        };

        request()
    }

    back(){
        let link = "/home/service/visitor";
        if (this.props.location.pathname.indexOf("visitorin") != -1) {
            link = "/home/service/visitorpublic";
        }
        this.props.history.push(link);
    }

    render() {

        let link = "/home/service/visitor";
        if(this.props.location.pathname.indexOf("visitorin") != -1){
            link = "/home/service/visitorin";
        }


        return (
            <LeadsView
                opporId={this.props.match.params.leadsId}
                pathName={this.props.location.pathname}
                commands={this.commands}
                group={this.state.group}
                accept={this.goToDetails}
                fromWay={this.state.fromWay}
                typeId={this.state.typeId}
                profile={this.props.profile}
                SignAction={this.SignAction}
                back={this.back}
                location={this.props.location}
                link={link}
            />
        )
    }
}

export default View;