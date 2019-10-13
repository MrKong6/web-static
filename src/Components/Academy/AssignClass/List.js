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
import {Card, Menu, Message, MessageBox, Select} from "element-react";
import mainSize from "../../../utils/mainSize";
import ajax from "../../../utils/ajax";
import fmtTitle from "../../../utils/fmtTitle";
import {$} from "../../../vendor";


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
        }
        this.title = fmtTitle(this.props.location.pathname);
        this.title.name  = this.title.name ? this.title.name : "All"
        this.eventMouseEnter = this.eventMouseEnter.bind(this);
        this.eventMouseLeave = this.eventMouseLeave.bind(this);
        this.chooseTopCondition = this.chooseTopCondition.bind(this);
        this.addCustomeEvent = this.addCustomeEvent.bind(this);
        this.delAssignClass = this.delAssignClass.bind(this);
        this.mid = this.mid.bind(this);
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
        /*MessageBox.confirm('此操作将永久删除该日程, 是否继续?', '提示', {
            type: 'warning'
        }).then(() => {
            this.delAssignClass(evt);
            // evt.event.remove(evt)
            this.refreshAssignClass();
            Message({
                type: 'success',
                message: '删除成功!'
            });
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消删除'
            });
        });*/
        this.state.chooseEvent = evt.event;
        this.handleDateClick();

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
                this.setState({
                    chooseTeacher : null,
                    chooseRoom : null,
                    chooseClass : evt.id,
                });
                this.state.chooseTeacher = null;
                this.state.chooseRoom = null;
                this.state.chooseClass = evt.id;
                this.title.name = evt.code;
                break;
            }
            case(2): {
                this.setState({
                    chooseTeacher : evt.id,
                    chooseRoom : null,
                    chooseClass : null,
                });
                this.state.chooseTeacher = evt.id;
                this.state.chooseRoom = null;
                this.state.chooseClass = null;
                this.title.name = evt.name;
                break;
            }
            case(3): {
                this.setState({
                    chooseTeacher : null,
                    chooseRoom : evt.id,
                    chooseClass : null,
                });
                this.state.chooseRoom = evt.id;
                this.state.chooseTeacher = null;
                this.state.chooseClass = null;
                this.title.name = evt.code;
                break;
            }
        }
        this.refreshAssignClass();
    }
    //添加自定义事件
    handleDateClick = (arg) => {

        // if(this.state.chooseClass && this.state.chooseRoom && this.state.chooseTeacher){
        this.userContainer = document.createElement('div');
        ReactDOM.render(
            <DialogForEvent
                accept={this.addCustomeEvent}
                refresh={this.mid}
                container={this.userContainer}
                typeName="1"
                changedCrmGroup={this.state.group}
                chooseStartDate={(arg && arg.date) ? arg.date : (this.state.chooseEvent ? this.state.chooseEvent.startTime : new Date())}
                data = {this.state.chooseEvent}
                replace={this.props.history.replace}
                from={this.props.location}
                ref={(dom) => {
                    this.user = dom
                }}
            />,
            document.body.appendChild(this.userContainer)
        );
        this.user.dialog.modal('show');
        // if (confirm('Would you like to add an event to ' + arg.dateStr + ' ?')) {
        //     this.setState({  // add new event data
        //         calendarEvents: this.state.calendarEvents.concat({ // creates a new array
        //             title: 'New Event',
        //             start: arg.date,
        //             allDay: arg.allDay
        //         })
        //     })
        // }
        /*}else{
            Message({
                message: "请先选择班级、教师、教室",
                type: 'error'
            });
        }*/
    }
    //确认添加自定义事件
    addCustomeEvent(selected){
        if(selected.id){
            this.delAssignClass(selected.id,selected.showXunhuanDate);
        }
        const request = async () => {
            try {
                let param =  {classId: selected.chooseClass,
                    teacherId: selected.chooseTeacher,roomId: selected.chooseRoom,
                    startTime: selected.startTime,endTime: selected.endTime,comment: selected.comment,xunhuanEndDate:selected.xunhuanEndDate,
                    loopTrue:selected.showXunhuanDate, loopId:selected.loopId, loopStartTime: selected.loopStartTime};
                await ajax('/academy/class/assignClass.do',{"assignVo":JSON.stringify(param)});
                Message({
                    message: "成功",
                    type: 'info'
                });
                this.refreshAssignClass();
            } catch (err) {

            } finally {
                this.setState({isAnimating: false});
            }
        };
        request();
        this.state.chooseEvent = null;
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
                            title: '班级：' + item.classCode + '\n教师：' + item.teacherName + '\n教室：' + item.roomCode,
                            start: new Date(item.startTime),
                            end: new Date(item.endTime),
                            color: item.classColor ? item.classColor : "#123456",
                            textColor: "#fff",
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
                </h5>
                <div id="main" className="main p-3">

                    <div className='demo-app'>
                        <div className="row">
                            {/*<div className="col-1" style={{textAlign: 'right', height: '60px', lineHeight: '60px'}}>
                                <label>班级：</label>
                            </div>*/}
                            {/*<Menu defaultActive={this.state.chooseClass} className="el-menu-demo" mode="horizontal"
                                  onSelect={this.chooseTopCondition.bind(this, 1)}>
                                {
                                    this.state.classList ? this.state.classList.map(item => (
                                        <Menu.Item index={item}>{item.code}</Menu.Item>
                                    )) : null
                                }
                            </Menu>*/}
                            <div className="col-2">
                                <Select value={this.state.chooseClass} filterable={true} onChange={this.chooseTopCondition.bind(this, 1)} placeholder="请选择班级" clearable={true}>
                                    {
                                        this.state.classList.map(el => {
                                            return (
                                                <Select.Option key={el.id} label={el.code} value={el}>
                                                    {el.assignId && el.assignId.length > 0 ? (
                                                        <span>{el.code}</span>
                                                    ) : (<span style={{color: '#CDCDC1'}}>{el.code}</span>)}

                                                </Select.Option>
                                            )
                                        })
                                    }
                                </Select>
                            </div>
                            <div class="col-2">
                                <Select value={this.state.chooseTeacher} clearable={true} filterable={true} onChange={this.chooseTopCondition.bind(this, 2)} placeholder="请选择教师">
                                    {
                                        this.state.teacherList.map(el => {
                                            return <Select.Option key={el.id} label={el.name} value={el} />
                                        })
                                    }
                                </Select>
                            </div>
                            <div class="col-2">
                                <Select value={this.state.chooseRoom} clearable={true} filterable={true} onChange={this.chooseTopCondition.bind(this, 3)} placeholder="请选择教室">
                                    {
                                        this.state.roomList.map(el => {
                                            return <Select.Option key={el.id} label={el.code} value={el} />
                                        })
                                    }
                                </Select>
                            </div>

                        </div>
                        <div className="row">
                            {/*<div className="col-1" style={{textAlign: 'right', height: '60px', lineHeight: '60px'}}>
                                <label>教师：</label>
                            </div>
                            <Menu defaultActive={this.state.chooseTeacher} className="el-menu-demo" mode="horizontal"
                                  onSelect={this.chooseTopCondition.bind(this, 2)}>
                                {
                                    this.state.teacherList ? this.state.teacherList.map(item2 => (
                                        <Menu.Item index={item2}>{item2.name}</Menu.Item>
                                    )) : null
                                }
                            </Menu>*/}

                        </div>
                        <div className="row">
                            <br/>
                            {/*<div className="col-1" style={{textAlign: 'right', height: '60px', lineHeight: '60px'}}>
                                <label>教室：</label>
                            </div>
                            <Menu defaultActive={this.state.chooseRoom} className="el-menu-demo" mode="horizontal"
                                  onSelect={this.chooseTopCondition.bind(this, 3)}>
                                {
                                    this.state.roomList ? this.state.roomList.map(item3 => (
                                        <Menu.Item index={item3}>{item3.code}</Menu.Item>
                                    )) : null
                                }
                            </Menu>*/}
                        </div>

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
                                    dateClick={this.handleDateClick}
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