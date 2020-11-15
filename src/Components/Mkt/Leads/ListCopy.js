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
        // this.goToDetails = this.goToDetails.bind(this);
        this.addAction = this.addAction.bind(this);
        this.exportAction = this.exportAction.bind(this);
        this.chooseStageSearch = this.chooseStageSearch.bind(this);
        this.chooseStatusSearch = this.chooseStatusSearch.bind(this);
        this.chooseAdvisorSearch = this.chooseAdvisorSearch.bind(this);
        this.addAction = this.addAction.bind(this);
        this.assignAction = this.assignAction.bind(this);
        this.assignAccept = this.assignAccept.bind(this);
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            chooseRows: [],
            isAnimating: true,
            redirectToReferrer: false,
            cellphone : storage.getItem("cellphone") ? storage.getItem("cellphone") : '',
            columns:[
                {
                    type: 'selection',
                    width: 20,
                },
                {
                    type: 'index',
                    fixed: 'left',
                },
                {
                    label: "学员姓名",
                    prop: "student.name",
                    width: 95,
                    fixed: 'left',
                    render: (row, column, data)=>{
                        return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this, row.id)}>{row.student.name}</Button></span>
                    }
                    /*render: function(data){
                        return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this,data.id)} lid={data.id}>{data.student.name}</Button></span>
                    }*/
                },
                {
                    label: "性别",
                    prop: "student.genderText",
                    width: 65
                },
                {
                    label: "年龄",
                    prop: "student.age",
                    width: 90,
                    sortable: true
                },
                {
                    label: "在读年级",
                    prop: "student.classGrade",
                    width: 95
                },
                {
                    label: "所在学校",
                    prop: "student.schoolName",
                    width: 120
                },
                {
                    label: "家长姓名",
                    prop: "parent.name",
                    width: 95,
                    render: (row, column, data)=>{
                        return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this, row.id)}>{(row.parent ? row.parent.name : "--")}</Button></span>
                    }
                },
                {
                    label: "与学员关系",
                    prop: "parent.relation",
                    width: 110
                },
                {
                    label: "电话号码",
                    prop: "parent.cellphone",
                    width: 95,
                    className:'tabletd',
                    render: function (data) {
                        return <Tooltip effect="dark" content={data.parent ? data.parent.cellphone : null}
                                        placement="top-start">
                                    {data.parent ? data.parent.cellphone : null}
                                </Tooltip>
                    }

                },
                {
                    label: "微信号",
                    prop: "parent.weichat",
                    width: 80
                },
                {
                    label: "家庭住址",
                    prop: "parent.address",
                    width: 95
                },
                {
                    label: "课程类别",
                    prop: "courseType",
                    width: 95
                },
                {
                    label: "课程阶段",
                    prop: "courseName",
                    width: 95,
                    className:'tabletd',
                    render: function (data) {

                        return <Tooltip effect="dark" content={data.courseName}
                                        placement="top-start">
                            {data.courseName}
                        </Tooltip>
                    }
                },
                {
                    label: "来源",
                    prop: "sourceName",
                    width: 100
                },
                {
                    label: "渠道",
                    prop: "channelName",
                    width: 120
                },
                {
                    label: "阶段",
                    prop: "stageName",
                    width: 150
                },
                {
                    label: "状态",
                    prop: "statusName",
                    width: 150
                },
                {
                    label: "所属组织",
                    prop: "organizationName",
                    width: 175,
                    showOverflowTooltip: true,
                },
                {
                    label: "所属用户",
                    prop: "executiveName",
                    width: 95
                },
                {
                    label: "创建人",
                    prop: "creatorName",
                    width: 100,
                    sortable: true
                },
                {
                    label: "创建时间",
                    prop: "createTime",
                    width: 150,
                    sortable: true
                },
                {
                    label: "转移时间",
                    prop: "transTime",
                    width: 150,
                    sortable: true
                },
            ],
            totalPage:0,
            currentPage:storage.getItem("leadCurrentPage") ? Number(storage.getItem("leadCurrentPage")) : 1,
            pageSize:storage.getItem("pageSize") ? Number(storage.getItem("pageSize")) : 10,
            totalCount:0,
            stageName:[],
            chooseStageNameLeads:storage.getItem("chooseStageNameLeads") ? storage.getItem("chooseStageNameLeads") : '',
            statusName:[],
            chooseStatusNameLeads:storage.getItem("chooseStatusNameLeads") ? Number(storage.getItem("chooseStatusNameLeads")) : '',
            advisorList:[],
            chooseAdvisorName:storage.getItem("chooseAdvisorName") ? storage.getItem("chooseAdvisorName") : '',

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

    onChange(key, value) {
        this.setState({
            cellphone: value
        });
        window.sessionStorage.setItem("cellphone",value);
    }

    pageChange(currentPage){
        console.log(currentPage);
        this.state.currentPage = currentPage;
        window.sessionStorage.setItem("leadCurrentPage",currentPage);
        // this.setState({currentPage:currentPage});
        this.componentDidMount();
    }

    sizeChange(pageSize){
        console.log(pageSize);
        this.state.pageSize = pageSize;
        window.sessionStorage.setItem("pageSize",pageSize);
        this.componentDidMount();
    }

    exportAction() {
        ajaxFile('/mkt/leads/export.do',{orgId: this.state.group.id,fromWay:2,
            isIn:((this.props.history.location.pathname.indexOf('/home/mkt/leadspublic') == -1)  ? 1 : 0)})
    };
    chooseStageSearch(chooseStageNameLeads){
        // debugger;
        this.state.chooseStageNameLeads = chooseStageNameLeads;
        this.state.currentPage = 1;
        window.sessionStorage.setItem("chooseStageNameLeads",chooseStageNameLeads);
        this.componentDidMount();
    }
    chooseStatusSearch(chooseStatusNameLeads){
        // debugger;
        this.state.chooseStatusNameLeads = chooseStatusNameLeads;
        window.sessionStorage.setItem("chooseStatusNameLeads",chooseStatusNameLeads);
        this.state.currentPage = 1;
        this.componentDidMount();
    }
    chooseAdvisorSearch(chooseAdvisorName){
        // debugger;
        this.state.chooseAdvisorName = chooseAdvisorName;
        window.sessionStorage.setItem("chooseAdvisorName",chooseAdvisorName);
        this.state.currentPage = 1;
        this.componentDidMount();
    }
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
                <div id="main" className="main p-3">
                    <Progress isAnimating={this.state.isAnimating}/>
                    {/*<Table list={this.state.list} goto={this.goToDetails}/>*/}
                    <Input placeholder="请输入手机号"
                           className={"leadlist_search"}
                           value={this.state.cellphone}
                           style={{width: '20%'}}
                           onChange={this.onChange.bind(this, 'cellphone')}
                           append={<Button type="primary" icon="search" onClick={this.componentDidMount.bind(this)}>搜索</Button>}
                            />
                    <Select value={this.state.chooseStageNameLeads} placeholder="请选择阶段" clearable={true} onChange={this.chooseStageSearch} className={"leftMargin"}>
                        {
                            this.state.stageName.map(el => {
                                return <Select.Option key={el.id} label={el.name} value={el.id} />
                            })
                        }
                    </Select>
                    <Select value={this.state.chooseStatusNameLeads} placeholder="请选择状态" clearable={true} onChange={this.chooseStatusSearch} className={"leftMargin"}>
                        {
                            this.state.statusName.map(el => {
                                return <Select.Option key={el.id} label={el.name} value={el.id} />
                            })
                        }
                    </Select>
                    <Select value={this.state.chooseAdvisorName} placeholder="请选择所属用户" clearable={true} onChange={this.chooseAdvisorSearch} className={"leftMargin"}>
                        {
                            this.state.advisorList ? this.state.advisorList.map(el => {
                                return <Select.Option key={el.cId} label={el.cRealName} value={el.cId} />
                            }) : null
                        }
                    </Select>
                    {/*append={<Button type="primary" icon="search" onClick={this.componentDidMount.bind(this)}>搜索</Button>}*/}
                    <Table
                        style={{width: '100%',"marginBottom":"30px"}}
                        columns={this.state.columns}
                        data={this.state.list}
                        border={true}
                        fit={false}
                        height='80%'
                        onSelectChange={(selection) => this.selectRow(selection) }
                    />
                    <Pagination layout="total, sizes, prev, pager, next, jumper"
                                total={this.state.totalCount}
                                pageSizes={[10, 50, 100]}
                                pageSize={this.state.pageSize}
                                currentPage={this.state.currentPage}
                                pageCount={this.state.totalPage}
                                className={"page_bottom"}
                                onCurrentChange={(currentPage) => this.pageChange(currentPage)}
                                onSizeChange={(pageSize) => this.sizeChange(pageSize)}/>
                </div>
            </div>
        )
    }
}

export default List;