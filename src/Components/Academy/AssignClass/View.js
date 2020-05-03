import React from 'react'
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress";
import Commands from "../../Commands/Commands";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import fmtDate from "../../../utils/fmtDate";
import {
    Button,
    Checkbox,
    DatePicker,
    Form,
    Input,
    Layout,
    Message,
    MessageBox,
    Select,
    TimePicker
} from "element-react";
import {changeArrayItemToInt, changeStringToArrayInt} from "../../../utils/objectToArray";

class View extends React.Component {
    constructor(props) {
        super(props);
        this.commands = this.props.commands.filter(command => (command.name !== 'ShowNormal'));
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            showType: this.props.location.state.type,
            id: this.props.match.params.contractId,
            weeks:[],
            weeksDataSource:[
                {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx:1,
                    name: '周一',
                    items:[
                        {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx:1,
                        },{
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx:2,
                        }],
                },{
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx:2,
                    name: '周二',
                    items:[
                        {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx:1,
                        },{
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx:2,
                        }],
                },{
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx:3,
                    name: '周三',
                    items:[
                        {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx:1,
                        },{
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx:2,
                        }],
                },{
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx:4,
                    name: '周四',
                    items:[
                        {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx:1,
                        },{
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx:2,
                        }],
                },{
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx:5,
                    name: '周五',
                    items:[
                        {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx:1,
                        },{
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx:2,
                        }],
                },{
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx:6,
                    name: '周六',
                    items:[
                        {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx:1,
                        },{
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx:2,
                        }],
                },{
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx:7,
                    name: '周日',
                    items:[
                        {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx:1,
                        },{
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx:2,
                        }],
                }],
            data: null,
            ids: [],
            roomList: [],
            teacherList: [],
            form: {},
            rules: {},
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.modAction = this.modAction.bind(this);
        this.delAction = this.delAction.bind(this);
        this.handleSelect = this.handleSelect.bind(this);

    }

