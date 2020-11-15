import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Commands from "../../Commands/Commands";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import {formatWithTime} from '../../../utils/fmtDate';
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import {AJAX_PATH} from "../../../utils/ajax";
import {Button, Table, Pagination, Message, Input, Tooltip, Select} from 'element-react';
import './Leads.css'

import ajaxFile from "../../../utils/ajaxFile";
import DialogUser from "../../Dialog/DialogUser";
import LeadsList from "../../Dic/LeadsList";

class List extends React.Component {

    constructor(props) {
        super(props);
        let storage = window.sessionStorage;
        if (this.props.location.pathname.indexOf("leadspublic") != -1) {
            this.commands = this.props.commands.filter(command => (command.name === 'Add' ||
                command.name === 'Import' || command.name === 'Export' || command.name == 'Assign'));
        }else{
            this.commands = this.props.commands.filter(command => (command.name === 'Add' ||
                command.name === 'Import' || command.name === 'Export'));
        }

        this.title = fmtTitle(this.props.location.pathname);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.addAction = this.addAction.bind(this);
        this.exportAction = this.exportAction.bind(this);
        this.addAction = this.addAction.bind(this);
        this.assignAction = this.assignAction.bind(this);
        this.assignAccept = this.assignAccept.bind(this);
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            typeId: 1,
            fromWay:2,
        };
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/mkt/leads/list.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                    pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:2,
                    isIn:((this.props.history.location.pathname.indexOf('/home/mkt/leadspublic') == -1)  ? 1 : 0),
                    stageId:this.state.chooseStageNameLeads,statusId:this.state.chooseStatusNameLeads,
                    chooseAdvisorName:this.state.chooseAdvisorName});
                let status = await ajax('/mkt/leads/status/list.do', {typeId: 1});
                let stage = await ajax('/mkt/leads/stage/list.do', {typeId: 1});
                let advisorList = await ajax('/user/listUserByRole.do',{orgId:this.state.group.id,type:1});
                if(this.props.history.location.pathname.indexOf('/home/mkt/leadspublic') == -1){
                    //线索私有池
                    status = status.filter(sta => !(sta.id == 2 || sta.id == 3));
                }
                const ids = list.data.map((leads) => (leads.id));
                list.data.map(item => {
                    if(item.createTime != null){
                        item.createTime = formatWithTime(item.createTime);
                    }
                    if(item.transTime != null){
                        item.transTime = formatWithTime(item.transTime);
                    }
                    if(!item.parent){
                        item.parent = {"cellphone" : "","name" : ""};
                    }
                });
                this.setState({list: list.data, ids: ids,totalPage: list.totalPage,totalCount: list.count,stageName:stage,statusName:status,advisorList:advisorList});
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

        request();
        mainSize()
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.changedCrmGroup.id !== nextProps.changedCrmGroup.id) {
            this.setState({isAnimating: true});

            const request = async () => {
                try {
                    let list = await ajax('/mkt/leads/list.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,fromWay:2,
                        pageNum:this.state.currentPage,pageSize:this.state.pageSize,isIn:((this.props.history.location.pathname.indexOf('/home/mkt/leadspublic') == -1)  ? 1 : 0)});
                    const ids = list.data.map((leads) => (leads.id));
                    list.data.map(item => {
                        if(!item.parent){
                            item.parent = {"cellphone" : "","name" : ""};
                        }
                        if(item.transTime != null){
                            item.transTime = formatWithTime(item.transTime);
                        }
                    });
                    this.setState({
                        group: nextProps.changedCrmGroup,
                        list: list.data,
                        ids: ids,totalPage: list.totalPage,totalCount: list.count
                    });
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

            request();
        }
    }

    componentWillUnmount() {
        // 卸载异步操作设置状态
        clearTimeout(this.timeouter)
        this.setState = (state, callback) => {
            return
        }
        /*if (this.tipsContainer) {
            document.body.removeChild(this.tipsContainer);
        }*/
    }

    createDialogTips(text) {
        if (this.tips === undefined) {
            this.tipsContainer = document.createElement('div');

            ReactDOM.render(
                <DialogTips
                    accept={this.logout}
                    title="提示"
                    text={text}
                    ref={(dom) => {
                        this.tips = dom
                    }}
                />,
                document.body.appendChild(this.tipsContainer)
            );
        } else {
            this.tips.setText(text);
        }

        this.tips.dialog.modal('show');
    }

    goToDetails(data) {
        const url = `${this.props.match.url}/${data}`;
        this.props.history.push(url, {ids: this.state.ids});
    }

    addAction() {
        this.props.history.push(`${this.props.match.url}/create`, {ids: this.state.ids});
    };

    importAction(content) {

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
        this.componentDidMount();
        this.successMsg("导入成功")
    };
    exportAction() {
        ajaxFile('/mkt/leads/export.do',{orgId: this.state.group.id,fromWay:2,
            isIn:((this.props.history.location.pathname.indexOf('/home/mkt/leadspublic') == -1)  ? 1 : 0)})
    };

    /**
     * 列表选择
     * @param value
     */
    selectRow(value) {
        var ids = [];
        if(value){
            value.map((leads) => (ids.push(leads.id)));
        }
        this.setState({
            chooseRows: ids
        });
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
                typeName="1"
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
                const param={ids: this.state.chooseRows, assigneeId: selected.user.id, type: 1};
                await ajax('/mkt/leads/batchAssign.do', {"assignVo":JSON.stringify(param)});
                Message({
                    message: "已重新分配",
                    type: 'info'
                });
                this.componentDidMount();
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
    render() {

        const uploadConfig = {
            className:"upload-demo",
            showFileList:false,
            withCredentials:true,
            data:{'type':1,'orgId':this.state.group.id},
            action: AJAX_PATH + '/mkt/leads/import.do',
            onSuccess: (file, fileList) => this.importSuccess(),
        };
        if (this.state.redirectToReferrer) {
            return (
                <Redirect to={{
                    pathname: '/login',
                    state: {from: this.props.location}
                }}/>
            )
        }
        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>&nbsp;{this.title.text}

                    <Commands
                        commands={this.commands}
                        addAction={this.addAction}
                        importAction={uploadConfig}
                        exportAction={this.exportAction}
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
                />
            </div>
        )
    }
}

export default List;