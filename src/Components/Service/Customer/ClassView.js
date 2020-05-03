import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'

import fmtTitle from "../../../utils/fmtTitle";
import fmtDate from "../../../utils/fmtDate";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import DialogAccount from "../../Dialog/DialogAccount";
import {Button, Form, Table, Tooltip} from "element-react";
import DialogAccountRelateClass from "../../Dialog/DialogAccountRelateClass";

const NextBtn = ({id, ids}) => {
    const curIndex = ids.indexOf(id);

    if ((curIndex + 1) === ids.length) {
        return <button type="button" className="btn btn-light" disabled={true}>下一条</button>
    }

    return (
        <Link
            className="btn btn-light"
            to={{
                pathname: `/home/service/customer/contract/${ids[curIndex + 1]}`,
                state: {ids: ids}
            }}
        >
            下一条
        </Link>
    )
};

const PrevBtn = ({id, ids}) => {
    const curIndex = ids.indexOf(id);

    if (curIndex === 0) {
        return <button type="button" className="btn btn-light" disabled={true}>上一条</button>
    }

    return (
        <Link
            className="btn btn-light"
            to={{
                pathname: `/home/service/customer/contract/${ids[curIndex - 1]}`,
                state: {ids: ids}
            }}
        >
            上一条
        </Link>
    )
};

