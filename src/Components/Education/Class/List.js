import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import '../../Mkt/Leads/Leads.css'
import {Button, Table, Pagination, Tooltip, Select} from 'element-react';
import CONFIG from "../../../utils/config";
import fmtDate from "../../../utils/fmtDate";
import Commands from "../../Commands/Commands";

class List extends React.Component {
    constructor(props) {
        super(props);

        this.commands = this.props.commands.filter((command) => (command.name === 'Add'));
        this.title = fmtTitle(this.props.location.pathname);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.addAction = this.addAction.bind(this);
        this.chooseStatusSearch = this.chooseStatusSearch.bind(this);
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            classStatus: [],
            chooseStatusName: null,
            teacherId: (this.props.profile && this.props.profile.teacherId) ? this.props.profile && this.props.profile.teacherId : 0,
            isAnimating: true,
            redirectToReferrer: false,
            columns: [
                {
                    width: 100,
                    sortable: true,
                    type: 'index'
                },
                {
                    label: "(校区名称)",
                    prop: "schoolArea",
                    width: 120,
                },
                {
                    label: "班级编号",
                    prop: "code",
                    width: 120,
                    sortable: true,
                    render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this, row.id)}>{row.code}</Button></span>
                    }
                },
                {
                    label: "班级状态",
                    prop: "classStatusName",
                    width: 95,
                    /*render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this, row.id)}>{row.code}</Button></span>
                    }*/
                },
                {
                    label: "班级类型",
                    prop: "typeName",
                    width: 95
                },
                {
                    label: "班级类别",
                    prop: "rangeName",
                    width: 95
                },
                {
                    label: "开班日期",
                    prop: "startDate",
                    width: 120
                },
                {
                    label: "结班日期",
                    prop: "endDate",
                    width: 120
                },
                {
                    label: "计划人数",
                    prop: "planNum",
                    width: 95
                },
                {
                    label: "实际人数",
                    prop: "factNum",
                    width: 95
                },
                {
                    label: "主教",
                    prop: "mainTeacherName",
                    width: 95,
                },
                {
                    label: "客服",
                    prop: "registrar",
                    width: 95,
                },
                {
                    label: "课程类别",
                    prop: "courseTypeName",
                    width: 95
                },
                {
                    label: "课程阶段",
                    prop: "courseRangeName",
                    width: 100
                },
                {
                    label: "课程表",
                    prop: "course",
                    width: 100
                },
                {
                    label: "开课日期",
                    prop: "courseStartDate",
                    width: 120
                },
                {
                    label: "结课日期",
                    prop: "courseEndDate",
                    width: 120
                },
                {
                    label: "课程进度",
                    prop: "courseProcess",
                    width: 120
                },
                {
                    label: "总课时",
                    prop: "classHour",
                    width: 120
                },
                {
                    label: "消耗课时",
                    prop: "useCourseHour",
                    width: 120
                },
                {
                    label: "剩余课时",
                    prop: "noUseCourseHour",
                    width: 120
                },
                {
                    label: "备注",
                    prop: "beforeClassCode",
                    width: 95,
                    className:'tabletd',
                    render: function (data) {
                        return <Tooltip effect="dark" content={data.beforeClassCode}
                                        placement="top-start">
                            {data.beforeClassCode}
                        </Tooltip>
                    }
                },
                {
                    label: "创建人",
                    prop: "createBy",
                    width: 100
                },
                {
                    label: "创建时间",
                    prop: "createOn",
                    width: 130,
                    sortable: true
                },
            ],
            totalPage:0,
            currentPage:1,
            pageSize:10,
            totalCount:0,
        };
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/academy/class/list.do', {orgId: this.state.group.id,pageIndex:this.state.currentPage,
                    limit:this.state.pageSize,csTeacherId:this.state.teacherId,statusId:this.state.chooseStatusName});
                let allClassStatus = await ajax('/academy/class/classStatus.do');

                const ids = list.data.items.map((contract) => (contract.id+''));
                list.data.items.map(item => {
                    if(item.createOn != null){
                        item.createOn = fmtDate(item.createOn);
                    }
                    if(item.startDate != null){
                        item.startDate = fmtDate(item.startDate);
                    }
                    if(item.endDate != null){
                        item.endDate = fmtDate(item.endDate);
                    }
                    if(item.courseStartDate != null){
                        item.courseStartDate = fmtDate(item.courseStartDate);
                    }
                    if(item.courseEndDate != null){
                        item.courseEndDate = fmtDate(item.courseEndDate);
                    }
                });
                this.setState({list: list.data.items, ids: ids,totalPage: list.data.totalPage,totalCount: list.data.count,classStatus:allClassStatus});
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
                    let list = await ajax('/service/contract/list.do', {orgId: nextProps.changedCrmGroup.id,pageNum:this.state.currentPage,pageSize:this.state.pageSize});
                    const ids = list.data.map((contract) => (contract.id+""));

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

            //request();
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

    goToDetails(evt) {
        const url = `${this.props.match.url}/${evt}`;

        this.props.history.push(url);
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

    addAction(){
        this.props.history.push(`${this.props.match.url}/create`, {ids: this.state.ids});
    }
    chooseStatusSearch(chooseStatusName){
        // debugger;
        this.state.chooseStatusName = chooseStatusName;
        /*window.sessionStorage.setItem("chooseStatusName",chooseStatusName);*/
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
                    />
                </h5>
                <div id="main" className="main p-3">
                    {/*<Progress isAnimating={this.state.isAnimating}/>*/}
                    {/*<Table list={this.state.list} goto={this.goToDetails}/>*/}
                    <div className="row">
                        <div className="col-2">
                            <Select value={this.state.chooseStatusName} placeholder="请选择状态" clearable={true}
                                    onChange={this.chooseStatusSearch}>
                                {
                                    this.state.classStatus.map(el => {
                                        return <Select.Option key={el.code} label={el.name} value={el.code}/>
                                    })
                                }
                            </Select>
                        </div>
                    </div>
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
                                className={"page_bottom"}
                                onCurrentChange={(currentPage) => this.pageChange(currentPage)}
                                onSizeChange={(pageSize) => this.sizeChange(pageSize)}/>
                </div>
            </div>
        )
    }
}

export default List;