import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Commands from "../../Commands/Commands";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtDate, {formatWithTime} from '../../../utils/fmtDate';
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import { Button,Table,Pagination,Upload,Input,Tooltip, Select } from 'element-react';
import '../../Mkt/Leads/Leads.css'
import ajaxFile from "../../../utils/ajaxFile";

class List extends React.Component {
    constructor(props) {
        super(props);
        let storage = window.sessionStorage;

        this.commands = this.props.commands.filter(command => (command.name === 'Add' || command.name === 'Import' || command.name === 'Export'));
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            isAnimating: true,
            redirectToReferrer: false,
            columns: [
                {
                    label: "序号",
                    type: 'index',
                    fixed: 'left',
                },
                {
                    label: "学员姓名",
                    prop: "student.name",
                    sortable: true,
                    width: 100,
                    fixed: 'left',
                    render: (row, column, data)=>{
                        return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this, row.id)}>{row.student.name}</Button></span>
                    }
                },
                {
                    label: "性别",
                    prop: "student.genderText",
                    sortable: true
                },
                {
                    label: "年龄",
                    prop: "student.age",
                    sortable: true
                },
                {
                    label: "在读年级",
                    prop: "student.classGrade",
                    sortable: true,
                    width: 100
                },
                {
                    label: "所在学校",
                    prop: "student.schoolName",
                    sortable: true,
                    width: 120
                },
                {
                    label: "家长姓名",
                    prop: "parent.name",
                    sortable: true,
                    width: 100,
                    render: (row, column, data)=>{
                        return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this, row.id)}>{row.parent.name}</Button></span>
                    }
                },
                {
                    label: "与学员关系",
                    prop: "parent.relation",
                    sortable: true,
                    width: 120
                },
                {
                    label: "电话号码",
                    prop: "parent.cellphone",
                    sortable: true,
                    width: 130,
                },
                {
                    label: "微信号",
                    prop: "parent.weichat",
                    sortable: true,
                    width: 100,
                },
                {
                    label: "家庭住址",
                    prop: "parent.address",
                    sortable: true,
                    width: 120,
                    className:'tabletd',
                    render: function (data) {
                        return <Tooltip effect="dark" content={data.parent.address}
                                        placement="top-start">
                            {data.parent.address}
                        </Tooltip>
                    }
                },
                {
                    label: "课程类别",
                    prop: "courseType",
                    sortable: true,
                    width: 100,
                },
                {
                    label: "课程产品",
                    prop: "courseName",
                    sortable: true,
                    width: 100,
                    className:'tabletd',
                    render: function (data) {
                        return <Tooltip effect="dark" content={data.courseName}
                                        placement="top-start">
                            {data.courseName}
                        </Tooltip>
                    }
                },
                {
                    label: "备注",
                    prop: "note",
                    sortable: true
                },
                {
                    label: "来源",
                    prop: "sourceName",
                    sortable: true,
                    width: 100,
                },
                {
                    label: "渠道",
                    prop: "channelName",
                    sortable: true,
                    width: 100,
                },
                {
                    label: "阶段",
                    prop: "stageName",
                    sortable: true,
                    width: 120,
                    className:'tabletd',
                    render: function (data) {
                        return <Tooltip effect="dark" content={data.stageName}
                                        placement="top-start">
                            {data.stageName}
                        </Tooltip>
                    }
                },
                {
                    label: "状态",
                    prop: "statusName",
                    sortable: true,
                    width: 150
                },
                {
                    label: "所属组织",
                    prop: "organizationName",
                    sortable: true,
                    width: 175,
                },
                {
                    label: "所属用户",
                    prop: "executiveName",
                    sortable: true,
                    width: 100,
                },
                {
                    label: "创建人",
                    prop: "creatorName",
                    sortable: true,
                    width: 100,
                },
                {
                    label: "创建时间",
                    prop: "createTime",
                    sortable: true,
                    width: 140,
                },
                {
                    label: "转移时间",
                    prop: "transTime",
                    sortable: true,
                    width: 140,
                },
                {
                    label: "转化时间",
                    prop: "assignTime",
                    sortable: true,
                    width: 140,
                },

            ],
            totalPage:0,
            currentPage:1,
            pageSize:storage.getItem("pageSize") ? Number(storage.getItem("pageSize")) : 10,
            totalCount:0,
            stageName:[],
            chooseStageName:storage.getItem("chooseStageName") ? storage.getItem("chooseStageName") : '',
            statusName:[],
            chooseStatusName:storage.getItem("chooseStatusName") ? Number(storage.getItem("chooseStatusName")) : '',
            cellphone:storage.getItem("cellphone") ? storage.getItem("cellphone") : '',
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.addAction = this.addAction.bind(this);
        this.exportAction = this.exportAction.bind(this);
        this.chooseStageSearch = this.chooseStageSearch.bind(this);
        this.chooseStatusSearch = this.chooseStatusSearch.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/sales/oppor/list.do', {orgId: this.state.group.id, typeId: 2,fromWay:3,
                    pageNum:this.state.currentPage,pageSize:this.state.pageSize,cellphone:this.state.cellphone,
                    isIn:((this.props.history.location.pathname.indexOf('/home/sales/opporpublic') == -1)  ? 1 : 0),
                    stageId:this.state.chooseStageName,statusId:this.state.chooseStatusName});
                let status = await ajax('/mkt/leads/status/list.do', {typeId: 2});
                let stage = await ajax('/mkt/leads/stage/list.do', {typeId: 2});
                const ids = list.data.map((leads) => (leads.id));
                list.data.map(item => {
                    if(item.createTime != null){
                        item.createTime = formatWithTime(item.createTime);
                    }
                    if(item.transTime != null){
                        item.transTime = formatWithTime(item.transTime);
                    }
                    if(item.assignTime != null){
                        item.assignTime = formatWithTime(item.assignTime);
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
                    let list = await ajax('/sales/oppor/list.do', {orgId: nextProps.changedCrmGroup.id, typeId: 2,fromWay:3,
                        pageNum:this.state.currentPage,pageSize:this.state.pageSize,isIn:((this.props.history.location.pathname.indexOf('/home/sales/opporpublic') == -1)  ? 1 : 0)});
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
        if (this.tipsContainer) {
            document.body.removeChild(this.tipsContainer);
        }
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

    exportAction() {
        ajaxFile('/mkt/leads/export.do',{orgId: this.state.group.id,typeId:"2",fromWay:3,isIn:((this.props.history.location.pathname.indexOf('/home/sales/opporpublic') == -1)  ? 1 : 0)})
    };

    onChange(key, value) {
        this.setState({
            cellphone: value
        });
        window.sessionStorage.setItem("cellphone",value);
    }

    chooseStageSearch(chooseStageName){
        // debugger;
        this.state.chooseStageName = chooseStageName;
        window.sessionStorage.setItem("chooseStageName",chooseStageName);
        this.state.currentPage = 1;
        this.componentDidMount();
    }
    chooseStatusSearch(chooseStatusName){
        // debugger;
        this.state.chooseStatusName = chooseStatusName;
        window.sessionStorage.setItem("chooseStatusName",chooseStatusName);
        this.state.currentPage = 1;
        this.componentDidMount();
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

        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>&nbsp;{this.title.text}

                    <Commands
                        commands={this.commands}
                        addAction={this.addAction}
                        exportAction={this.exportAction}
                    />
                </h5>
                <div id="main" className="main p-3">
                    <Progress isAnimating={this.state.isAnimating}/>
                    <Input placeholder="请输入手机号"
                           className={"leadlist_search"}
                           value={this.state.cellphone}
                           style={{width: '20%'}}
                           onChange={this.onChange.bind(this, 'cellphone')}
                           append={<Button type="primary" icon="search" onClick={this.componentDidMount.bind(this)}>搜索</Button>}
                    />
                    <Select value={this.state.chooseStageName} placeholder="请选择阶段" clearable={true} onChange={this.chooseStageSearch} className={"leftMargin"}>
                        {
                            this.state.stageName.map(el => {
                                return <Select.Option key={el.id} label={el.name} value={el.id} />
                            })
                        }
                    </Select>
                    <Select value={this.state.chooseStatusName} placeholder="请选择状态" clearable={true} onChange={this.chooseStatusSearch} className={"leftMargin"}>
                        {
                            this.state.statusName.map(el => {
                                return <Select.Option key={el.id} label={el.name} value={el.id} />
                            })
                        }
                    </Select>
                    {/*<Table list={this.state.list} goto={this.goToDetails}/>*/}
                    <Table
                        style={{width: '100%',"margin-bottom":"30px"}}
                        columns={this.state.columns}
                        data={this.state.list}
                        border={true}
                        fit={true}
                        emptyText={"--"}
                        height='80%'
                    />
                    <Pagination layout="total, sizes, prev, pager, next, jumper"
                                total={this.state.totalCount}
                                pageSizes={[10, 50, 100]}
                                pageSize={this.state.pageSize}
                                currentPage={this.state.currentPage}
                                pageCount={this.state.totalPage}
                                className={"leadlist_page page_bottom"}
                                onCurrentChange={(currentPage) => this.pageChange(currentPage)}
                                onSizeChange={(pageSize) => this.sizeChange(pageSize)}/>
                </div>
            </div>
        )
    }
}

export default List;