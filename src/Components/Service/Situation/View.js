import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress";
import Commands from "../../Commands/Commands";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import {formatWithTime} from "../../../utils/fmtDate";

const NextBtn = ({id, ids}) => {
    const curIndex = ids.indexOf(id);

    if ((curIndex + 1) === ids.length) {
        return <button type="button" className="btn btn-light" disabled={true}>下一条</button>
    }

    return (
        <Link
            className="btn btn-light"
            to={{
                pathname: `/home/service/through/${ids[curIndex + 1]}`,
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
                pathname: `/home/service/through/${ids[curIndex - 1]}`,
                state: {ids: ids}
            }}
        >
            上一条
        </Link>
    )
};

class View extends React.Component {
    constructor(props) {
        super(props);

        this.commands = this.props.commands.filter(command => (command.name !== 'Add'));
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            id: this.props.match.params.contractId,
            data: null,
            ids: []
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.modAction = this.modAction.bind(this);
        this.delAction = this.delAction.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let data = await ajax('/service/through/query.do', {id: this.state.id});
                let list = await ajax('/service/through/list.do', {id: this.state.id});
                const ids = list.data.items.map((contract) => (contract.id));
                this.setState({data: data.data, ids});
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
        this.props.history.push(`${this.props.match.url}/edit`, {ids: this.ids});
    }

    delAction() {
        const request = async () => {
            try {
                await ajax('/service/through/del.do', {id: this.state.id});
                this.setState({redirectToList: true});
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
                <Redirect to="/home/service/through"/>
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
                                this.props.history.push('/home/service/through');
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
                    <p className="d-inline text-muted">{this.state.data.stuName}</p>

                    <div className="btn-group float-right ml-4" role="group">
                        <PrevBtn id={this.state.id} ids={this.state.ids}/>
                        <NextBtn id={this.state.id} ids={this.state.ids}/>
                    </div>
                    <div className="btn-group float-right ml-4" role="group">
                        <button onClick={() => {
                            this.props.history.push('/home/service/through');
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
                    <Progress isAnimating={this.state.isAnimating}/>

                    <div className="row justify-content-md-center">
                        <div className="col col-12">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group row">
                                                <label className="col-2 col-form-label font-weight-bold">体验课场次</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.code}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-2 col-form-label font-weight-bold">状态</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.throughStatusName}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-2 col-form-label font-weight-bold">开始时间</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={formatWithTime(this.state.data.throughTime)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-2 col-form-label font-weight-bold">结束时间</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={formatWithTime(this.state.data.throughEndTime)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-2 col-form-label font-weight-bold">教室</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.room}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-2 col-form-label font-weight-bold">主教</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.mainTeacher}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-2 col-form-label font-weight-bold">助教</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.assistant}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-2 col-form-label font-weight-bold">课程顾问</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.adviser}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-2 col-form-label font-weight-bold">体验课人数</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.num}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb location_bottom">
                            <li className="breadcrumb-item active">体验课基本信息</li>
                            <li className="breadcrumb-item"><Link
                                to={{
                                    pathname: `/home/service/through/student/${this.state.id}`,
                                    state: {stuName: this.state.data.name}
                                }}>体验课学员信息</Link></li>
                        </ol>
                    </nav>
                </div>
            </div>
        )
    }
}

export default View;