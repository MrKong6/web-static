import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'
import {$} from '../../vendor';

import DialogTips from "../Dialog/DialogTips";
import DialogUser from '../Dialog/DialogUser';
import Progress from "../Progress/Progress";
import Commands from "../Commands/Commands";

import fmtTitle from "../../utils/fmtTitle";
import ajax from "../../utils/ajax";
import mainSize from "../../utils/mainSize";
import {formatWithTime} from "../../utils/fmtDate";
import config from "../../utils/config";
import {Button, DatePicker, Dialog, Form, Input, Message, Popover, Select, Tabs} from "element-react";
// import "./Appor.css"
import Source from "./Source";
import ActHouver from "./ActHouver";
import Stages from "./Stages";
import Status from "./Status";
import CourseType from "./CourseType";
import CourseName from "./CourseName";
import Gender from "./Gender";
import Age from "./Age";
import Grade from "./Grade";
import Relation from "./Relation";
import ContactList from "../Contact/List";

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
        this.title = fmtTitle(this.props.pathName);
        this.commands = this.props.commands;
        debugger
        this.state = {
            group: this.props.group,
            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            id: this.props.opporId,
            data: null,
            ids: [],
            courseTypeList: [],
            courseList: [{id:1,name:'tab1'},{id:2,name:'tab2'}],
            courseTypeId: null,
            readOnlyFlag: true,  //控制学员主信息是否可编辑  true为只读  false为编辑
            opporReadOnly: true,  //控制下面机会信息是否可编辑  true为只读  false为编辑
            operationDel: "none",  //显示删除按钮
            operationEdit: "normal", //显示编辑按钮
            inputCssName: VIEW_INPUT_CSS_NAME, //查看时的样式
            typeId: this.props.typeId, //机会、线索、访客类型
            fromWay: this.props.fromWay,
            title: this.props.typeId == 1 ? "线索" : (this.props.typeId == 2 ? "机会" : "访客"),
            editVo: {}
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.modAction = this.modAction.bind(this);
        this.delAction = this.delAction.bind(this);
        this.SignAction = this.SignAction.bind(this);
        this.assignAction = this.assignAction.bind(this);
        this.assignAccept = this.assignAccept.bind(this);
        this.thAction = this.thAction.bind(this);
        this.thActionAccept = this.thActionAccept.bind(this);
        this.convertAction = this.convertAction.bind(this);
        this.convertAccept = this.convertAccept.bind(this);
        this.changeOneTab = this.changeOneTab.bind(this);
        this.assignAcceptOppor = this.assignAcceptOppor.bind(this);
        this.back = this.back.bind(this);

    }

    componentDidMount() {
        this.loadFilter();
        this.queryOpporInfo();
        this.queryLstInfo();
        mainSize();
        $("#addView").hide();
        $("#editView").hide();
    }
    //获取机会详情信息by id
    queryOpporInfo(){
        const request = async () => {
            try {
                let data = await ajax('/sales/oppor/queryById.do', {id: this.state.id, typeId:this.state.typeId});
                if (data && data.courseId) {
                    data.courseId = Number(data.courseId);
                }
                let oneTab = {},twoTab = {}, editVo={};
                if(data && data.courseTypes && data.courseTypes.length > 0){
                    oneTab = {"name":data.courseTypes[0].name,"id":data.courseTypes[0].id};
                    if(data.courseTypes[0].courses){
                        twoTab = {"name":data.courseTypes[0].courses[0].name,"id":data.courseTypes[0].courses[0].id};
                        editVo = data.courseTypes[0].courses[0].leadsInfo;
                    }
                }
                this.setState({data, courseTypeId: data.courseId,oneTab,twoTab,editVo});
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    this.createDialogTips(`${err.errCode}: ${err.errText}`);
                }
            }
        };

        request();
    }

    //获取列表信息  供翻页使用
    queryLstInfo(){
        const request = async () => {
            try {
                let list = await ajax('/sales/oppor/list.do', {
                    orgId: this.props.group.id,
                    typeId: this.props.typeId,
                    pageNum: 1,
                    pageSize: 10,
                    fromWay: this.state.fromWay
                });
                if(list.data && list.data.length > 0){
                    const ids = list.data.map((leads) => (leads.id));
                    this.setState({ids});
                }
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

    componentWillUnmount(){
        this.setState = (state, callback) => {
            return;
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
    //删除机会、线索、访客
    delAction() {
        const request = async () => {
            try {
                await ajax('/sales/oppor/delLead.do', {id: this.state.editVo.id});
                this.props.back();
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

    //创建合同
    SignAction() {
        this.state.data.courseId = this.state.twoTab.id;
        debugger
        this.state.data.orgId = this.state.editVo.organizationId;
        this.state.data.orgName = this.state.editVo.organizationName;
        this.props.SignAction(this.state.data,this.state.editVo.id);
    }

    //机会、线索 - 分配给弹框展示
    assignAction() {
        if(this.state.typeId == 4){
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
                    accept={this.assignAcceptOppor}
                    title="转移到"
                    container={this.userContainer}
                    defaults={defaults}
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
        }else{
            const defaults = {
                groupId: this.state.group.id,
                groupName: this.state.group.name,
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
    }
    /**
     * 转移给确认
     * @param selected
     */
    assignAcceptOppor(selected) {
        const request = async () => {
            try {
                let chooseIds = [];
                chooseIds.push(this.state.editVo.id);
                const param={ids: chooseIds, type: (selected.typeId ? selected.typeId : 1)};
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
            }
        };

        request()
    }
    //机会、线索 -分配给回调函数
    assignAccept(selected) {
        this.setState({isAnimating: true});
        const request = async () => {
            try {
                await ajax('/sales/oppor/assign.do', {id: this.state.editVo.id, assigneeId: selected.user.id, type: this.state.typeId});
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
    //线索 -转化为
    convertAction() {
        const defaults = {
            groupId: this.state.group.id,
            groupName: this.state.group.name,
            userId: this.state.data.executiveId,
            userName: this.state.data.executiveName,
        };
        this.userContainer = document.createElement('div');
        ReactDOM.render(
            <DialogUser
                accept={this.convertAccept}
                title={this.state.data.name}
                container={this.userContainer}
                defaults={defaults}
                typeName={this.state.typeId}
                from={this.props.location}
                path="/mkt/leads/listAssignableUsers.do"
                ref={(dom) => {
                    this.user = dom
                }}
            />,
            document.body.appendChild(this.userContainer)
        );

        this.user.dialog.modal('show');
    }
    //线索 -转化为
    convertAccept(selected) {
        this.setState({isAnimating: true});
        const request = async () => {
            try {
                await ajax('/mkt/leads/convert.do', {id: this.state.editVo.id, assigneeId: selected.user.id});
                this.setState({redirectToConvert: true});
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
                await ajax('/sales/oppor/thAssign.do', {id: this.state.editVo.id, throughId: selected.throughId, type: 1, orgId: this.state.group.id});
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
        // if(type == 1){
        //     this.setState({readOnlyFlag: false, inputCssName: EDIT_INPUT_CSS_NAME});
        // }else if(type == 3){
        //     this.setState({readOnlyFlag: true, inputCssName: VIEW_INPUT_CSS_NAME});
        // }
        if(type == 1){
            this.setState({showStuDialog: true},() => {
                this.form3.studentName.value = this.state.data.name;
                this.form3.studentGenderId.value = this.state.data.genderId || '';
                if (this.state.data.age) {
                    let split = [];
                    split = this.state.data.age.split(".");
                    this.form3.studentAgeYear.value = (split[0]);
                    this.form3.studentAgeMonth.value = (split[1]);
                }
                this.form3.classGrade.value = this.state.data.classGrade;
                this.form3.schoolName.value = this.state.data.schoolName;
                this.form3.parentName.value = this.state.data.parent ? this.state.data.parent.name : '';
                this.form3.relation.value = this.state.data.parent ? this.state.data.parent.relation : '';
                this.form3.cellphone.value = this.state.data.parent ? this.state.data.parent.cellphone : '';
                this.form3.wechat.value = this.state.data.parent ? this.state.data.parent.wechat : '';
                this.form3.address.value = this.state.data.parent ? this.state.data.parent.address : '';
                // this.form3.note.value = this.state.data.note;
            });
        }
    }
    //操作学员信息  基本信息部分改变dom-button
    showStuInfo(){
        if(!this.state.readOnlyFlag){
            $("#operationDel").show();
            $("#operationEdit").hide();
        }else{
            $("#operationDel").hide();
            $("#operationEdit").show();
        }
    }
    //编辑机会学员信息  1编辑
    operationOpporInfo(type){
        let query = {};
        for (let i = 0; i < this.form3.length; i++) {
            if (this.form3[i].tagName !== 'BUTTON' && !this.form3[i].readOnly) {
                query[this.form3[i].name] = this.form3[i].value;
            }
        }
        query.id=this.state.data.id;
        if(this.state.data.parent){
            query.parentId=this.state.data.parent.id;
        }
        const request = async () => {
            try {
                let rs = await ajax('/sales/oppor/modStuInfoById.do', query);
                //重新加载信息
                this.queryOpporInfo();
                //关闭弹出框
                this.setState({showStuDialog: false,editVo:{}});
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
    //下面机会信息改变dom-button
    showLeadsInfo(){
        if(!this.state.opporReadOnly){
            $("#operationDelTwo").show();
            $("#operationEditTwo").hide();
        }else{
            $("#operationDelTwo").hide();
            $("#operationEditTwo").show();
        }
    }
    //添加线索/机会/访客 弹框展示
    addLeads(type){
        if(type == 1){
            //新增弹出框
            this.setState({showDialog: true});
            $("#addView").show();
            $("#editView").hide();
        }else{
            //若是访客 到了机会阶段则不能编辑
            if(this.state.typeId != this.state.editVo.typeId){
                Message({
                    type: 'error',
                    message: '该条记录已无法编辑'
                });
                return;
            }
            //编辑弹出框
            $("#addView").hide();
            $("#editView").show();
            this.setState({showEditDialog: true},() => {
                this.form2.sourceId.value = Number(this.state.editVo.sourceId);
                this.form2.stageId.value = this.state.editVo.stageId;
                this.form2.statusId.value = this.state.editVo.statusId;
                debugger
                this.form2.courseTypeId.value = this.state.editVo.courseTypeId;
                this.form2.courseId.value = this.state.editVo.courseId;
                this.setState({
                    channelId: this.state.editVo.channelId,
                    channelText: this.state.editVo.channelName
                })
            });
        }
    }
    //添加线索/机会/访客 type:1新增 2编辑
    addLeadsReq(type){
        let query = {};

        if(type == 2){
            query.fromWay = null;//防止误更新
            query.id = this.state.editVo.id;
            query.courseId = this.state.editVo.courseId;
            for (let i = 0; i < this.form2.length; i++) {
                if (this.form2[i].tagName !== 'BUTTON' && !this.form2[i].readOnly) {
                    query[this.form2[i].name] = this.form2[i].value;
                }
            }
        }else{
            query.fromWay = this.state.fromWay;
            for (let i = 0; i < this.form.length; i++) {
                if (this.form[i].tagName !== 'BUTTON' && !this.form[i].readOnly) {
                    query[this.form[i].name] = this.form[i].value;
                }
            }
        }

        query.orgId = this.state.group.id;
        query.studentId= this.state.data.id;
        if(this.state.data.parent){
            query.parentId= this.state.data.parent.id;
        }
        query.typeId = this.state.typeId;

        const request = async () => {
            try {
                let rs = await ajax('/sales/oppor/addLead.do', query);
                //重新加载信息
                this.queryOpporInfo();
                //关闭弹出框
                this.setState({showDialog: false,showEditDialog: false,editVo:{}});
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
    //切换课程类别/阶段
    changeOneTab(tab,type){
        if(type == 1){
            // 课程类别
            this.setState({oneTab:{name:tab.props.label,id:tab.props.name}});
        }else{
            // 课程阶段
            this.state.data.courseTypes.map(item => {
                if(item.id == this.state.oneTab.id){
                    item.courses.map(vo => {
                        if(vo.id == tab.props.name){
                            this.setState({twoTab: {name:tab.props.label,id:tab.props.name}, editVo: vo.leadsInfo});
                        }
                    });
                }
            });
        }
    }
    //返回
    back(){
        this.props.back();
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

        if (!this.state.data) {
            return (
                <div>
                    <div id="subNav">
                        <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                        &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;

                        <div className="btn-group flolat-right ml-4" role="group">
                            <button onClick={this.back} type="button" className="btn btn-light">返回
                            </button>
                        </div>
                    </div>
                    <h5 id="secondSubNav">
                        <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                        &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
                        <p className="d-inline text-muted">{this.state.data ? this.state.data.name : ''}</p>

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
                        <PrevBtn id={this.state.id} ids={this.state.ids} link={this.props.link}/>
                        <NextBtn id={this.state.id} ids={this.state.ids} link={this.props.link}/>
                    </div>
                    <div className="btn-group float-right ml-4" role="group">
                        <button onClick={this.back} type="button" className="btn btn-light">返回
                        </button>
                    </div>
                </h5>
                <h5 id="secondSubNav">
                    <p className="d-inline text-muted">{this.state.data ? this.state.data.name : ''}</p>
                    {
                        this.state.typeId == 1 ?
                            <Commands
                                commands={this.commands}
                                modAction={this.modAction}
                                delAction={this.delAction}
                                assignAction={this.assignAction}
                                convertAction={this.convertAction}
                            />
                            :
                            (
                                this.state.typeId == 2 ?
                                    <Commands
                                        commands={this.commands}
                                        modAction={this.modAction}
                                        delAction={this.delAction}
                                        assignAction={this.assignAction}
                                        SignAction={this.SignAction}
                                        thAction={this.thAction}
                                    />
                                    :
                                    <Commands
                                        commands={this.commands}
                                        modAction={this.modAction}
                                        delAction={this.delAction}
                                        assignAction={this.assignAction}
                                        convertAction={this.convertAction}
                                    />
                            )
                    }

                </h5>

                <div id="main" className="main p-3">
                    <Progress isAnimating={this.state.isAnimating}/>

                    <div className="row justify-content-md-center">
                        <div className="col col-8">
                            <div className="card">
                                <div className="card-body">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-2 fontTitle">{this.state.title + '信息'}</div>
                                            <div className="col-7"></div>
                                            <div id="operationEdit" className="col-3 rightButton">
                                                <Button type="text" style={{"marginLeft":"26px"}} onClick={this.operationStuInfo.bind(this,1)}><i className="el-icon-edit el-icon-right"></i> &nbsp;&nbsp;编辑</Button>
                                            </div>
                                            <div id="operationDel" className="col-3 rightButton">
                                                <Button type="text" style={{"marginLeft":"26px"}} onClick={this.operationStuInfo.bind(this,2)}><i className="el-icon-document el-icon-right"></i> &nbsp;&nbsp;保存</Button>
                                                <Button type="text" style={{"marginLeft":"26px"}} onClick={this.operationStuInfo.bind(this,3)}><i className="el-icon-close el-icon-right"></i> &nbsp;&nbsp;取消</Button>
                                            </div>
                                        </div>
                                        <div className="row" style={{"marginTop":"25px"}}>
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
                                    </div>
                                </div>
                            </div>
                            <div className="card" style={{"marginTop":"10px"}}>
                                <div className="card-body">
                                    <div className="col-12">
                                        <div className="row">
                                            <div className="col-2 fontTitle">{this.state.title + '进程'}</div>
                                            <div className="col-7"></div>
                                            <div id="operationEditTwo" className="col-3 rightButton">
                                                <Button type="text" style={{"marginLeft": "26px"}} onClick={this.addLeads.bind(this, 1)}><i className="el-icon-plus el-icon-right"></i> &nbsp;&nbsp;新增</Button>
                                                <Button type="text" style={{"marginLeft": "26px"}} onClick={this.addLeads.bind(this, 2)}><i className="el-icon-edit el-icon-right"></i> &nbsp;&nbsp;编辑</Button>
                                            </div>
                                            <div id="operationDelTwo" className="col-3 rightButton">
                                                <Button type="text" style={{"marginLeft": "26px"}} onClick={this.operationOpporInfo.bind(this, 2)}><i className="el-icon-document el-icon-right"></i> &nbsp;&nbsp;保存</Button>
                                                <Button type="text" style={{"marginLeft": "26px"}} onClick={this.operationOpporInfo.bind(this, 3)}><i className="el-icon-close el-icon-right"></i> &nbsp;&nbsp;取消</Button>
                                            </div>
                                        </div>
                                        {
                                            this.state.data.courseTypes ?
                                                <Tabs type={"card"}  style={{"marginTop":"25px"}} onTabClick={ (tab) => this.changeOneTab(tab,1) }>{/*onTabClick={ (tab) => console.log(tab.props.name) }*/}
                                                    {
                                                        this.state.data.courseTypes ? this.state.data.courseTypes.map(item => {
                                                            return <Tabs.Pane label={item.name} name={item.id}>
                                                                {
                                                                    <Tabs onTabClick={ (tab) => this.changeOneTab(tab,2) }>{/*onTabClick={ (tab) => console.log(tab.props.name) }*/}
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
                                                                                                {/*<div className="form-group row">
                                                                                                    <label className="col-5 col-form-label font-weight-bold">类型</label>
                                                                                                    <div className="col-7">
                                                                                                        <input
                                                                                                            type="text"
                                                                                                            readOnly={true}
                                                                                                            className="form-control-plaintext"
                                                                                                            value={vo.leadsInfo ? config.TYPE_ID[vo.leadsInfo.typeId] : ''}
                                                                                                        />
                                                                                                    </div>
                                                                                                </div>*/}
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
                                                                                                <div className="form-group row">
                                                                                                    <label className="col-5 col-form-label">备注</label>
                                                                                                    <div className="col-7">
                                                                                                        <p className="form-control-plaintext">
                                                                                                            {vo.leadsInfo ? vo.leadsInfo.note : ''}
                                                                                                        </p>
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
                                            : null
                                        }

                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-4">
                            <ContactList
                                id={this.state.id}
                                canEdit={false}
                                groupName={this.props.group.name}
                                userName={this.props.profile.cRealname}
                                back={this.back}
                            />
                        </div>
                        {/*新增弹出层*/}
                        <Dialog
                            title="添加"
                            size="tiny"
                            closeOnClickModal={false}
                            visible={ this.state.showDialog }
                            onCancel={ () => this.setState({ showDialog: false }) }
                        >
                            <Dialog.Body>
                                <div className="form-group row contact" id="addView">
                                    <form ref={(dom) => {
                                            this.form = dom
                                        }} labelWidth="120" style={{"width":"80%"}}>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label">课程类别</label>
                                            <div className="col-7">
                                                <CourseType />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label">课程阶段</label>
                                            <div className="col-7">
                                                <CourseName />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>信息来源
                                            </label>
                                            <div className="col-7">
                                                <Source />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                {/*<em className="text-danger">*</em>*/}具体渠道
                                            </label>
                                            <div className="input-group col-7">
                                                <Popover placement="right-end" trigger="click" width={400}
                                                         visible={this.state.visible} content={(
                                                    <ActHouver parent={this}/>
                                                )}>
                                                    <input type="text" className="form-control" placeholder="请选择具体渠道"
                                                           style={{"width": "70%"}}
                                                           value={this.state.channelText} readOnly={true}/>
                                                </Popover>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>阶段
                                            </label>
                                            <div className="col-7">
                                                <Stages typeId={this.state.typeId} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>状态
                                            </label>
                                            <div className="col-7">
                                                <Status typeId={this.state.typeId} link={this.props.link} />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Body>

                            <Dialog.Footer className="dialog-footer">
                                <Button onClick={ () => this.setState({ showDialog: false }) }>取 消</Button>
                                <Button type="primary" onClick={this.addLeadsReq.bind(this,1)}>确 定</Button>
                            </Dialog.Footer>
                        </Dialog>
                        {/*编辑弹出层*/}
                        <Dialog
                            title="编辑"
                            size="tiny"
                            closeOnClickModal={false}
                            visible={ this.state.showEditDialog }
                            onCancel={ () => this.setState({ showEditDialog: false }) }
                        >
                            <Dialog.Body>
                                <div className="form-group row contact" id="editView">
                                    <form ref={(dom) => {
                                        this.form2 = dom
                                    }} labelWidth="120" style={{"width":"80%"}}>
                                        {/*<div className="form-group row">
                                            <label className="col-5 col-form-label">课程</label>
                                            <div className="col-7">
                                                <input
                                                    type="text"
                                                    readOnly={true}
                                                    className="form-control-plaintext"
                                                    value={(this.state.oneTab ? this.state.oneTab.name : '') + '/' + (this.state.twoTab ? this.state.twoTab.name : '')}
                                                />
                                            </div>
                                        </div>*/}
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label">课程类别</label>
                                            <div className="col-7">
                                                <CourseType />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label">课程阶段</label>
                                            <div className="col-7">
                                                <CourseName />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>信息来源
                                            </label>
                                            <div className="col-7">
                                                <Source />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                {/*<em className="text-danger">*</em>*/}具体渠道
                                            </label>
                                            <div className="input-group col-7">
                                                <Popover placement="right-end" trigger="click" width={400}
                                                         visible={this.state.visible} content={(
                                                    <ActHouver parent={this}/>
                                                )}>
                                                    <input type="text" className="form-control" placeholder="请选择具体渠道"
                                                           style={{"width": "70%"}}
                                                           value={this.state.channelText} readOnly={true}/>
                                                </Popover>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>阶段
                                            </label>
                                            <div className="col-7">
                                                <Stages typeId={this.state.typeId} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>状态
                                            </label>
                                            <div className="col-7">
                                                <Status typeId={this.state.typeId} link={this.props.link} />
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Body>

                            <Dialog.Footer className="dialog-footer">
                                <Button onClick={ () => this.setState({ showEditDialog: false }) }>取 消</Button>
                                <Button type="primary" onClick={this.addLeadsReq.bind(this,2)}>确 定</Button>
                            </Dialog.Footer>
                        </Dialog>
                        {/*编辑学员信息弹出层*/}
                        <Dialog
                            title="编辑"
                            size="small"
                            closeOnClickModal={false}
                            visible={ this.state.showStuDialog }
                            onCancel={ () => this.setState({ showStuDialog: false }) }
                        >
                            <Dialog.Body>
                                <div className="form-group row contact" id="editView">
                                    <form ref={(dom) => {
                                        this.form3 = dom
                                    }} labelWidth="120" style={{"width":"80%"}}>
                                        <div className="row">
                                            <div className="col">
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">
                                                        <em className="text-danger">*</em>学员姓名
                                                    </label>
                                                    <div className="col-7">
                                                        <input type="text" className="form-control" name="studentName" required={true}/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">学员性别</label>
                                                    <div className="col-7">
                                                        <Gender/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">
                                                        <em className="text-danger">*</em>学员年龄
                                                    </label>
                                                    <div className="col-4">
                                                        <Age data="1"/>
                                                    </div>
                                                    <div className="col-3.5">
                                                        <Age data="2"/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">在读年级</label>
                                                    <div className="col-7">
                                                        <Grade/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">所在学校</label>
                                                    <div className="col-7">
                                                        <input type="text" className="form-control" name="schoolName"/>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col">
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">
                                                        <em className="text-danger">*</em>家长姓名
                                                    </label>
                                                    <div className="col-7">
                                                        <input type="text" className="form-control" name="parentName" required={true}/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">
                                                        <em className="text-danger">*</em>与孩子关系
                                                    </label>
                                                    <div className="col-7">
                                                        <Relation />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">
                                                        <em className="text-danger">*</em>联系电话
                                                    </label>
                                                    <div className="col-7">
                                                        <input type="text" className="form-control" name="cellphone" required={true}/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">微信号</label>
                                                    <div className="col-7">
                                                        <input type="text" className="form-control" name="wechat"/>
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">家庭住址</label>
                                                    <div className="col-7">
                                                        <input type="text" className="form-control" name="address"/>
                                                    </div>
                                                </div>
                                            </div>
                                           {/*<div className="col">
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label">课程类别</label>
                                                    <div className="col-7">
                                                        <CourseType />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label">课程阶段</label>
                                                    <div className="col-7">
                                                        <CourseName />
                                                    </div>
                                                </div>
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">备注</label>
                                                    <div className="col-7">
                                                        <textarea className="form-control" rows="3" name="note"/>
                                                    </div>
                                                </div>
                                            </div>*/}
                                        </div>
                                    </form>
                                </div>
                            </Dialog.Body>

                            <Dialog.Footer className="dialog-footer">
                                <Button onClick={ () => this.setState({ showStuDialog: false }) }>取 消</Button>
                                <Button type="primary" onClick={this.operationOpporInfo.bind(this,1)}>确 定</Button>
                            </Dialog.Footer>
                        </Dialog>
                    </div>
                </div>
            </div>
        )
    }
}

export default View;