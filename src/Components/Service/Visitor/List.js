import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import DialogUser from '../../Dialog/DialogUser';
import Commands from "../../Commands/Commands";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtDate, {formatWithTime} from '../../../utils/fmtDate';
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import {AJAX_PATH} from "../../../utils/ajax";
import { Button,Table,Pagination,Message,Input,Tooltip, Select } from 'element-react';
import './Visitor.css'

import {$} from "../../../vendor";
import ajaxFile from "../../../utils/ajaxFile";

class List extends React.Component {

    constructor(props) {
        super(props);
        this.commands = this.props.commands.filter(command => (command.name === 'Add' || command.name === 'Import'|| command.name === 'Transfer'|| command.name === 'Export'));
        this.title = fmtTitle(this.props.location.pathname);
        this.createDialogTips = this.createDialogTips.bind(this);
        // this.goToDetails = this.goToDetails.bind(this);
        this.addAction = this.addAction.bind(this);
        this.exportAction = this.exportAction.bind(this);
        this.assignAction = this.assignAction.bind(this);
        this.assignAccept = this.assignAccept.bind(this);
        this.state = {
            group: this.props.changedCrmGroup,
            userId:this.props.profile.cId,
            list: [],
            ids: [],
            isAnimating: true,
            redirectToReferrer: false,
            cellphone : '',
            chooseRows:[],
            columns:[
                {
                    type: 'selection'
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
                    width: 140,
                    sortable: true
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
                    label: "(校区)",
                    prop: "schoolArea",
                    width: 120
                },
                /*{
                    label: "阶段",
                    prop: "stageName",
                    width: 150
                },*/
                {
                    label: "学员姓名",
                    prop: "student.name",
                    width: 95,
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
                        return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this, row.id)}>{row.parent.name}</Button></span>
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
                        return <Tooltip effect="dark" content={data.parent.cellphone}
                                        placement="top-start">
                            {data.parent.cellphone}
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
                    label: "课程产品",
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
                    label: "状态",
                    prop: "statusName",
                    width: 150
                },
            ],
            totalPage:0,
            currentPage:1,
            pageSize:10,
            totalCount:0,
            stageName:[],
            chooseStageName:"",
            statusName:[],
            chooseStatusName:""
        };
        this.chooseStageSearch = this.chooseStageSearch.bind(this);
        this.chooseStatusSearch = this.chooseStatusSearch.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/service/visitor/list.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,pageNum:this.state.currentPage,pageSize:this.state.pageSize,typeId:4,fromWay:1,
                    isIn:((this.props.history.location.pathname.indexOf('/home/service/visitorin') == -1)  ? 0 : 1),
                    stageId:this.state.chooseStageName,statusId:this.state.chooseStatusName});
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
                    let list = await ajax('/service/visitor/list.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,typeId:4,fromWay:1,pageNum:this.state.currentPage,pageSize:this.state.pageSize});
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
        ajaxFile('/mkt/leads/export.do',{orgId: this.state.group.id,typeId:4})
    };

    /**
     * 转移给
     */
    assignAction() {
        console.log(this.state.chooseRows);
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
    }

    chooseStageSearch(chooseStageName){
        // debugger;
        this.state.chooseStageName = chooseStageName;
        this.state.currentPage = 1;
        this.componentDidMount();
    }
    chooseStatusSearch(chooseStatusName){
        // debugger;
        this.state.chooseStatusName = chooseStatusName;
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

    pageChange(currentPage){
        console.log(currentPage);
        this.state.currentPage = currentPage;
        // this.setState({currentPage:currentPage});
        this.componentDidMount();
    }

    sizeChange(pageSize){
        console.log(pageSize);
        this.state.pageSize = pageSize;
        this.componentDidMount();
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

                    <Commands
                        commands={this.commands}
                        addAction={this.addAction}
                        assignAction={this.assignAction}
                        assignParams={this.state.chooseRows}
                        importAction={uploadConfig}
                        exportAction={this.exportAction}
                        /*importAction={uploadConfig}*/
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
                    <Select value={this.state.chooseStatusName} placeholder="请选择状态" clearable={true} onChange={this.chooseStatusSearch} className={"leftMargin"}>
                        {
                            this.state.statusName.map(el => {
                                return <Select.Option key={el.id} label={el.name} value={el.id} />
                            })
                        }
                    </Select>
                    {/*append={<Button type="primary" icon="search" onClick={this.componentDidMount.bind(this)}>搜索</Button>}*/}
                    <Table
                        style={{width: '100%'}}
                        columns={this.state.columns}
                        data={this.state.list}
                        border={true}
                        fit={false}
                        onSelectChange={(selection) => this.selectRow(selection) }
                    />
                    <Pagination layout="total, sizes, prev, pager, next, jumper"
                                total={this.state.totalCount}
                                pageSizes={[10, 50, 100]}
                                pageSize={this.state.pageSize}
                                currentPage={this.state.currentPage}
                                pageCount={this.state.totalPage}
                                className={"leadlist_page"}
                                onCurrentChange={(currentPage) => this.pageChange(currentPage)}
                                onSizeChange={(pageSize) => this.sizeChange(pageSize)}/>
                </div>
            </div>
        )
    }
}

export default List;