class ClassView extends React.Component {
    constructor(props) {
        super(props);
        this.title = fmtTitle(this.props.location.pathname);
        this.first = (this.props.sonView && !(this.props.sonView.filter(view => (view.id == '3-2-1')) == false)) ? 'normal' : 'none';
        this.second = (this.props.sonView && !(this.props.sonView.filter(view => (view.id == '3-2-2')) == false)) ? 'normal' : 'none';
        this.third = (this.props.sonView && !(this.props.sonView.filter(view => (view.id == '3-2-3')) == false)) ? 'normal' : 'none';
        this.fourth = (this.props.sonView && !(this.props.sonView.filter(view => (view.id == '3-2-4')) == false)) ? 'normal' : 'none';
        this.fifth = !(this.props.sonView.filter(view => (view.id == '3-2-5')) == false) ? 'normal' : 'none';
        this.sixth = !(this.props.sonView.filter(view => (view.id == '3-2-6')) == false) ? 'normal' : 'none';
        this.seventh = this.props.sonView && !(this.props.sonView.filter(view => (view.id == '3-2-7')) == false) ? 'normal' : 'none';

        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            id: this.props.match.params.studentId,
            ids: [],
            name: this.props.location.state.stuName,
            columns: [
                {
                    width: 100,
                    sortable: true,
                    type: 'index',
                    fixed: 'left',
                },
                {
                    label: "班级编号",
                    prop: "code",
                    width: 120,
                    render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this, row.id)}>{row.code}</Button></span>
                    }
                },
                {
                    label: "(校区名称)",
                    prop: "schoolArea",
                    width: 120,
                },
                {
                    label: "班级状态",
                    prop: "classStatusName",
                    width: 95,
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
                    label: "主教",
                    prop: "mainTeacherName",
                    width: 95,
                    className:'tabletd',
                    render: function (data) {
                        return <Tooltip effect="dark" content={data.mainTeacherName}
                                        placement="top-start">
                            {data.mainTeacherName}
                        </Tooltip>
                    }
                },
                {
                    label: "客服",
                    prop: "registrar",
                    width: 95,
                },
                {
                    label: "课程类别",
                    prop: "courseType",
                    width: 95
                },
                {
                    label: "课程阶段",
                    prop: "courseRange",
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
                    label: "总课次",
                    prop: "classTime",
                    width: 120
                },
                {
                    label: "总课时",
                    prop: "classHour",
                    width: 120
                }
            ],
            data: []

        };
        this.createAccountDialog = this.createAccountDialog.bind(this);
        this.createCourseHourDialog= this.createCourseHourDialog.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    componentDidMount() {
        this.refresh();
        mainSize();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.changedCrmGroup !== nextProps.changedCrmGroup) {
            this.setState({redirectToList: true})
        }
    }

    componentWillUnmount() {
        if (this.tipsContainer) {
            document.body.removeChild(this.tipsContainer);
        }
    }

    createAccountDialog() {
        this.actContainer = document.createElement('div');
        ReactDOM.render(
            <DialogAccount
                accept={this.acceptActDialog}
                changedCrmGroup={this.state.group}
                refresh={this.refresh}
                id={this.state.id}
                notRoot={true}
                defaults={this.state.channelId}
                replace={this.props.replace}
                from={this.props.from}
                ref={(dom) => {
                    this.act = dom
                }}
            />,
            document.body.appendChild(this.actContainer)
        );
        this.act.dialog.modal('show');
    }

    createCourseHourDialog(data) {
        this.actContainer = document.createElement('div');
        ReactDOM.render(
            <DialogAccountRelateClass
                accept={this.acceptActDialog}
                changedCrmGroup={this.state.group}
                notRoot={true}
                id={this.state.id}
                mainAccountId={data.id}
                totalFee={(data.sonList && data.sonList.length >= 1 ? data.sonList[0].afterBalance : 0)}
                defaults={this.state.channelId}
                replace={this.props.replace}
                from={this.props.from}
                ref={(dom) => {
                    this.act = dom
                }}
            />,
            document.body.appendChild(this.actContainer)
        );
        this.act.dialog.modal('show');
    }

    goToDetails(evt) {
        const url = `/home/academy/class/` + evt;

        this.props.history.push(url,{state: {stuName: this.state.name}});
    }

    refresh(){
        const request = async () => {
            try {
                let list = await ajax('/academy/class/list.do', {orgId: this.state.group.id,pageIndex:this.state.currentPage,
                    limit:this.state.pageSize,statusId:this.state.chooseStatusName,classCode:this.state.chooseClassName,stuId:this.state.id});
                let ids = [];
                if(list.data && list.data.items){
                    ids = list.data.items.map((contract) => (contract.id));
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
                }

                this.setState({list: list.data.items, ids: ids,totalPage: list.data.totalPage,totalCount: list.data.count});
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

    render() {


        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                    &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
                    <p className="d-inline text-muted">{this.state.name}</p>
                </h5>

                <div id="main" className="main p-3" style={{"height":"80%"}}>
                    <div className="row justify-content-md-center mb-2">
                        <div className="col col-12">
                            <div className="card border-top-0">
                                <div className="card-body">
                                    <p className="ht pb-3 b-b">班级信息</p>
                                    <Table
                                        style={{width: '100%'}}
                                        columns={this.state.columns}
                                        data={this.state.list}
                                        border={true}
                                        emptyText={"--"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb location_bottom">
                            <li className="breadcrumb-item"style={{"display":this.first}}><Link
                                to={`/home/service/customer/student/${this.state.id}`}>学员信息</Link></li>
                            <li className="breadcrumb-item" style={{"display":this.second}}>
                                <Link to={{
                                    pathname: `/home/service/customer/parent/${this.state.id}`,
                                    state: {stuName: this.state.name}
                                }}>家长信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.third}}>
                                <Link to={{
                                    pathname: `/home/service/customer/contract/${this.state.id}`,
                                    state: {stuName: this.state.name}
                                }}>合同信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.fourth}}>
                                <Link to={{
                                    pathname: `/home/service/customer/account/${this.state.id}`,
                                    state: {stuName: this.state.data.name}
                                }}>账户信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.sixth}}>
                                班级信息
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.fifth}}>
                                <Link to={{
                                    pathname: `/home/service/customer/situation/${this.state.id}`,
                                    state: {stuName: this.state.name}
                                }}>异动信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.seventh}}>
                                <Link to={{
                                    pathname: `/home/service/customer/charge/${this.state.id}`,
                                    state: {stuName: this.state.data.name}
                                }}>卡券信息</Link>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
        )
    }
}

export default ClassView;