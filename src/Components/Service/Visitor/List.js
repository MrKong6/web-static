import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import DialogUser from '../../Dialog/DialogUser';
import Commands from "../../Commands/Commands";

import mainSize from "../../../utils/mainSize";
import {formatWithTime} from '../../../utils/fmtDate';
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import {AJAX_PATH} from "../../../utils/ajax";
import {Message} from 'element-react';
import './Visitor.css'

import ajaxFile from "../../../utils/ajaxFile";
import LeadsList from "../../Dic/LeadsList";

class List extends React.Component {

    constructor(props) {
        super(props);
        let storage = window.sessionStorage;
        window.sessionStorage.setItem("opporCurrentPage",1);
        this.commands = this.props.commands.filter(command => (command.name === 'Add' || command.name === 'Import'|| command.name === 'Transfer'|| command.name === 'Export'));
        this.title = fmtTitle(this.props.location.pathname);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.addAction = this.addAction.bind(this);
        this.exportAction = this.exportAction.bind(this);
        this.assignAction = this.assignAction.bind(this);
        this.assignAccept = this.assignAccept.bind(this);
        this.selectRow = this.selectRow.bind(this);
        this.state = {
            group: this.props.changedCrmGroup,
            userId:this.props.profile.cId,
            list: [],
            ids: [],
            typeId: 4,
            fromWay:1,
            isIn: ((this.props.history.location.pathname.indexOf('/home/service/visitorin') == -1)  ? 0 : 1),
        };
        this.goToDetails = this.goToDetails.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/service/visitor/list.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,pageNum:this.state.currentPage,pageSize:this.state.pageSize,typeId:4,fromWay:1,
                    isIn:((this.props.history.location.pathname.indexOf('/home/service/visitorin') == -1)  ? 0 : 1),
                    stageId:this.state.chooseStageName,statusId:this.state.chooseStatusName,orderByCreateOn:2,
                    createStart:this.state.createOnStart,createEnd:this.state.createOnEnd});
                let status = await ajax('/mkt/leads/status/list.do', {typeId: 4});
                let stage = await ajax('/mkt/leads/stage/list.do', {typeId: 4});
                const ids = list.data.map((leads) => (leads.id));
                list.data.map(item => {
                    if(item.createTime != null){
                        item.createTime = formatWithTime(item.createTime);
                    }

                    if(!item.parent){
                        item.parent = {"cellphone" : "","name" : ""};
                    }
                    if(!item.student){
                        item.student = {"cellphone" : "","name" : ""};
                    }
                });
                this.setState({list: list.data, ids: ids,totalPage: list.totalPage,totalCount: list.count,stageName:stage,statusName:status});
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
                    let list = await ajax('/service/visitor/list.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                        typeId:4,fromWay:1,pageNum:this.state.currentPage,pageSize:this.state.pageSize,
                        isIn:((this.props.history.location.pathname.indexOf('/home/service/visitorin') == -1)  ? 0 : 1)});
                    const ids = list.data.map((leads) => (leads.id));

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
        // debugger
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

    /**
     * 导出
     */
    exportAction() {
        ajaxFile('/mkt/leads/export.do',{orgId: this.state.group.id,typeId:4,fromWay:1})
    };

    /**
     * 转移给
     */
    assignAction() {
        const defaults = {
            groupId: this.state.group.id,
            groupName: this.state.group.name,
            userId: null,
            userName: null,
            type: 1
        };
        this.userContainer = document.createElement('div');
        ReactDOM.render(
            <DialogUser
                accept={this.assignAccept}
                title="批量转移到"
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
    };

    /**
     * 转移给确认
     * @param selected
     */
    assignAccept(selected) {
        const request = async () => {
            try {
                const param={ids: this.state.chooseRows, assigneeId: selected.user.id, type: (selected.typeId ? selected.typeId : 1)};
                await ajax('/service/visitor/batchAssign.do', {"assignVo":JSON.stringify(param)});
                Message({
                    message: "已转移",
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
    onChange(key, value) {
        this.setState({
            cellphone: value
        });
        window.sessionStorage.setItem("cellphone",value);
    }

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

    render() {
        const uploadConfig = {
            className:"upload-demo",
            showFileList:false,
            withCredentials:true,
            data:{'type':4,'orgId':this.state.group.id,"userId":this.state.userId},
            action: AJAX_PATH + '/mkt/leads/import.do',
            onSuccess: (file, fileList) => this.successMsg("导入成功"),
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
                    </h5>

                    <div id="main" className="main p-3">
                    <div className=" ">
                    <Commands
                        commands={this.commands}
                        addAction={this.addAction}
                        assignAction={this.assignAction}
                        assignParams={this.state.chooseRows}
                        importAction={uploadConfig}
                        exportAction={this.exportAction}
                        // importAction={uploadConfig}
                    />
                   
               
              
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
                </div>
            </div>
        )
    }
}

export default List;