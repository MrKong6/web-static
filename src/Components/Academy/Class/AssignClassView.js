import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import fmtDate from "../../../utils/fmtDate";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction' // needed for dayClick


class AssignClassView extends React.Component {
    constructor(props) {
        super(props);
        this.commands = this.props.commands.filter(command => (command.name !== 'Add' && command.name !== 'Mod'
            && command.name !== 'Del' && command.name !== 'Import' && command.name !== 'Export'&& command.name !== 'ShowNormal'));
        this.first = !(this.props.sonView.filter(view => (view.id == '5-4-1')) == false) ? 'normal' : 'none';
        this.second = !(this.props.sonView.filter(view => (view.id == '5-4-2')) == false) ? 'normal' : 'none';
        this.third = !(this.props.sonView.filter(view => (view.id == '5-4-3')) == false) ? 'normal' : 'none';
        this.fourth = !(this.props.sonView.filter(view => (view.id == '5-4-4')) == false) ? 'normal' : 'none';
        this.fifth = !(this.props.sonView.filter(view => (view.id == '5-4-5')) == false) ? 'normal' : 'none';
        this.sixth = !(this.props.sonView.filter(view => (view.id == '5-4-6')) == false) ? 'normal' : 'none';
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            id: this.props.match.params.contractId,
            data: null,
            stuName: this.props.location.state.stuName,
            calendarWeekends: true,
            droppable: false,
            editable: false,
            roomList: [],
            classList: [],
            teacherList: [],
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
        };
        this.createDialogTips = this.createDialogTips.bind(this);
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

    //刷新事件列表
    refreshAssignClass() {
        const request = async () => {
            try {
                //事件列表
                let assignClassList = await ajax('/academy/class/assignClassList.do', {orgId: this.state.group.id,classId:this.state.id,
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
                <Redirect to="/home/academy/class"/>
            )
        }


        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                    &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
                    <p className="d-inline text-muted">{this.state.stuName}</p>
                </h5>
                <div id="main" className="main p-3">
                    <div className="row" style={{"height": '60%'}}>
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
                                        firstDay={1}
                                        editable={false}
                                        timeZone='local'
                                        /*eventClick={this.eventOnClick}*/
                                        minTime='07:00:00'
                                        maxTime='22:00:00'
                                        titleFormat={this.titleF}
                                        /*handleWindowResize={false}
                                        windowReSize={this.windowResize}
                                        aspectRatio={1.1}*/
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <nav aria-label="breadcrumb" style={{"zIndex":"3456789"}}>
                            <ol className="breadcrumb location_bottom">
                                <li className="breadcrumb-item" style={{"display":this.first}}><Link
                                    to={`/home/academy/class/${this.state.id}`}>班级基本信息</Link></li>
                                <li className="breadcrumb-item active" style={{"display":this.second}}>
                                    <Link to={{
                                        pathname: `/home/academy/class/student/${this.state.id}`,
                                        state: {stuName: this.state.stuName}
                                    }}>班级学员信息</Link>
                                </li>
                                <li className="breadcrumb-item" style={{"display":this.third}}>
                                    <Link to={{
                                        pathname: `/home/academy/class/teacher/${this.state.id}`,
                                        state: {stuName: this.state.stuName}
                                    }}>班级教师信息</Link>
                                </li>
                                <li className="breadcrumb-item" style={{"display":this.fourth}}>
                                    班级课程表
                                </li>
                                <li className="breadcrumb-item" style={{"display":this.fifth}}><Link to={{
                                    pathname: `/home/academy/class/clocked/${this.state.id}`,
                                    state: {stuName: this.state.stuName}
                                }}>班级考勤信息</Link></li>
                                <li className="breadcrumb-item" style={{"display":this.sixth}}><Link to={``}>班级异动信息</Link></li>
                            </ol>
                        </nav>
                    </div>

                </div>
            </div>
        )
    }
}

export default AssignClassView;