    componentDidMount() {
        const request = async () => {
            try {
                let data = await ajax('/academy/class/assignClassById.do', {csId: this.state.id,type: this.state.showType});
                let roomList = await ajax('/academy/room/list.do', {orgId: this.state.group.id});
                let teacherList = await ajax('/academy/teacher/list.do', {orgId: this.state.group.id});
                data = data.data;let weeks = [];
                roomList = roomList.data.items;
                teacherList = teacherList.data.items;
                if(data.length > 0){
                    this.state.weeksDataSource.map(source => {
                        source.week1 = true;
                        let items = [],idx = 1;
                        data.map(vo => {
                            if(vo.weekName == source.name){
                                let one =  {
                                    date1: new Date(vo.startTime),
                                    week1: true,
                                    roomId1: Number(vo.roomId),
                                    teacherId1: [],
                                    teacherId2: [],
                                    idx:idx++,
                                }, teacherId = [],registrarId=[];
                                teacherId = changeStringToArrayInt(vo.teacherId)
                                if (vo.teacherId && vo.teacherId.indexOf(",") != -1) {
                                    teacherId = vo.teacherId.split(",");
                                } else if(vo.teacherId){
                                    teacherId.push(Number(vo.teacherId));
                                }
                                if (vo.registrarId && vo.registrarId.indexOf(",") != -1) {
                                    registrarId = vo.registrarId.split(",");
                                } else  if(vo.registrarId){
                                    registrarId.push(Number(vo.registrarId));
                                }
                                one.teacherId1 = changeArrayItemToInt(teacherId);
                                one.teacherId2 = changeArrayItemToInt(registrarId);
                                items.push(one);
                            }
                        });
                        if(items.length > 0){
                            source.items = items;
                            weeks.push(source);
                        }
                        /*if(data[0].weekName == source.name){
                            source.week1 = true;
                            let items = [],idx = 1;
                            data.map(vo => {
                                let one =  {
                                    date1: new Date(vo.startTime),
                                    week1: true,
                                    roomId1: Number(vo.roomId),
                                    teacherId1: [],
                                    teacherId2: [],
                                    idx:idx++,
                                }, teacherId = [],registrarId=[];
                                teacherId = changeStringToArrayInt(vo.teacherId)
                                if (vo.teacherId && vo.teacherId.indexOf(",") != -1) {
                                    teacherId = vo.teacherId.split(",");
                                } else if(vo.teacherId){
                                    teacherId.push(Number(vo.teacherId));
                                }
                                if (vo.registrarId && vo.registrarId.indexOf(",") != -1) {
                                    registrarId = vo.registrarId.split(",");
                                } else  if(vo.registrarId){
                                    registrarId.push(Number(vo.registrarId));
                                }
                                one.teacherId1 = changeArrayItemToInt(teacherId);
                                one.teacherId2 = changeArrayItemToInt(registrarId);
                                items.push(one);
                            });
                            source.items = items;
                            weeks.push(source);
                        }*/
                    });
                }
                this.setState({roomList,teacherList,data:data[0],weeks});
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

    handleSelect(type, key, value) {
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
        this.props.history.push(`${this.props.match.url}/edit`, {ids: this.ids,type:this.state.showType});
    }

    delAction() {
        MessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
            type: 'warning'
        }).then(() => {
            request();
            this.props.refresh();
        }).catch(() => {

        });
        const request = async () => {
            try {
                await ajax('/academy/class/delAssignClass.do', {id: this.state.id,loopTrue:(this.state.showType)});
                Message({
                    type: 'info',
                    message: '删除成功'
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
                <Redirect to="/home/academy/assignclass"/>
            )
        }
        let that = this;
        if (!this.state.data) {
            return (
                <div>
                    <h5 id="subNav">
                        <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                        &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;

                        <div className="btn-group float-right ml-4" role="group">
                            <button onClick={() => {
                                this.props.history.push('/home/academy/assignclass');
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
                    &nbsp;{this.title.text}&nbsp;&nbsp;

                    <div className="btn-group float-right ml-4" role="group">
                        <button onClick={() => {
                            this.props.history.push('/home/academy/assignclass');
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
                                                <label className="col-5 col-form-label font-weight-bold">班级编号</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.classCode}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">课程类型</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.courseType}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">课程阶段</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.courseRange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">总课次</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.classTime}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">总课时</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.classHour}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">课程时长</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.time}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">当前课次</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.currentClassTime}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">主教</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.teacherName}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">助教</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.registrarName}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">开课日期</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={fmtDate(this.state.data.loopStartTime)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">结课日期</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={fmtDate(this.state.data.xunhuanEndDate)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Form ref="form" model={this.state.form} rules={this.state.rules} labelWidth="80"
                                          className="demo-ruleForm">
                                    {that.state.weeks.map(function (vo) {
                                        return (
                                            <div  key={vo.idx}>
                                                {
                                                    vo.items.map(function (item) {
                                                        return  (
                                                            <div className="row" key={item.idx}>
                                                                <Layout.Col span="2">
                                                                    <div className="grid-content bg-purple" style={{"display":item.idx == 1 ? "normal" : "none"}}>
                                                                        <Checkbox label={vo.name} name={vo.name} checked={vo.week1} onChange={that.handleSelect.bind(this, vo.idx, 'week')} disabled={true}></Checkbox>
                                                                    </div>
                                                                    <div className="grid-content bg-purple">
                                                                        <div style={{"display":"none"}}>
                                                                            <Checkbox label={vo.name} name={vo.name} checked={vo.week1} disabled={true}></Checkbox>
                                                                        </div>
                                                                    </div>
                                                                </Layout.Col>
                                                                <Layout.Col span="5">
                                                                    <div className="grid-content bg-purple">
                                                                            <TimePicker
                                                                                value={item.date1}
                                                                                isReadOnly={true}
                                                                                selectableRange="6:30:00 - 22:30:00"
                                                                                placeholder="请选择开始上课时间"
                                                                                onChange={date=>{
                                                                                    item.date1 = date;
                                                                                }}
                                                                            />
                                                                    </div>
                                                                </Layout.Col>
                                                                <Layout.Col span="5">
                                                                    <div className="grid-content bg-purple">
                                                                        <Form.Item>
                                                                            <Select value={item.roomId1} placeholder="请选择教室"
                                                                                    filterable={true}
                                                                                    clearable={true} style={{"width":"100%"}}
                                                                                    onChange={data=>{item.roomId1 = data;}}
                                                                                    disabled={true}
                                                                            >
                                                                                {
                                                                                    that.state.roomList && that.state.roomList.length > 0 ? that.state.roomList.map(el => {
                                                                                        return <Select.Option key={el.id} label={el.code}
                                                                                                              value={el.id}/>
                                                                                    }) : null
                                                                                }
                                                                            </Select>
                                                                        </Form.Item>
                                                                    </div>
                                                                </Layout.Col>
                                                                <Layout.Col span="5">
                                                                    <div className="grid-content bg-purple">
                                                                        <Form.Item>
                                                                            <Select value={item.teacherId1} placeholder="请选择主教"
                                                                                    filterable={true} multiple={true}
                                                                                    clearable={true} style={{"width":"100%"}}
                                                                                    onChange={data=>{item.teacherId1 = data;}}
                                                                                    disabled={true}
                                                                            >
                                                                                {
                                                                                    that.state.teacherList && that.state.teacherList.length > 0 ? that.state.teacherList.map(el => {
                                                                                        return <Select.Option key={el.id} label={el.name}
                                                                                                              value={el.id}/>
                                                                                    }) : null
                                                                                }
                                                                            </Select>
                                                                        </Form.Item>
                                                                    </div>
                                                                </Layout.Col>
                                                                <Layout.Col span="5">
                                                                    <div className="grid-content bg-purple">
                                                                        <Form.Item>
                                                                            <Select value={item.teacherId2} placeholder="请选择助教"
                                                                                    filterable={true} multiple={true}
                                                                                    clearable={true} style={{"width":"100%"}}
                                                                                    onChange={data=>{item.teacherId2 = data;}}
                                                                                    disabled={true}
                                                                            >
                                                                                {
                                                                                    that.state.teacherList && that.state.teacherList.length > 0 ? that.state.teacherList.map(el => {
                                                                                        return <Select.Option key={el.id} label={el.name}
                                                                                                              value={el.id}/>
                                                                                    }) : null
                                                                                }
                                                                            </Select>
                                                                        </Form.Item>
                                                                    </div>
                                                                </Layout.Col>
                                                            </div>
                                                        );
                                                    })
                                                }
                                            </div>
                                        )
                                    })}
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default View;