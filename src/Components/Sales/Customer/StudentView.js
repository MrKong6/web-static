import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Commands from "../../Commands/Commands";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import fmtDate from "../../../utils/fmtDate";
import CONFIG from "../../../utils/config";
import calculateAge from "../../../utils/calculateAge";
import {Message} from "element-react";

const NextBtn = ({id, ids}) => {
    const curIndex = ids.indexOf(id);

    if ((curIndex + 1) === ids.length) {
        return <button type="button" className="btn btn-light" disabled={true}>下一条</button>
    }

    return (
        <Link
            className="btn btn-light"
            to={{
                pathname: `/home/sales/customer/student/${ids[curIndex + 1]}`,
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
                pathname: `/home/sales/customer/student/${ids[curIndex - 1]}`,
                state: {ids: ids}
            }}
        >
            上一条
        </Link>
    )
};

class StudentView extends React.Component {
    constructor(props) {
        super(props);
        debugger
        this.commands = this.props.commands.filter(command => (command.id === '2-3-1-2' || command.id === '2-3-1-3'));
        this.first = !(this.props.sonView.filter(view => (view.id == '2-3-1')) == false) ? 'normal' : 'none';
        this.second = !(this.props.sonView.filter(view => (view.id == '2-3-2')) == false) ? 'normal' : 'none';
        this.third = !(this.props.sonView.filter(view => (view.id == '2-3-3')) == false) ? 'normal' : 'none';
        this.fourth = !(this.props.sonView.filter(view => (view.id == '2-3-5')) == false) ? 'normal' : 'none';
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            id: this.props.match.params.studentId,
            ids: [],
            data: null,
            contractList: [],
            parentList: []
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.modAction = this.modAction.bind(this);
        this.delAction = this.delAction.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/sales/customer/student/list.do', {orgId: this.state.group.id});
                let data = await ajax('/sales/customer/student/query.do', {id: this.state.id});
                let contractList = await ajax('/sales/contract/queryListByStudentId.do', {id: this.state.id});
                let parentList = await ajax('/sales/customer/parent/queryListByStudentId.do', {id: this.state.id});
                const ids = list.data ? list.data.map((student) => (student.id)) : [];

                this.setState({data, ids, contractList, parentList});
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

    modAction() {
        this.props.history.push(`${this.props.match.url}/edit`);
    }

    delAction() {
        const request = async () => {
            try {
                await ajax('/sales/customer/student/del.do', {id: this.state.id});
                this.props.history.push('/home/sales/customer');
                Message({
                    message: "已删除",
                    type: 'info'
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
                <Redirect to="/home/sales/customer"/>
            )
        }

        if (!this.state.data) {
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
                    <Commands
                        commands={this.commands}
                        modAction={this.modAction}
                        delAction={this.delAction}
                    />
                </h5>

                <div id="main" className="main p-3">
                    <div className="row justify-content-md-center mb-2">
                        <div className="col col-12">
                            <div className="card border-top-0">
                                <div className="card-body">
                                    <p className="ht pb-3 b-b">学员信息</p>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">学员姓名</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.name}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">学员性别</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.genderText}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">出生年月</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={fmtDate(this.state.data.birthday)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">学员年龄</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={calculateAge(new Date(this.state.data.birthday))}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">在读年级</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.classGrade}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">所在学校</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.schoolName}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">证件类型</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={CONFIG.DOCUMENT[this.state.data.idType]}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">证件号码</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.idCode}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col"/>
                                        <div className="col"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item active" style={{"display":this.first}}>学员信息</li>
                            <li className="breadcrumb-item" style={{"display":this.second}}>
                                <Link to={{
                                    pathname: `/home/sales/customer/parent/${this.state.id}`,
                                    state: {stuName: this.state.data.name}
                                }}>家长信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.third}}>
                                <Link to={{
                                    pathname: `/home/sales/customer/contract/${this.state.id}`,
                                    state: {stuName: this.state.data.name}
                                }}>合同信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.fourth}}>
                                <Link to={{
                                    pathname: `/home/sales/customer/situation/${this.state.id}`,
                                    state: {stuName: this.state.data.name}
                                }}>异动信息</Link>
                            </li>
                            {/*<li className="breadcrumb-item" style={{"display":this.fourth}}>
                                <Link to={{
                                    pathname: `/home/sales/customer/account/${this.state.id}`,
                                    state: {stuName: this.state.data.name}
                                }}>账户信息</Link>
                            </li>*/}
                        </ol>
                    </nav>
                </div>
            </div>
        )
    }
}

export default StudentView;