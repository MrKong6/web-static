import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'
import {$} from "../../../vendor";

import DialogTips from "../../Dialog/DialogTips";
import Commands from "../../Commands/Commands";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtDate, {formatWithTime} from '../../../utils/fmtDate';
import fmtTitle from '../../../utils/fmtTitle';
import ajax, {AJAX_PATH} from "../../../utils/ajax";
import {Button, Table, Pagination, Upload, Input, Tooltip, Select, Message, Checkbox} from 'element-react';
import '../../Mkt/Leads/Leads.css'
import ajaxFile from "../../../utils/ajaxFile";
import DialogUser from "../../Dialog/DialogUser";
import {changeArrayItemToString} from "../../../utils/objectToArray";
import LeadsList from "../../Dic/LeadsList";

class List extends React.Component {
    constructor(props) {
        super(props);
        let storage = window.sessionStorage;
        window.sessionStorage.setItem("opporCurrentPage",1);
        let link = "/home/sales/oppor";
        if (this.props.location.pathname.indexOf("opporpublic") != -1) {
            this.commands = this.props.commands.filter(command => (command.name === 'Add' ||
                command.name === 'Import' || command.name === 'Export' || command.name == 'Assign'));
        } else {
            this.commands = this.props.commands.filter(command => (command.name === 'Add' ||
                command.name === 'Import' || command.name === 'Export'));
        }

        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            chooseRows: [],
            isAnimating: true,
            redirectToReferrer: false,
            typeId: 2,
            fromWay:3,
            isIn: ((this.props.history.location.pathname.indexOf('/home/sales/opporpublic') == -1)  ? 1 : 0),
        };
        this.addAction = this.addAction.bind(this);
        this.assignAction = this.assignAction.bind(this);
        this.assignAccept = this.assignAccept.bind(this);
        this.exportAction = this.exportAction.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.selectRow = this.selectRow.bind(this);
    }

    componentDidMount() {
        mainSize()
    }
    componentWillReceiveProps(nextProps) {
        if (this.props.changedCrmGroup.id !== nextProps.changedCrmGroup.id) {
            this.setState({
                group: nextProps.changedCrmGroup
            });
        }
    }

    addAction() {
        this.props.history.push(`${this.props.match.url}/create`, {ids: this.state.ids});
    }
    /**
     * 转移给
     */
    assignAction() {
        const defaults = {
            groupId: this.state.group.id,
            groupName: this.state.group.name,
            userId: this.props.profile.cId,
            userName: this.props.profile.cRealName,
        };
        this.userContainer = document.createElement('div');
        ReactDOM.render(
            <DialogUser
                accept={this.assignAccept}
                title={this.title.name}
                container={this.userContainer}
                defaults={defaults}
                replace={this.props.history.replace}
                from={this.props.location}
                path="/sales/oppor/listAssignableUsers.do"
                ref={(dom) => {
                    this.user = dom
                }}
            />,
            document.body.appendChild(this.userContainer)
        );

        this.user.dialog.modal('show');
    };
    assignAccept(selected) {
        this.setState({isAnimating: true});
        const request = async () => {
            try {
                const param={ids: this.state.chooseRows, assigneeId: selected.user.id, type: this.state.typeId};
                await ajax('/sales/oppor/batchAssign.do', {"assignVo":JSON.stringify(param)});
                let data = Object.assign({}, this.state.data);
                Message({
                    message: "已重新分配",
                    type: 'info'
                });
                // this.loadData();
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
    exportAction() {
        ajaxFile('/mkt/leads/export.do',{orgId: this.state.group.id,typeId: this.state.typeId,fromWay: this.state.fromWay,isIn:((this.props.location.pathname.indexOf('/home/sales/opporpublic') == -1)  ? 1 : 0)})
    };
    successMsg(msg) {
        Message({
            message: msg,
            type: 'info'
        });
    }
    errorMsg(msg) {
        Message({
            message: msg,
            type: 'error'
        });
    }
    importSuccess() {
        this.loadData();
        this.successMsg("导入成功")
    };
    /**
     * 列表选择
     * @param value
     */
    selectRow(value) {
        debugger
        var ids = [];
        if(value){
            value.map((leads) => (ids.push(leads.id)));
        }
        this.setState({
            chooseRows: ids
        });
    }
    goToDetails(data) {
        const url = `${this.props.match.url}/${data}`;

        this.props.history.push(url);
    }

    render() {
        if (this.state.redirectToReferrer) {
            return (
                <Redirect to={{
                    pathname: '/login',
                    state: {from: this.props.location}
                }}/>
            )
        }
        const uploadConfig = {
            className:"upload-demo",
            showFileList:false,
            withCredentials:true,
            data:{'type':2,'orgId':this.state.group.id},
            action: AJAX_PATH + '/mkt/leads/import.do',
            onSuccess: (file, fileList) => this.importSuccess(),
        };
        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>&nbsp;{this.title.text}

                    <Commands
                        commands={this.commands}
                        addAction={this.addAction}
                        exportAction={this.exportAction}
                        importAction={uploadConfig}
                        assignAction={this.assignAction}
                        assignParams={this.state.chooseRows}
                    />
                </h5>
                <LeadsList pathName={this.props.location.pathname}
                           commands={this.props.commands}
                           group={this.state.group}
                           accept={this.goToDetails}
                           fromWay={this.state.fromWay}
                           typeId={this.state.typeId}
                           selectRow={this.selectRow}
                           isIn={this.state.isIn}
                />
            </div>
        )
    }
}

export default List;