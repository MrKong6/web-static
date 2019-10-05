import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import '../../Mkt/Leads/Leads.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick
import './Course.css'
import DialogForEvent from "../../Dialog/DialogForEvent";
import fmtDate from "../../../utils/fmtDate";
import {Card, Menu, Message, MessageBox} from "element-react";
import mainSize from "../../../utils/mainSize";
import ajax from "../../../utils/ajax";
import fmtTitle from "../../../utils/fmtTitle";


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
            teacherId: (this.props.profile && this.props.profile.teacherId) ? this.props.profile && this.props.profile.teacherId : 999999999,
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
            chooseTeacher: (this.props.profile && this.props.profile.teacherId) ? this.props.profile && this.props.profile.teacherId : 0,
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
                this.state.chooseTeacher = null;
                this.state.chooseRoom = null;
                this.state.chooseClass = evt.id;
                this.title.name = evt.code;
                break;
            }
            case(2): {
                this.state.chooseTeacher = evt.id;
                this.state.chooseRoom = null;
                this.state.chooseClass = null;
                this.title.name = evt.name;
                break;
            }
            case(3): {
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
            this.delAssignClass(selected.id);
        }
        const request = async () => {
            try {
                let param =  {classId: selected.chooseClass,
                    teacherId: selected.chooseTeacher,roomId: selected.chooseRoom,
                    startTime: selected.startTime,endTime: selected.endTime,comment: selected.comment,xunhuanEndDate:selected.xunhuanEndDate};
                await ajax('/academy/class/assignClass.do',{"assignVo":JSON.stringify(param)});
                Message({
                    message: "成功",
                    type: 'info'
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
    delAssignClass(id) {
        const request = async () => {
            try {
                //事件列表
                let assignClassList = await ajax('/academy/class/delAssignClass.do', {id: id});
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
        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>&nbsp;{this.title.text}|&nbsp;&nbsp;{this.props.profile.cRealName}
                </h5>
                <div id="main" className="main p-3">
                    <div className='demo-app'>
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
                                    weekends={this.state.calendarWeekends}
                                    events={this.state.calendarEvents}
                                    /*dateClick={this.handleDateClick}*/
                                    editable={false}
                                    timeZone='local'
                                    /*eventClick={this.eventOnClick}*/
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