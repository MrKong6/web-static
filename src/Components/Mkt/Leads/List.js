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
import {AJAX_PATH} from "../../../utils/ajax";
import {Button, Table, Pagination, Message, Input, Tooltip, Select} from 'element-react';
import './Leads.css'

import {$} from "../../../vendor";
import ajaxFile from "../../../utils/ajaxFile";

/*
const Table = ({list, goto}) => {
    return (
        <table className="table table-bordered table-sm">
            <thead>
            <tr>
                <th>创建人</th>
                <th>创建时间</th>
                <th>所属组织</th>
                <th>所属用户</th>
                <th>来源</th>
                <th>渠道</th>
                <th>阶段</th>
                <th>状态</th>
                <th>学员姓名</th>
                <th>性别</th>
                <th>年龄</th>
                <th>在读年级</th>
                <th>所在学校</th>
                <th>家长姓名</th>
                <th>与学员关系</th>
                <th>电话号码</th>
                <th>微信号</th>
                <th>家庭住址</th>
                <th>课程类别</th>
                <th>课程产品</th>
                <th>备注</th>
                <th>沟通记录</th>
            </tr>
            </thead>
            <tbody>{TableItem(list, goto)}</tbody>
        </table>
    );
};
*/

/*
const TableItem = (data, goto) => {
    let table = [];

    if (data.length === 0) {
        return table;
    }

    data.map(item => {
        table.push(
            <tr key={item.id}>
                <td>{item.creatorName}</td>
                <td>{fmtDate(item.createTime)}</td>
                <td>{item.organizationName}</td>
                <td>{item.executiveName}</td>
                <td>{item.sourceName}</td>
                <td>{item.channelName}</td>
                <td>{item.stageName}</td>
                <td>{item.statusName}</td>
                <td>
                    <a onClick={goto} lid={item.id} href="javascript:;">{item.student.name}</a>
                </td>
                <td>{item.student.genderText !== 'null' ? item.student.genderText : '--'}</td>
                <td>{item.student.age !== 'null' ? item.student.age : '--'}</td>
                <td>{item.student.classGrade !== 'null' ? item.student.classGrade : '--'}</td>
                <td>{item.student.schoolName ? item.student.schoolName : '--'}</td>
                <td>
                    <a onClick={goto} lid={item.id} href="javascript:;">{item.parent.name}</a>
                </td>
                <td>{item.parent.relation ? item.parent.relation : '--'}</td>
                <td>{item.parent.cellphone ? item.parent.cellphone : '--'}</td>
                <td>{item.parent.weichat ? item.parent.weichat : '--'}</td>
                <td>{item.parent.address ? item.parent.address : '--'}</td>
                <td>{item.courseType !== 'null' ? item.courseType : '--'}</td>
                <td>{item.courseName !== 'null' ? item.courseName : '--'}</td>
                <td>{item.note ? item.note : '--'}</td>
                <td>--</td>
            </tr>
        );
    });

    return table;
};
*/

class List extends React.Component {

    constructor(props) {
        super(props);
        this.commands = this.props.commands.filter(command => (command.name === 'Add' || command.name === 'Import' || command.name === 'Export'));
        this.title = fmtTitle(this.props.location.pathname);
        this.createDialogTips = this.createDialogTips.bind(this);
        // this.goToDetails = this.goToDetails.bind(this);
        this.addAction = this.addAction.bind(this);
        this.exportAction = this.exportAction.bind(this);
        this.chooseStageSearch = this.chooseStageSearch.bind(this);
        this.chooseStatusSearch = this.chooseStatusSearch.bind(this);
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            isAnimating: true,
            redirectToReferrer: false,
            cellphone : '',
            columns:[
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
                    label: "阶段",
                    prop: "stageName",
                    width: 150
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

    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/mkt/leads/list.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,
                    pageNum:this.state.currentPage,pageSize:this.state.pageSize,fromWay:2,
                    isIn:((this.props.history.location.pathname.indexOf('/home/mkt/leadspublic') == -1)  ? 1 : 0),
                    stageId:this.state.chooseStageName,statusId:this.state.chooseStatusName});
                let status = await ajax('/mkt/leads/status/list.do', {typeId: 1});
                let stage = await ajax('/mkt/leads/stage/list.do', {typeId: 1});
                const ids = list.data.map((leads) => (leads.id));
                list.data.map(item => {
                    if(item.createTime != null){
                        item.createTime = formatWithTime(item.createTime);
                    }
                    if(!item.parent){
                        item.parent = {"cellphone" : "","name" : ""};
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
                    let list = await ajax('/mkt/leads/list.do', {orgId: this.state.group.id,cellphone:this.state.cellphone,fromWay:2,
                        pageNum:this.state.currentPage,pageSize:this.state.pageSize,isIn:((this.props.history.location.pathname.indexOf('/home/mkt/leadspublic') == -1)  ? 1 : 0)});
                    const ids = list.data.map((leads) => (leads.id));
                    list.data.map(item => {
                        if(!item.parent){
                            item.parent = {"cellphone" : "","name" : ""};
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
        console.log("sssssssss");
        this.componentDidMount();
        this.successMsg("导入成功")
    };

    onChange(key, value) {
        this.setState({
            cellphone: value
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

    exportAction() {
        ajaxFile('/mkt/leads/export.do',{orgId: this.state.group.id})
    };
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
                    {/*append={<Button type="primary" icon="search" onClick={this.componentDidMount.bind(this)}>搜索</Button>}*/}
                    <Table
                        style={{width: '100%'}}
                        columns={this.state.columns}
                        data={this.state.list}
                        border={true}
                        fit={false}
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