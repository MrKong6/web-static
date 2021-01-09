import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Commands from "../../Commands/Commands";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";

const NextBtn = ({id, ids}) => {
    const curIndex = ids.indexOf(id);

    if ((curIndex + 1) === ids.length) {
        return <button type="button" className="btn btn-light" disabled={true}>下一条</button>
    }

    return (
        <Link
            className="btn btn-light"
            to={{
                pathname: `/home/service/customer/parent/${ids[curIndex + 1]}`,
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
                pathname: `/home/service/customer/parent/${ids[curIndex - 1]}`,
                state: {ids: ids}
            }}
        >
            上一条
        </Link>
    )
};

class ParentView extends React.Component {
    constructor(props) {
        super(props);

        let type = 1;
        if(this.props.location.state && this.props.location.state.type && this.props.location.state.type == 2){
            //从教学的我的班级的学员信息页面跳转而来
            type = this.props.location.state.type;
            this.commands = [];
            this.first = 'normal';
            this.second = 'normal';
            this.third = 'normal';
            this.fourth = 'normal';
            this.fifth = 'normal';
            this.sixth = 'normal'
            this.seventh = 'normal';
        }else{
            this.commands = this.props.commands.filter(command => (command.id === '3-2-1-2' || command.id === '3-2-1-3'));
            this.first = !(this.props.sonView.filter(view => (view.id == '3-2-1')) == false) ? 'normal' : 'none';
            this.second = !(this.props.sonView.filter(view => (view.id == '3-2-2')) == false) ? 'normal' : 'none';
            this.third = !(this.props.sonView.filter(view => (view.id == '3-2-3')) == false) ? 'normal' : 'none';
            this.fourth = !(this.props.sonView.filter(view => (view.id == '3-2-4')) == false) ? 'normal' : 'none';
            this.fifth = !(this.props.sonView.filter(view => (view.id == '3-2-5')) == false) ? 'normal' : 'none';
            this.sixth = !(this.props.sonView.filter(view => (view.id == '3-2-6')) == false) ? 'normal' : 'none'
            this.seventh = this.props.sonView && !(this.props.sonView.filter(view => (view.id == '3-2-7')) == false) ? 'normal' : 'none';

        }

        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            id: this.props.match.params.studentId,
            ids: [],
            data: {name: this.props.location.state.stuName},
            parentList: [],
            type: type,
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.modAction = this.modAction.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/service/customer/student/list.do', {orgId: this.state.group.id});
                let parentList = await ajax('/service/customer/parent/queryListByStudentId.do', {id: this.state.id});
                const ids = list.data.map((student) => (student.id));

                this.setState({ids, parentList});
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
        this.props.history.push(`${this.props.match.url}/edit`, {stuName: this.state.data.name});
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
                <Redirect to="/home/service/customer"/>
            )
        }

        if (!this.state.parentList.length) {
            return (
                <div>
                    <h5 id="subNav">
                        <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                        &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;

                        <div className="btn-group float-right ml-4" role="group">
                            <button onClick={() => {
                                this.props.history.push(`/home/service/customer`);
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
                            this.props.history.goBack();
                        }} type="button" className="btn btn-light">返回
                        </button>
                    </div>
                    <Commands
                        commands={this.commands}
                        modAction={this.modAction}
                    />
                </h5>

                <div id="main" className="main p-3">
                    <div className="row justify-content-md-center mb-2">
                        <div className="col col-12">
                            <div className="card border-top-0">
                                <div className="card-body">
                                    <p className="ht pb-3 b-b">家长信息</p>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">家长姓名</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.parentList[0].name}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">与孩子关系</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.parentList[0].relation}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">联系电话</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.parentList[0].cellphone}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">家庭住址</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.parentList[0].address}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">微信号</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.parentList[0].wechat}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">电子邮箱</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.parentList[0].email}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">家长姓名</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.parentList.length > 1 ? this.state.parentList[1].name : ""}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">与孩子关系</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.parentList.length > 1 ? this.state.parentList[1].relation : ""}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">联系电话</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.parentList.length > 1 ? this.state.parentList[1].cellphone : ""}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb location_bottom">
                            <li className="breadcrumb-item"style={{"display":this.first}}>
                                <Link
                                    to={{pathname: `/home/service/customer/student/${this.state.id}`,
                                        state: {stuName: this.state.data.name,type: this.state.type}}}>学员信息
                                </Link>
                            </li>
                            <li className="breadcrumb-item active" style={{"display":this.second}}>家长信息</li>
                            <li className="breadcrumb-item" style={{"display":this.third}}>
                                <Link to={{
                                    pathname: `/home/service/customer/contract/${this.state.id}`,
                                    state: {stuName: this.state.data.name,type: this.state.type}
                                }}>合同信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.fourth}}>
                                <Link to={{
                                    pathname: `/home/service/customer/account/${this.state.id}`,
                                    state: {stuName: this.state.data.name,type: this.state.type}
                                }}>账户信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.sixth}}>
                                <Link to={{
                                    pathname: `/home/service/customer/class/${this.state.id}`,
                                    state: {stuName: this.state.data.name,type: this.state.type}
                                }}>班级信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.fifth}}>
                                <Link to={{
                                    pathname: `/home/service/customer/situation/${this.state.id}`,
                                    state: {stuName: this.state.data.name,type: this.state.type}
                                }}>异动信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.seventh}}>
                                <Link to={{
                                    pathname: `/home/service/customer/charge/${this.state.id}`,
                                    state: {stuName: this.state.data.name,type: this.state.type}
                                }}>卡券信息</Link>
                            </li>
                        </ol>
                    </nav>
                </div>
            </div>
        )
    }
}

export default ParentView;