import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import {Button, Table, Tooltip} from "element-react";
import fmtDate from "../../../utils/fmtDate";
import CONFIG from "../../../utils/config";

const NextBtn = ({id, ids}) => {
    const curIndex = ids.indexOf(id);

    if ((curIndex + 1) === ids.length) {
        return <button type="button" className="btn btn-light" disabled={true}>下一条</button>
    }

    return (
        <Link
            className="btn btn-light"
            to={{
                pathname: `/home/sales/customer/contract/${ids[curIndex + 1]}`,
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
                pathname: `/home/sales/customer/contract/${ids[curIndex - 1]}`,
                state: {ids: ids}
            }}
        >
            上一条
        </Link>
    )
};

class ContractView extends React.Component {
    constructor(props) {
        super(props);

        this.title = fmtTitle(this.props.location.pathname);

        this.first = !(this.props.sonView.filter(view => (view.id == '2-3-1')) == false) ? 'normal' : 'none';
        this.second = !(this.props.sonView.filter(view => (view.id == '2-3-2')) == false) ? 'normal' : 'none';
        this.third = !(this.props.sonView.filter(view => (view.id == '2-3-3')) == false) ? 'normal' : 'none';
        this.fourth = !(this.props.sonView.filter(view => (view.id == '2-3-5')) == false) ? 'normal' : 'none';
        this.fifth = !(this.props.sonView.filter(view => (view.id == '2-3-6')) == false) ? 'normal' : 'none';
        this.sixth = this.props.sonView && !(this.props.sonView.filter(view => (view.id == '2-3-7')) == false) ? 'normal' : 'none';
        this.seventh = this.props.sonView && !(this.props.sonView.filter(view => (view.id == '2-3-8')) == false) ? 'normal' : 'none';

        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            id: this.props.match.params.studentId,
            ids: [],
            data: {name: this.props.location.state.stuName},
            contractList: [],
            columns: [
                {
                    // label: "序号",
                    width: 100,
                    sortable: true,
                    type: 'index',
                    fixed: true,
                },
                {
                    label: "创建人",
                    prop: "creatorName",
                    width: 100,
                    sortable: true,
                    fixed: true,
                },
                {
                    label: "创建时间",
                    prop: "createTime",
                    width: 120,
                    sortable: true,
                    fixed: true,
                },
                {
                    label: "所属组织",
                    prop: "orgName",
                    width: 175,
                    showOverflowTooltip: true,
                    fixed: true,
                },
                {
                    label: "所属用户",
                    prop: "executiveName",
                    width: 95,
                    fixed: true,
                },
                {
                    label: "合同编号",
                    prop: "code",
                    width: 130,
                    fixed: true,
                    render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this, row.id)}>{row.code}</Button></span>
                    }
                },
                {
                    label: "合同类型",
                    prop: "typeName",
                    width: 100,
                },
                {
                    label: "学员姓名",
                    prop: "stuName",
                    width: 95,
                },
                {
                    label: "家长姓名",
                    prop: "parName",
                    width: 95,
                },
                {
                    label: "联系电话",
                    prop: "parCellphone",
                    width: 150,
                    className: 'tabletd',
                    render: function (data) {
                        return <Tooltip effect="dark" content={data.parCellphone}
                                        placement="top-start">
                            {data.parCellphone}
                        </Tooltip>
                    }

                },
                {
                    label: "课程类别",
                    prop: "courseType",
                    width: 95
                },
                {
                    label: "课程",
                    prop: "courseName",
                    width: 95,
                    className: 'tabletd',
                    render: function (data) {

                        return <Tooltip effect="dark" content={data.courseName}
                                        placement="top-start">
                            {data.courseName}
                        </Tooltip>
                    }
                },
                {
                    label: "合同金额(元)",
                    prop: "contractPrice",
                    width: 100
                },
                {
                    label: "折扣金额(元)",
                    prop: "countPrice",
                    width: 100,
                    sortable: true
                },
                {
                    label: "应付金额(元)",
                    prop: "finalPrice",
                    width: 95
                },
                {
                    label: "已付金额(元)",
                    prop: "paid",
                    width: 120
                },
                {
                    label: "课时费(元)",
                    prop: "oriPrice",
                    width: 100,
                    sortable: true
                },
                {
                    label: "培训资料费(元)",
                    prop: "discPrice",
                    width: 95
                },
                {
                    label: "其他费用(元)",
                    prop: "otherPrice",
                    width: 120
                },
                {
                    label: "总课时",
                    prop: "courseHours",
                    width: 95
                },
                {
                    label: "总课次",
                    prop: "courseTimes",
                    width: 120
                }
            ],
            isEmpty: false,
            stuInfo:null
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.addContract = this.addContract.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/sales/customer/student/list.do', {orgId: this.state.group.id});
                let contractList = await ajax('/sales/contract/queryListByStudentId.do', {id: this.state.id});
                let stuData = await ajax('/service/customer/student/query.do', {id: this.state.id});  //学员信息
                let parentList = await ajax('/service/customer/parent/queryListByStudentId.do', {id: this.state.id});//学员家长信息
                const ids = list.data ? list.data.map((student) => (student.id)) : [];
                const isEmpty = !contractList.length;
                let stuInfo = {"student":stuData,"parent":(parentList && parentList.length > 0) ? parentList[0] : null}
                if(contractList){
                    contractList.map(item => {
                        if(item.createTime != null){
                            item.createTime = fmtDate(item.createTime);
                        }
                        if(item.startDate != null){
                            item.startDate = fmtDate(item.startDate);
                        }
                        if(item.endDate != null){
                            item.endDate = fmtDate(item.endDate);
                        }
                        if(item.typeId != null){
                            item.typeId = CONFIG.TYPE_ID[item.typeId];
                        }
                    });
                }
                this.setState({ids, contractList, isEmpty, stuInfo});
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    this.createDialogTips(`${err.errCode}: ${err.errText}`);
                }
            }
        };

        request();
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

    goToDetails(id) {
        this.props.history.push(`/home/sales/contract/` + id);
    }

    addContract(){
        this.props.history.push(`/home/sales/contract/create`, {id: this.state.id,data:this.state.stuInfo,typeId:2,
            stuId:(this.state.stuInfo.student ? this.state.stuInfo.student.id : null),
            parId:((this.state.stuInfo.parent && this.state.stuInfo.parent.length) > 0 ? this.state.stuInfo.parent[0].id: null) });
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

        if (this.state.redirectToList) {
            return (
                <Redirect to="/sales/customer"/>
            )
        }

        if (!this.state.isEmpty && !this.state.contractList.length) {
            return (
                <div>
                    <h5 id="subNav">
                        <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                        &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;

                        <div className="btn-group float-right ml-4" role="group">
                            <button onClick={() => {
                                this.props.history.push('/home/sales/contract');
                            }} type="button" className="btn btn-light">返回
                            </button>
                        </div>
                    </h5>

                    <div id="main" className="main p-3">
                        <div className="row justify-content-md-center">
                            <div className="col col-12">
                                <div className="card">
                                    <div className="card-body">数据加载中...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        if (this.state.isEmpty && !this.state.contractList.length) {
            return (
                <div>
                    <h5 id="subNav">
                        <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                        &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;

                        <div className="btn-group float-right ml-4" role="group">
                            <button onClick={() => {
                                this.props.history.push('/home/sales/contract');
                            }} type="button" className="btn btn-light">返回
                            </button>
                        </div>
                        <div className="btn-group float-right" role="group">
                            <button onClick={this.addContract} type="button" className="btn btn-primary" id="btnChoose">
                                新增
                            </button>
                        </div>
                    </h5>

                    <div id="main" className="main p-3">
                        <div className="row justify-content-md-center">
                            <div className="col col-12">
                                <div className="card">
                                    <div className="card-body">无合同记录...</div>
                                </div>
                            </div>
                        </div>

                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link
                                    to={`/home/sales/customer/student/${this.state.id}`}>学员信息</Link></li>
                                <li className="breadcrumb-item">
                                    <Link to={{
                                        pathname: `/home/sales/customer/parent/${this.state.id}`,
                                        state: {stuName: this.state.data.name}
                                    }}>家长信息</Link>
                                </li>
                                <li className="breadcrumb-item active">合同信息</li>
                                <li className="breadcrumb-item" style={{"display": this.fourth}}>
                                    <Link to={{
                                        pathname: `/home/sales/customer/situation/${this.state.id}`,
                                        state: {stuName: this.state.data.name}
                                    }}>异动信息</Link>
                                </li>
                            </ol>
                        </nav>
                    </div>
                </div>
            )
        }

        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                    &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
                    <p className="d-inline text-muted">{this.state.data.name}</p>

                    <div className="btn-group float-right ml-4" role="group">
                        <PrevBtn id={this.state.id} ids={this.state.ids}/>
                        <NextBtn id={this.state.id} ids={this.state.ids}/>
                    </div>
                    <div className="btn-group float-right ml-4" role="group">
                        <button onClick={() => {
                            this.props.history.push('/home/sales/customer');
                        }} type="button" className="btn btn-light">返回
                        </button>
                    </div>
                    <div className="btn-group float-right" role="group">
                        <button onClick={this.addContract} type="button" className="btn btn-primary" id="btnChoose">
                            新增
                        </button>
                    </div>
                </h5>

                <div id="main" className="main p-3">
                    <div className="row justify-content-md-center mb-2">
                        <div className="col col-12">
                            <div className="card border-top-0">
                                <div className="card-body">
                                    <p className="ht pb-3 b-b">合同信息</p>
                                    <Table
                                        style={{width: '100%'}}
                                        columns={this.state.columns}
                                        data={this.state.contractList}
                                        border={true}
                                        fit={true}
                                        emptyText={"--"}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item" style={{"display":this.first}}><Link
                                to={`/home/sales/customer/student/${this.state.id}`}>学员信息</Link></li>
                            <li className="breadcrumb-item" style={{"display":this.second}}>
                                <Link to={{
                                    pathname: `/home/sales/customer/parent/${this.state.id}`,
                                    state: {stuName: this.state.data.name}
                                }}>家长信息</Link>
                            </li>
                            <li className="breadcrumb-item active" style={{"display":this.third}}>合同信息</li>
                            <li className="breadcrumb-item" style={{"display": this.fourth}}>
                                <Link to={{
                                    pathname: `/home/sales/customer/situation/${this.state.id}`,
                                    state: {stuName: this.state.data.name}
                                }}>异动信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.fifth}}>
                                <Link to={{
                                    pathname: `/home/sales/customer/account/${this.state.id}`,
                                    state: {stuName: this.state.data.name}
                                }}>账户信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.sixth}}>
                                <Link to={{
                                    pathname: `/home/sales/customer/class/${this.state.id}`,
                                    state: {stuName: this.state.data.name}
                                }}>班级信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.seventh}}>
                                <Link to={{
                                    pathname: `/home/sales/customer/charge/${this.state.id}`,
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

export default ContractView;