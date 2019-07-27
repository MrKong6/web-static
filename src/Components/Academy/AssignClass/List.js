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
import {Card, Message, MessageBox, Popover, Tooltip} from "element-react";


class List extends React.Component {

    calendarComponentRef = React.createRef();
    constructor(props) {
        super(props);
        this.state={
            calendarWeekends: true,
            droppable: false,
            editable: false,
            calendarEvents: [ // initial event data
                {   title: 'K101  Teacher Zhou',
                    start: new Date("2019-07-22 10:00"),
                    end: new Date("2019-07-22 18:00"),
                    color: "#123456",
                    textColor: "#fff",
                    id: "aaa"
                },
                {   title: 'Teacher Ashely',
                    start: new Date("2019-07-22 10:00"),
                    end: new Date("2019-07-22 15:00"),
                    color: "#456326",
                    textColor: "#fff",
                    id: "bbb"
                },
                {   title: 'Teacher Ashely Yu',
                    start: new Date("2019-07-23 9:00"),
                    end: new Date("2019-07-22 11:00"),
                    color: "#675432",
                    textColor: "#fff",
                    id: "bbb"
                }
            ],
            eventCommont:'',
        }
        this.eventMouseEnter = this.eventMouseEnter.bind(this);
        this.eventMouseLeave = this.eventMouseLeave.bind(this);
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
        MessageBox.confirm('此操作将永久删除该日程, 是否继续?', '提示', {
            type: 'warning'
        }).then(() => {
            evt.event.remove()
            Message({
                type: 'success',
                message: '删除成功!'
            });
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消删除'
            });
        });
    }

    handleDateClick = (arg) => {
        console.log(234562345);
        this.userContainer = document.createElement('div');
        ReactDOM.render(
            <DialogForEvent
                container={this.userContainer}
                typeName="1"
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
    }
    windowResize(view){
        console.log(1234565432);
    }
    titleF(date){
        return fmtDate(date.start.marker) + '-----' + fmtDate(date.end.marker);
    }
    eventMouseEnter(mouseEnterInfo ){
        this.setState({
            eventCommont: mouseEnterInfo.event.title
        })
    }
    eventMouseLeave(mouseEnterInfo ){
        this.setState({
            eventCommont: ''
        })
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
            <div className='demo-app'>
                <div className='demo-app-top'>
                    {/*<span>事件详情：</span>
                    <span>{this.state.eventCommont}</span>*/}
                    <Card className="box-card">
                        <div className="text item">事件内容：</div>
                        <div className="text item">{this.state.eventCommont}</div>
                    </Card>
                </div>
                <div className='demo-app-calendar'>
                    <FullCalendar
                        defaultView="timeGridWeek"
                        header={{
                            left: 'prev,next',/*prev,next today*/
                            center: 'title',
                            right: 'timeGridWeek,timeGridDay,listWeek'
                        }}
                        plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
                        ref={ this.calendarComponentRef }
                        weekends={ this.state.calendarWeekends }
                        events={ this.state.calendarEvents }
                        dateClick={ this.handleDateClick }
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
        )
    }
}

export default List;