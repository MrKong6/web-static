import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import '../../Mkt/Leads/Leads.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import './AssignClass.css'
import DialogForEvent from "../../Dialog/DialogForEvent";
import fmtDate from "../../../utils/fmtDate";
import {Button, Card, Menu, Message, MessageBox, Select} from "element-react";
import mainSize from "../../../utils/mainSize";
import ajax from "../../../utils/ajax";
import fmtTitle from "../../../utils/fmtTitle";
import {$} from "../../../vendor";
import DialogForEventEdit from "../../Dialog/DialogForEventEdit";
import Commands from "../../Commands/Commands";
import DialogAssignClass from "../../Dialog/DialogAssignClass";

const MORE = "更多";
const FOLD = "收起";
class List extends React.Component {

    calendarComponentRef = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            calendarWeekends: true,
            droppable: false,
            editable: false,
            roomList: [],
            classList: [],
            teacherList: [],
            group: this.props.changedCrmGroup,
            calendarEvents: [ // initial event data
                {
                    title: 'K101  Teacher Zhou',
                    start: new Date("2019-07-22 10:00"),
                    end: new Date("2019-07-22 18:00"),
                    color: "#123456",
                    textColor: "#fff",
                    id: "aaa"
                }
            ],
            eventCommont: '',
            chooseRoom: null,
            chooseClass: null,
            chooseTeacher: null,
            classMore:MORE,
            classMoreTeacher:MORE,
            classMoreRoom:MORE,
        }
        this.commands = this.props.commands.filter(command => (command.name == 'ShowNormal'));
        this.title = fmtTitle(this.props.location.pathname);
        this.title.name  = this.title.name ? this.title.name : "All"
        this.eventMouseEnter = this.eventMouseEnter.bind(this);
        this.eventMouseLeave = this.eventMouseLeave.bind(this);
        this.eventOnClick = this.eventOnClick.bind(this);
        this.chooseTopCondition = this.chooseTopCondition.bind(this);
        this.delAssignClass = this.delAssignClass.bind(this);
        this.mid = this.mid.bind(this);
        this.changeFold = this.changeFold.bind(this);
        this.toDirect = this.toDirect.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                //顶部
                let roomList = await ajax('/academy/room/list.do', {orgId: this.state.group.id});
                let teacherList = await ajax('/academy/teacher/list.do', {orgId: this.state.group.id,pageNum:1,pageSize:9999});
                let classList = await ajax('/academy/class/list.do', {orgId: this.state.group.id,limit:9999,showAssignStatus:1});

                this.setState({
                    teacherList: teacherList.data.items,
                    classList: classList.data.items,
                    roomList: roomList.data.items
                });
                this.refreshAssignClass();
            } catch (err) {
                /*if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    this.createDialogTips(`${err.errCode}: ${err.errText}`);
                }*/
            } finally {
                this.setState({isAnimating: false});
            }
        };
        request();
        mainSize()
    }

    componentDidUpdate(){
        //如果是移动端  将日历高度自适应  头部字体自适应
        if(navigator.userAgent.match(/mobile/i)) {
            //如果是移动端
            var h2Stle = $(".fc-toolbar h2");
            if(h2Stle){
                h2Stle.css("font-size","1em");
            }
            var tags = $(".fc-widget-content  div");
            if(tags && tags.length > 3){
                tags[4].removeAttribute('style');
            }
        }
    }

    toggleWeekends = () => {
        this.setState({ // update a property
            calendarWeekends: !this.state.calendarWeekends
        })
    }

    gotoPast = () => {
        let calendarApi = this.calendarComponentRef.current.getApi()
        calendarApi.gotoDate('2000-01-01') // call a method on the Calendar object
    }

    eventOnClick = (evt) => {
        debugger
        this.state.id = evt.event.id;
        this.setState({id:evt.event.id})
        // this.state.chooseEvent = evt.event;
        // this.handleDateClick();
        // this.props.history.push(`${this.props.match.url}/`+evt.event.id);
        this.actContainer = document.createElement('div');
        ReactDOM.render(
            <div>
                <DialogAssignClass
                    accept={this.acceptActDialog}
                    changedCrmGroup={this.state.group}
                    toDirect={this.toDirect.bind(this)}
                    id={evt.event.id}
                    key={new Date().getTime()}
                    defaults={this.state.channelId}
                    replace={this.props.replace}
                    from={this.props.from}
                    ref={(dom) => {
                        this.act = dom
                    }}
                />
            </div>
            ,
            document.body.appendChild(this.actContainer)
        );
        this.act.dialog.modal('show');
    }

    toDirect(value,id){
        if(value == 2){
            this.props.history.push(`${this.props.match.url}/`+this.state.id,{type:value});
        }else{
            this.props.history.push(`${this.props.match.url}/`+this.state.id,{type:value});
        }
    }

    windowResize(view) {
        console.log(1234565432);
    }

    titleF(date) {
        return fmtDate(date.start.marker) + '-----' + fmtDate(date.end.marker);
    }

    eventMouseEnter(mouseEnterInfo) {
        this.setState({
            eventCommont: mouseEnterInfo.event.title
        })
    }

    eventMouseLeave(mouseEnterInfo) {
        this.setState({
            eventCommont: ''
        })
    }

    //type:1代表班级 2教师  3教室   evt:里面的id值
    chooseTopCondition(type, evt) {
        switch (type) {
            case(1): {
                let items = this.state.classList.filter(item => (item.id == evt));
                this.state.chooseTeacher = null;
                this.state.chooseRoom = null;
                this.state.chooseClass = evt;
                this.title.name = (items.length >0 ? items[0].code: "");
                this.setState({
                    chooseTeacher : null,
                    chooseRoom : null,
                    chooseClass : evt,
                });
                break;
            }
            case(2): {
                let items = this.state.teacherList.filter(item => (item.id == evt));
                this.state.chooseTeacher = evt;
                this.state.chooseRoom = null;
                this.state.chooseClass = null;
                this.title.name = (items.length >0 ? items[0].name: "");;
                this.setState({
                    chooseTeacher : evt,
                    chooseRoom : null,
                    chooseClass : null,
                });
                break;
            }
            case(3): {
                let items = this.state.roomList.filter(item => (item.id == evt));
                this.state.chooseRoom = evt;
                this.state.chooseTeacher = null;
                this.state.chooseClass = null;
                this.title.name = (items.length >0 ? items[0].code: "");
                this.setState({
                    chooseTeacher : null,
                    chooseRoom : evt,
                    chooseClass : null,
                });
                break;
            }
        }
        this.refreshAssignClass();
    }
    //添加自定义事件
    handleDateClick = (arg) => {
        if(this.state.chooseClass){
            this.props.history.push(`${this.props.match.url}/create`,{"classId":Number(this.state.chooseClass)});
        }else{
            Message({
                type: 'warning',
                message: '请先选择班级!'
            });
        }
    }

    mid(){
        this.refreshAssignClass();
        this.state.chooseEvent = null;
    }
    //刷新事件列表
    refreshAssignClass() {
        const request = async () => {
            try {
                //事件列表
                let assignClassList = await ajax('/academy/class/assignClassList.do', {orgId: this.state.group.id,classId:this.state.chooseClass,
                        teacherId:this.state.chooseTeacher,roomId:this.state.chooseRoom});
                if(assignClassList && assignClassList.data){
                    let calendarEvents = [];
                    assignClassList.data.map(item => {
                        calendarEvents.push({
                            title: '班级：' + (item.classCode ? item.classCode : "") + '课程：' + (item.courseName ? item.courseName : "")  + '\n教师：' + (item.teacherName ? item.teacherName : "") + '\n教室：' + (item.roomCode ? item.roomCode : "") + '\n课次：' + (item.currentClassTime ? item.currentClassTime : ""),
                            start: new Date(item.startTime),
                            end: new Date(item.endTime),
                            color: item.classColor ? item.classColor : "#ECF5FF",
                            textColor: item.classColor ? "#fff" : '#FF0000',   //没有色值的便是体验课，设置特殊色值
                            id: item.id
                        });
                    });
                    this.setState({calendarEvents : calendarEvents})
                }
            } catch (err) {
                // if (err.errCode === 401) {
                //     this.setState({redirectToReferrer: true})
                // } else {
                //     this.createDialogTips(`${err.errCode}: ${err.errText}`);
                // }
            } finally {
                // this.setState({isAnimating: false});
            }
        };
        request();
    }
    //删除事件列表
    delAssignClass(id,loopTrue) {
        const request = async () => {
            try {
                //事件列表
                let assignClassList = await ajax('/academy/class/delAssignClass.do', {id: id,loopTrue:loopTrue});
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

    initRange(currentDate) {
        return {
            start: currentDate.clone().subtract(1, 'days'),
            end: currentDate.clone().add(3, 'days') // exclusive end, so 3
        };
    }
    //展开折叠
    changeFold(type, evt) {
        let className = ".list-fold-panel";
        if(type == 1){
            this.setState({classMore: evt.target.innerText == MORE ? FOLD : MORE})
        }else if(type == 2){
            className = ".list-fold-panel-teacher";
            this.setState({classMoreTeacher: evt.target.innerText == MORE ? FOLD : MORE})
        }else if(type == 3){
            className = ".list-fold-panel-room";
            this.setState({classMoreRoom: evt.target.innerText == MORE ? FOLD : MORE})
        }
        if(evt.target.innerText == MORE){
            $(className).css("height", "auto");
            $(className).css("overflow", "display");
        }else{
            $(className).css("height", "50px");
            $(className).css("overflow", "hidden");
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
        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>&nbsp;{this.title.text}|&nbsp;&nbsp;{this.title.name}
                    <Commands
                        commands={this.commands}
                        thAction={this.handleDateClick}
                    />
                </h5>
                <div id="main" className="main p-3">

                    <div className='demo-app'>
                            {/*<div className="col-2">
                                <Select value={this.state.chooseClass} filterable={true} clearable={true} onChange={this.chooseTopCondition.bind(this, 1)} placeholder="请选择班级">
                                    {
                                        this.state.classList ? this.state.classList.map(el => {
                                            return (
                                                <Select.Option key={el.id} label={el.code} value={el}>
                                                    {el.assignId && el.assignId.length > 0 ? (
                                                        <span>{el.code}</span>
                                                    ) : (<span style={{color: '#CDCDC1'}}>{el.code}</span>)}
                                                </Select.Option>
                                            )
                                        }) : null
                                    }
                                </Select>
                            </div>*/}
                            {/*<div className="col-2">
                                <Select value={this.state.chooseTeacher} clearable={true} filterable={true} onChange={this.chooseTopCondition.bind(this, 2)} placeholder="请选择教师">
                                    {
                                        this.state.teacherList ? this.state.teacherList.map(el => {
                                            return <Select.Option key={el.id} label={el.name} value={el} />
                                        }) : null
                                    }
                                </Select>
                            </div>
                            <div className="col-2">
                                <Select value={this.state.chooseRoom} clearable={true} filterable={true} onChange={this.chooseTopCondition.bind(this, 3)} placeholder="请选择教室">
                                    {
                                        this.state.roomList ? this.state.roomList.map(el => {
                                            return <Select.Option key={el.id} label={el.code} value={el} />
                                        }) : null
                                    }
                                </Select>
                            </div>*/}
                            {/*<div className="col-2">

                            </div>*/}
                        </div>
                    <div className="row">
                        <div className="row" style={{width: '100%'}}>
                            <div className="col-1" style={{textAlign: 'right', height: '60px', lineHeight: '60px'}}>
                                <label>班级：</label>
                            </div>
                            <div className="col-10 list-fold-panel">
                                <Menu defaultActive={this.state.chooseClass} className="el-menu-demo" mode="horizontal"
                                      onSelect={this.chooseTopCondition.bind(this, 1)}
                                      >
                                    {
                                        this.state.classList ? this.state.classList.map(item => (
                                            <Menu.Item index={item.id + ''} key={item.code}>{item.code}</Menu.Item>
                                        )) : null
                                    }
                                </Menu>
                            </div>
                            <div className="col-1 text-line-height">
                                <Button type="text" size="large" onClick={this.changeFold.bind(this,1)}>{this.state.classMore}</Button>
                            </div>
                        </div>
                        <div className="row" style={{width: '100%'}}>
                            <div className="col-1" style={{textAlign: 'right', height: '60px', lineHeight: '60px'}}>
                                <label>教师：</label>
                            </div>
                            <div className="col-10 list-fold-panel-teacher">
                                <Menu defaultActive={this.state.chooseTeacher} className="el-menu-demo" mode="horizontal"
                                      onSelect={this.chooseTopCondition.bind(this, 2)}>
                                    {
                                        this.state.teacherList ? this.state.teacherList.map(item2 => (
                                            <Menu.Item index={item2.id+''} key={item2.id}>{item2.name}</Menu.Item>
                                        )) : null
                                    }
                                </Menu>
                            </div>
                            <div className="col-1 text-line-height">
                                <Button type="text" size="large" onClick={this.changeFold.bind(this,2)}>{this.state.classMoreTeacher}</Button>
                            </div>
                        </div>
                        <div className="row" style={{width: '100%'}}>
                            <div className="col-1" style={{textAlign: 'right', height: '60px', lineHeight: '60px'}}>
                                <label>教室：</label>
                            </div>
                            <div className="col-10 list-fold-panel-room">
                                <Menu defaultActive={this.state.chooseRoom} className="el-menu-demo" mode="horizontal"
                                      onSelect={this.chooseTopCondition.bind(this, 3)}>
                                    {
                                        this.state.roomList ? this.state.roomList.map(item3 => (
                                            <Menu.Item index={item3.id+''} key={item3.id}>{item3.code}</Menu.Item>
                                        )) : null
                                    }
                                </Menu>
                            </div>
                            <div className="col-1 text-line-height">
                                <Button type="text" size="large" onClick={this.changeFold.bind(this,3)}>{this.state.classMoreRoom}</Button>
                            </div>
                        </div>
                        {/*<div className="row">
                            <button
                                type="submit"
                                className="btn btn-primary"
                                onClick={this.handleDateClick}
                                disabled={this.state.isAnimating}
                            >
                                排课
                            </button>
                        </div>*/}
                        {/*<div className='demo-app-top row'>
                            <Card className="box-card">
                                <div className="text item">事件内容：</div>
                                <div className="text item">{this.state.eventCommont}</div>
                            </Card>
                        </div>*/}
                        <div className="row">
                            <div className='demo-app-calendar'>
                                <FullCalendar
                                    defaultView="timeGridWeek"
                                    header={{
                                        left: 'prev,next', /*prev,next today*/
                                        center: 'title',
                                        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                                    }}
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                    ref={this.calendarComponentRef}
                                    firstDay={1}
                                    weekends={this.state.calendarWeekends}
                                    events={this.state.calendarEvents}
                                    // dateClick={this.handleDateClick}
                                    editable={false}
                                    timeZone='local'
                                    eventClick={this.eventOnClick}
                                    minTime='07:00:00'
                                    maxTime='22:00:00'
                                    titleFormat={this.titleF}
                                    eventMouseEnter={this.eventMouseEnter}
                                    eventMouseLeave={this.eventMouseLeave}

                                    /*handleWindowResize={false}
                                    windowReSize={this.windowResize}
                                    aspectRatio={1.1}*/
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default List;