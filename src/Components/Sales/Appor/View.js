import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'
import {$} from '../../../vendor';

import ContactList from "../../Contact/List";
import DialogTips from "../../Dialog/DialogTips";
import DialogUser from '../../Dialog/DialogUser';
import Progress from "../../Progress/Progress";
import Commands from "../../Commands/Commands";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import {formatWithTime} from "../../../utils/fmtDate";
import config from "../../../utils/config";
import {Button, Input, Message, Tabs} from "element-react";
import "./Appor.css"

const NextBtn = ({id, ids, link}) => {
    const curIndex = ids.indexOf(id);

    if ((curIndex + 1) === ids.length) {
        return <button type="button" className="btn btn-light" disabled={true}>下一条</button>
    }

    return (
        <Link
            className="btn btn-light"
            to={{
                pathname: link + `/${ids[curIndex + 1]}`,
                state: {ids: ids}
            }}
        >
            下一条
        </Link>
    )
};

const PrevBtn = ({id, ids, link}) => {
    const curIndex = ids.indexOf(id);

    if (curIndex === 0) {
        return <button type="button" className="btn btn-light" disabled={true}>上一条</button>
    }

    return (
        <Link
            className="btn btn-light"
            to={{
                pathname: link + `/${ids[curIndex - 1]}`,
                state: {ids: ids}
            }}
        >
            上一条
        </Link>
    )
};

const EDIT_INPUT_CSS_NAME = "col-7";
const VIEW_INPUT_CSS_NAME = "col-7 txt";

class View extends React.Component {
    constructor(props) {
        super(props);
        this.commands = this.props.commands.filter(command => (command.name !== 'Add' && command.name !== 'Import' && command.name !== 'Export'));
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            id: this.props.match.params.opporId,
            data: null,
            ids: [],
            courseTypeList: [],
            courseList: [{id:1,name:'tab1'},{id:2,name:'tab2'}],
            courseTypeId: null,
            readOnlyFlag: true,  //控制学员主信息是否可编辑  true为只读  false为编辑
            readOnlyFlagTwo: true,  //控制下面机会信息是否可编辑  true为只读  false为编辑
            operationDel: "none",  //显示删除按钮
            operationEdit: "normal", //显示编辑按钮
            inputCssName: VIEW_INPUT_CSS_NAME, //查看时的样式
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.modAction = this.modAction.bind(this);
        this.delAction = this.delAction.bind(this);
        this.SignAction = this.SignAction.bind(this);
        this.assignAction = this.assignAction.bind(this);
        this.assignAccept = this.assignAccept.bind(this);
        this.thAction = this.thAction.bind(this);
        this.thActionAccept = this.thActionAccept.bind(this);

    }

