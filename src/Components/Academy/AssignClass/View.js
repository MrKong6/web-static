import React from 'react'
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress";
import Commands from "../../Commands/Commands";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import fmtDate, {formatWithTime, getNumByWeek, getWeekDate} from "../../../utils/fmtDate";
import {
    Button,
    Checkbox,
    Form, Icon,
    Layout,
    Message,
    MessageBox,
    Select, Tabs,
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
            data: {},
            ids: [],
            roomList: [],
            teacherList: [],
            form: {},
            rules: {},
            defaultClickTab: 1,
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.modAction = this.modAction.bind(this);
        this.delAction = this.delAction.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.changeTabs = this.changeTabs.bind(this);

    }

    componentDidMount() {
        const request = async () => {
            try {
                let data = await ajax('/academy/class/assignClassById.do', {csId: this.state.id,type: this.state.showType});
                let roomList = await ajax('/academy/room/list.do', {orgId: this.state.group.id});
                let teacherList = await ajax('/academy/teacher/list.do', {orgId: this.state.group.id});
                data = data.data;
                roomList = roomList.data.items;
                teacherList = teacherList.data.items;
                let weeks = [],weeksDataSource = this.state.weeksDataSource;
                let weekDate = getWeekDate(data[0].startTime);
                debugger
                if(data.length > 0){
                    weeksDataSource.map(source => {
                        source.items = [];
                        data.map(vo => {
                            if(vo.weekName == source.name){
                                source.items.push({date1: new Date(vo.startTime),
                                    week1: true,
                                    roomId1: Number(vo.roomId),
                                    teacherId1: changeStringToArrayInt(vo.teacherId),
                                    teacherId2: changeStringToArrayInt(vo.registrarId),
                                    ch:vo.currentClassHour,
                                    ct:vo.currentClassTime,
                                    id:vo.id,
                                    index:vo.currentClassHour});
                                source.week1 = true;
                            }
                        });
                        source.weekDate = weekDate[source.idx-1];
                        weeks.push(source);

                    });
                    data = data.filter(item => item.id == this.state.id)[0];
                }
                let defaultClickTab = Number(getNumByWeek(data.weekName));
                this.setState({roomList, teacherList, data, weeks,defaultClickTab});
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

    //改变导航
    changeTabs(evg) {
        this.handleSelect(null, "showWeek", [evg.props.name])
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
                                            {/*<div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">课程类型</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.courseType}
                                                    />
                                                </div>
                                            </div>*/}
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">课程阶段</label>
                                                <div className="col-7">
                                                    <input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data.courseName}
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
                                    <div className="row">
                                        {/*<div className="col-0.5">
                                            <Button type="primary" icon="arrow-left"></Button>
                                        </div>*/}
                                        <div className="col-11">
                                            <Tabs type="border-card" activeName={this.state.defaultClickTab}
                                                  onTabClick={this.changeTabs.bind(this)}>
                                                {that.state.weeks.map(function (vo) {
                                                    return (  /*vo.name*/
                                                        <Tabs.Pane label={ <span style={{"color": vo.items.length > 0 ? "red" : "black"}}><Icon name="date" /> {vo.name + '(' +vo.weekDate + ')'}</span>} name={vo.idx}>
                                                            <div className="row">
                                                                <div className="col-1">课时</div>
                                                                <div className="col-2">开始上课时间</div>
                                                                <div className="col-2">教室</div>
                                                                <div className="col-2">主教</div>
                                                                <div className="col-2">助教</div>
                                                            </div>
                                                            {
                                                                vo.items.map(function (item) {
                                                                    return (
                                                                        <div className="row" key={item.idx} style={{"marginTop":"20px"}}>
                                                                            <div className="col-1">{item.index}</div>
                                                                            <div className="col-2 grid-content bg-purple">
                                                                                <input
                                                                                    type="text"
                                                                                    readOnly={true}
                                                                                    className="form-control-plaintext"
                                                                                    value={formatWithTime(item.date1)}
                                                                                />
                                                                            </div>

                                                                            <div className="col-2 grid-content bg-purple">
                                                                                <Select value={item.roomId1} placeholder="教室"
                                                                                        disabled={true} style={{"width": "100%"}}
                                                                                        onChange={data => {
                                                                                            item.roomId1 = data;
                                                                                        }}
                                                                                >
                                                                                    {
                                                                                        that.state.roomList && that.state.roomList.length > 0 ? that.state.roomList.map(el => {
                                                                                            return <Select.Option key={el.id}
                                                                                                                  label={el.code}
                                                                                                                  value={el.id}/>
                                                                                        }) : null
                                                                                    }
                                                                                </Select>
                                                                            </div>

                                                                            <div className="col-2 grid-content bg-purple">
                                                                                <Select value={item.teacherId1} placeholder="请选择主教"
                                                                                        disabled={true} filterable={true} multiple={true}
                                                                                        clearable={true} style={{"width": "100%"}}
                                                                                        onChange={data => {
                                                                                            item.teacherId1 = data;
                                                                                        }}
                                                                                >
                                                                                    {
                                                                                        that.state.teacherList && that.state.teacherList.length > 0 ? that.state.teacherList.map(el => {
                                                                                            return <Select.Option key={el.id}
                                                                                                                  label={el.name}
                                                                                                                  value={el.id}/>
                                                                                        }) : null
                                                                                    }
                                                                                </Select>
                                                                            </div>

                                                                            <div className="col-2 grid-content bg-purple">
                                                                                <Select value={item.teacherId2} placeholder="请选择助教"
                                                                                        disabled={true} filterable={true} multiple={true}
                                                                                        clearable={true} style={{"width": "100%"}}
                                                                                        onChange={data => {
                                                                                            item.teacherId2 = data;
                                                                                        }}
                                                                                >
                                                                                    {
                                                                                        that.state.teacherList && that.state.teacherList.length > 0 ? that.state.teacherList.map(el => {
                                                                                            return <Select.Option key={el.id}
                                                                                                                  label={el.name}
                                                                                                                  value={el.id}/>
                                                                                        }) : null
                                                                                    }
                                                                                </Select>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })
                                                            }
                                                        </Tabs.Pane>
                                                    )
                                                })}
                                            </Tabs>
                                        </div>
                                        {/*<div className="col-0.5">
                                            <Button type="primary"><i className="el-icon-arrow-right el-icon-right"></i></Button>
                                        </div>*/}
                                    </div>

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