    componentDidMount() {
        this.loadFilter();
        const request = async () => {
            try {
                let data = await ajax('/sales/oppor/query.do', {id: this.state.id});
                let list = await ajax('/sales/oppor/list.do', {
                    orgId: this.state.group.id,
                    typeId: 2,
                    pageNum: 1,
                    pageSize: 10,
                    fromWay: 3
                });
                const ids = list.data.map((leads) => (leads.id));
                if (data && data.courseId) {
                    data.courseId = Number(data.courseId);
                }

                this.setState({data, ids, courseTypeId: data.courseId});
                // this.changeCourseType(data.courseId);
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

    // 注：组件初始化时不调用，组件更新完成后调用，此时可以获取dom节点。
    componentDidUpdate(){
        //初始化按钮显示
        this.showStuInfo();
        this.showLeadsInfo();
    }

    //加载课程类别下拉列表
    loadFilter() {
        const request = async () => {
            try {
                let courseTypeList = await ajax('/course/type/courseTypeList.do');
                this.setState({courseTypeList: courseTypeList});
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
        // this.props.history.push(`${this.props.match.url}/edit`, {ids: this.ids});
    }

    delAction() {
        const request = async () => {
            try {
                await ajax('/sales/oppor/del.do', {id: this.state.id});
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

    SignAction() {
        this.props.history.push('/home/sales/contract/create', {data: this.state.data, oriId: this.state.id});
    }

    assignAction() {
        const defaults = {
            groupId: this.state.data.organizationId,
            groupName: this.state.data.organizationName,
            userId: this.state.data.executiveId,
            userName: this.state.data.executiveName,
        };
        this.userContainer = document.createElement('div');
        ReactDOM.render(
            <DialogUser
                accept={this.assignAccept}
                title={this.state.data.name}
                container={this.userContainer}
                defaults={defaults}
                replace={this.props.history.replace}
                from={this.props.location}
                path="/sales/oppor/listAssignableUsers.do"
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
                await ajax('/sales/oppor/assign.do', {id: this.state.id, assigneeId: selected.user.id, type: 2});
                let data = Object.assign({}, this.state.data);

                data.organizationId = selected.group.id;
                data.organizationName = selected.group.name;
                data.executiveId = selected.user.id;
                data.executiveName = selected.user.name;
                this.setState({data})
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

    thAction() {
        const defaults = {
            groupId: this.state.data.organizationId,
            groupName: this.state.data.organizationName,
            userId: this.state.data.executiveId,
            userName: this.state.data.executiveName,
            type: 30
        };
        this.userContainer = document.createElement('div');
        ReactDOM.render(
            <DialogUser
                accept={this.thActionAccept}
                title={this.state.data.name}
                container={this.userContainer}
                defaults={defaults}
                replace={this.props.history.replace}
                from={this.props.location}
                path="/service/through/list.do"
                ref={(dom) => {
                    this.user = dom
                }}
            />,
            document.body.appendChild(this.userContainer)
        );

        this.user.dialog.modal('show');
    }

    thActionAccept(selected) {
        const request = async () => {
            try {
                await ajax('/sales/oppor/thAssign.do', {id: this.state.id, throughId: selected.throughId, type: 1});
                Message({
                    message: "成功",
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
        request()
    }

    changeCourseType(value) {
        if (value.props) {
            this.setState({courseTypeId: value.props.name + ""});
        } else {
            this.setState({courseTypeId: value + ""});
        }
        this.state.courseTypeList.map(item => {
            if (this.state.data.courseTypeId + "" == value + "") {
                $("#" + item.id).show();
            } else {
                $("#" + item.id + "hide").show();
            }
        });
    }

    //改变data-student的值
    changeStuValue(key, value) {
        let data = this.state.data;
        data[key] = value;
        this.setState({data})
    }

    //改变data-parent的值
    changeParValue(key, value) {
        let data = this.state.data;
        if (!data || !data.parent) {
            data = {"parent": {}};
        }
        data.parent[key] = value;
        this.setState({data})
    }

    //操作学员信息  1编辑  2保存  3删除
    operationStuInfo(type){
        if(type == 1){
            this.setState({readOnlyFlag: false, inputCssName: EDIT_INPUT_CSS_NAME});
        }else if(type == 3){
            this.setState({readOnlyFlag: true, inputCssName: VIEW_INPUT_CSS_NAME});
        }
    }
    //基本信息部分改变dom-button
    showStuInfo(){
        if(!this.state.readOnlyFlag){
            $("#operationDel").show();
            $("#operationEdit").hide();
        }else{
            $("#operationDel").hide();
            $("#operationEdit").show();
        }
    }

    //下面机会信息改变dom-button
    showLeadsInfo(){
        if(!this.state.readOnlyFlagTwo){
            $("#operationDelTwo").show();
            $("#operationEditTwo").hide();
        }else{
            $("#operationDelTwo").hide();
            $("#operationEditTwo").show();
        }
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
        let link = "/home/sales/oppor";
        let that = this;
        if (this.props.location.pathname.indexOf("opporpublic") != -1) {
            link = "/home/sales/opporpublic";
        }

        if (this.state.redirectToList) {
            return (
                <Redirect to={link}/>
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
                                this.props.history.push(link);
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
                    <p className="d-inline text-muted">{this.state.data ? this.state.data.name : ''}</p>

                    <div className="btn-group float-right ml-4" role="group">
                        <PrevBtn id={this.state.id} ids={this.state.ids} link={link}/>
                        <NextBtn id={this.state.id} ids={this.state.ids} link={link}/>
                    </div>
                    <div className="btn-group float-right ml-4" role="group">
                        <button onClick={() => {
                            this.props.history.push(link);
                        }} type="button" className="btn btn-light">返回
                        </button>
                    </div>
                    <Commands
                        commands={this.commands}
                        modAction={this.modAction}
                        delAction={this.delAction}
                        assignAction={this.assignAction}
                        SignAction={this.SignAction}
                        thAction={this.thAction}
                    />
                </h5>

                <div id="main" className="main p-3">
                    <Progress isAnimating={this.state.isAnimating}/>

                    <div className="row justify-content-md-center">
                        <div className="col col-8">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12">
                                        <div className="row">
                                            <div id="operationEdit" class="rightBtn1">
                                                <Button type="text" style={{"marginLeft":"26px"}} onClick={this.operationStuInfo.bind(this,1)}><i className="el-icon-edit el-icon-right"></i> &nbsp;&nbsp;编辑</Button>
                                            </div>
                                            <div id="operationDel" class="rightBtn2">
                                                <Button type="text" style={{"marginLeft":"26px"}} onClick={this.operationStuInfo.bind(this,2)}><i className="el-icon-document el-icon-right"></i> &nbsp;&nbsp;保存</Button>
                                                <Button type="text" style={{"marginLeft":"26px"}} onClick={this.operationStuInfo.bind(this,3)}><i className="el-icon-close el-icon-right"></i> &nbsp;&nbsp;取消</Button>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">学员姓名</label>
                                                    <div className={this.state.inputCssName}>
                                                        <Input
                                                            type="text"
                                                            readOnly={this.state.readOnlyFlag}
                                                            onChange={this.changeStuValue.bind(this, "name")}
                                                            value={this.state.data ? this.state.data.name : null}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">学员性别</label>
                                                    <div className={this.state.inputCssName}>
                                                        <Input
                                                            type="text"
                                                            readOnly={this.state.readOnlyFlag}
                                                            onChange={this.changeStuValue.bind(this, "genderText")}
                                                            value={this.state.data ? this.state.data.genderText : ''}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">学员年龄</label>
                                                    <div className={this.state.inputCssName}>
                                                        <Input
                                                            type="text"
                                                            readOnly={this.state.readOnlyFlag}
                                                            onChange={this.changeStuValue.bind(this, "age")}
                                                            value={this.state.data ? this.state.data.age : ''}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">在读年级</label>
                                                    <div className={this.state.inputCssName}>
                                                        <Input
                                                            type="text"
                                                            readOnly={this.state.readOnlyFlag}
                                                            onChange={this.changeStuValue.bind(this, "classGrade")}
                                                            value={this.state.data ? this.state.data.classGrade !== 'null' ? this.state.data.classGrade : '' : ''}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">所在学校</label>
                                                    <div className={this.state.inputCssName}>
                                                        <Input
                                                            type="text"
                                                            readOnly={this.state.readOnlyFlag}
                                                            onChange={this.changeStuValue.bind(this, "schoolName")}
                                                            value={this.state.data ? this.state.data.schoolName : ''}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">家长姓名</label>
                                                    <div className={this.state.inputCssName}>
                                                        <Input
                                                            type="text"
                                                            readOnly={this.state.readOnlyFlag}
                                                            onChange={this.changeParValue.bind(this, "name")}
                                                            value={this.state.data && this.state.data.parent ? this.state.data.parent.name : ''}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">与孩子关系</label>
                                                    <div className={this.state.inputCssName}>
                                                        <Input
                                                            type="text"
                                                            readOnly={this.state.readOnlyFlag}
                                                            onChange={this.changeParValue.bind(this, "relation")}
                                                            value={this.state.data && this.state.data.parent ? this.state.data.parent.relation : ''}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">联系电话</label>
                                                    <div className={this.state.inputCssName}>
                                                        <Input
                                                            type="text"
                                                            readOnly={this.state.readOnlyFlag}
                                                            onChange={this.changeParValue.bind(this, "cellphone")}
                                                            value={this.state.data && this.state.data.parent ? this.state.data.parent.cellphone : ''}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">微信号</label>
                                                    <div className={this.state.inputCssName}>
                                                        <Input
                                                            type="text"
                                                            readOnly={this.state.readOnlyFlag}
                                                            onChange={this.changeParValue.bind(this, "wechat")}
                                                            value={this.state.data && this.state.data.parent ? this.state.data.parent.wechat : ''}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">家庭住址</label>
                                                    <div className={this.state.inputCssName}>
                                                        <Input
                                                            type="text"
                                                            readOnly={this.state.readOnlyFlag}
                                                            onChange={this.changeParValue.bind(this, "address")}
                                                            value={this.state.data && this.state.data.parent ? this.state.data.parent.address : ''}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                       {/* <Tabs onTabClick={this.changeCourseType.bind(this)}>onTabClick={ (tab) => console.log(tab.props.name) }
                                            {
                                                this.state.courseTypeList.map(item => {
                                                    return <Tabs.Pane label={item.name} name={item.id}>
                                                        <div className="row" id={item.id + ""}>
                                                            <div className="col">
                                                                <div className="form-group row">
                                                                    <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                                                                    <div className="col-7">
                                                                        <input
                                                                            type="text"
                                                                            readOnly={true}
                                                                            className="form-control-plaintext"
                                                                            value={this.state.data ? this.state.data.sourceName : ''}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-5 col-form-label font-weight-bold">具体渠道</label>
                                                                    <div className="col-7">
                                                                        <input
                                                                            type="text"
                                                                            readOnly={true}
                                                                            className="form-control-plaintext"
                                                                            value={this.state.data ? this.state.data.channelName : ''}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col">
                                                                <div className="form-group row">
                                                                    <label className="col-5 col-form-label font-weight-bold">类型</label>
                                                                    <div className="col-7">
                                                                        <input
                                                                            type="text"
                                                                            readOnly={true}
                                                                            className="form-control-plaintext"
                                                                            value={this.state.data ? config.TYPE_ID[this.state.data.typeId] : ''}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-5 col-form-label font-weight-bold">阶段</label>
                                                                    <div className="col-7">
                                                                        <input
                                                                            type="text"
                                                                            readOnly={true}
                                                                            className="form-control-plaintext"
                                                                            value={this.state.data ? this.state.data.stageName : ''}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-5 col-form-label font-weight-bold">状态</label>
                                                                    <div className="col-7">
                                                                        <input
                                                                            type="text"
                                                                            readOnly={true}
                                                                            className="form-control-plaintext"
                                                                            value={this.state.data ? this.state.data.statusName : ''}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col">
                                                                <div className="form-group row">
                                                                    <label className="col-5 col-form-label font-weight-bold">所属组织</label>
                                                                    <div className="col-7">
                                                                        <input
                                                                            type="text"
                                                                            readOnly={true}
                                                                            className="form-control-plaintext"
                                                                            value={this.state.data ? this.state.data.organizationName : ''}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-5 col-form-label font-weight-bold">所属用户</label>
                                                                    <div className="col-7">
                                                                        <input
                                                                            type="text"
                                                                            readOnly={true}
                                                                            className="form-control-plaintext"
                                                                            value={this.state.data ? this.state.data.executiveName : ''}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="col">
                                                                <div className="form-group row">
                                                                    <label className="col-5 col-form-label font-weight-bold">创建人</label>
                                                                    <div className="col-7">
                                                                        <input
                                                                            type="text"
                                                                            readOnly={true}
                                                                            className="form-control-plaintext"
                                                                            value={this.state.data ? this.state.data.creatorName : ''}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="form-group row">
                                                                    <label className="col-5 col-form-label font-weight-bold">创建时间</label>
                                                                    <div className="col-7">
                                                                        <input
                                                                            type="text"
                                                                            readOnly={true}
                                                                            className="form-control-plaintext"
                                                                            value={this.state.data ? formatWithTime(this.state.data.createTime) : ''}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="row" id={item.id + "hide"}>
                                                            <label>该类别下暂无信息</label>
                                                        </div>
                                                    </Tabs.Pane>
                                                })
                                            }
                                        </Tabs>*/}
                                    </div>
                                </div>
                            </div>
                            <div className="card" style={{"marginTop":"10px"}}>
                                <div className="card-body">
                                    <div className="row">
                                        <div id="operationEditTwo" className="rightBtn1">
                                            <Button type="text" style={{"marginLeft": "26px"}} onClick={this.operationStuInfo.bind(this, 1)}><i className="el-icon-edit el-icon-right"></i> &nbsp;&nbsp;编辑</Button>
                                        </div>
                                        <div id="operationDelTwo" className="rightBtn2">
                                            <Button type="text" style={{"marginLeft": "26px"}} onClick={this.operationStuInfo.bind(this, 2)}><i className="el-icon-document el-icon-right"></i> &nbsp;&nbsp;保存</Button>
                                            <Button type="text" style={{"marginLeft": "26px"}} onClick={this.operationStuInfo.bind(this, 3)}><i className="el-icon-close el-icon-right"></i> &nbsp;&nbsp;取消</Button>
                                        </div>
                                    </div>
                                    <Tabs type={"card"}>{/*onTabClick={ (tab) => console.log(tab.props.name) }*/}
                                        {
                                            this.state.data.courseTypes ? this.state.data.courseTypes.map(item => {
                                                return <Tabs.Pane label={item.name} name={item.id}>
                                                    {
                                                        <Tabs>{/*onTabClick={ (tab) => console.log(tab.props.name) }*/}
                                                            {
                                                                item.courses ? item.courses.map(vo => {
                                                                    return <Tabs.Pane label={vo.name} name={vo.id}>
                                                                        <div>
                                                                            <div className="row" id={item.id + ""}>
                                                                                <div className="col">
                                                                                    <div className="form-group row">
                                                                                        <label className="col-5 col-form-label font-weight-bold">信息来源</label>
                                                                                        <div className="col-7">
                                                                                            <input
                                                                                                type="text"
                                                                                                readOnly={true}
                                                                                                className="form-control-plaintext"
                                                                                                value={vo.leadsInfo ? vo.leadsInfo.sourceName : ''}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="form-group row">
                                                                                        <label className="col-5 col-form-label font-weight-bold">具体渠道</label>
                                                                                        <div className="col-7">
                                                                                            <input
                                                                                                type="text"
                                                                                                readOnly={true}
                                                                                                className="form-control-plaintext"
                                                                                                value={vo.leadsInfo ? vo.leadsInfo.channelName : ''}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col">
                                                                                    <div className="form-group row">
                                                                                        <label className="col-5 col-form-label font-weight-bold">类型</label>
                                                                                        <div className="col-7">
                                                                                            <input
                                                                                                type="text"
                                                                                                readOnly={true}
                                                                                                className="form-control-plaintext"
                                                                                                value={vo.leadsInfo ? config.TYPE_ID[vo.leadsInfo.typeId] : ''}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="form-group row">
                                                                                        <label className="col-5 col-form-label font-weight-bold">阶段</label>
                                                                                        <div className="col-7">
                                                                                            <input
                                                                                                type="text"
                                                                                                readOnly={true}
                                                                                                className="form-control-plaintext"
                                                                                                value={vo.leadsInfo ? vo.leadsInfo.stageName : ''}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="form-group row">
                                                                                        <label className="col-5 col-form-label font-weight-bold">状态</label>
                                                                                        <div className="col-7">
                                                                                            <input
                                                                                                type="text"
                                                                                                readOnly={true}
                                                                                                className="form-control-plaintext"
                                                                                                value={vo.leadsInfo ? vo.leadsInfo.statusName : ''}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col">
                                                                                    <div className="form-group row">
                                                                                        <label className="col-5 col-form-label font-weight-bold">所属组织</label>
                                                                                        <div className="col-7">
                                                                                            <input
                                                                                                type="text"
                                                                                                readOnly={true}
                                                                                                className="form-control-plaintext"
                                                                                                value={vo.leadsInfo ? vo.leadsInfo.organizationName : ''}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="form-group row">
                                                                                        <label className="col-5 col-form-label font-weight-bold">所属用户</label>
                                                                                        <div className="col-7">
                                                                                            <input
                                                                                                type="text"
                                                                                                readOnly={true}
                                                                                                className="form-control-plaintext"
                                                                                                value={vo.leadsInfo ? vo.leadsInfo.executiveName : ''}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="col">
                                                                                    <div className="form-group row">
                                                                                        <label className="col-5 col-form-label font-weight-bold">创建人</label>
                                                                                        <div className="col-7">
                                                                                            <input
                                                                                                type="text"
                                                                                                readOnly={true}
                                                                                                className="form-control-plaintext"
                                                                                                value={vo.leadsInfo ? vo.leadsInfo.creatorName : ''}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="form-group row">
                                                                                        <label className="col-5 col-form-label font-weight-bold">创建时间</label>
                                                                                        <div className="col-7">
                                                                                            <input
                                                                                                type="text"
                                                                                                readOnly={true}
                                                                                                className="form-control-plaintext"
                                                                                                value={vo.leadsInfo ? formatWithTime(vo.leadsInfo.createTime) : ''}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </Tabs.Pane>
                                                                }) : null
                                                            }
                                                        </Tabs>
                                                    }
                                                </Tabs.Pane>
                                            }) : null
                                        }
                                    </Tabs>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <ContactList
                                id={this.state.id}
                                canEdit={false}
                                groupName={this.state.data.organizationName}
                                userName={this.state.data.executiveName}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default View;