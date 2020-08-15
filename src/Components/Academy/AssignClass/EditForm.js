import React from 'react'
import ReactDOM from 'react-dom'
import 'react-day-picker/lib/style.css';

import DialogTips from "../../Dialog/DialogTips";

import ajax from "../../../utils/ajax";
import CONFIG from '../../../utils/config';

import fmtDate, {addDate, formatWithDateAndTime, getNumByWeek, getWeekDate} from "../../../utils/fmtDate";
import calculateAge from "../../../utils/calculateAge";
import {Button,  Tabs, DatePicker, Icon, Input, Layout, Radio, Select, TimePicker} from "element-react";
import {changeArrayItemToInt, changeArrayItemToString, changeStringToArrayInt} from "../../../utils/objectToArray";

const WEEKNAME=CONFIG.WEEKNAME;
class EditForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            group: this.props.changedCrmGroup,
            startDate: null,
            endDate: 0,
            option: null,
            data: null,
            startTime: null,
            endTime: null,
            id: this.props.editorId,
            showType: this.props.type,  //1是当前课次  2是所有课次
            roomList: [],
            teacherList: [],
            chooseTeacher: [],
            roomId: null,
            roomCode: null,
            loopTrue: "2",
            roomList: [],
            teacherList: [],
            teacherId: [],
            registrar: [],
            checkWeek: null,
            checkMuiltiWeek: [],
            form: {},
            rules: {},
            defaultClickTab: 1,
            weeks: [
                {
                    date1: null,
                    week1: true,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 1,
                    name: '周一',
                    items: [],
                }, {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 2,
                    name: '周二',
                    items: [],
                }, {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 3,
                    name: '周三',
                    items: [],
                }, {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 4,
                    name: '周四',
                    items: [],
                }, {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 5,
                    name: '周五',
                    items: [],
                }, {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 6,
                    name: '周六',
                    items: [],
                }, {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 7,
                    name: '周日',
                    items: [],
                }],
            weeksDataSource: [
                {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 1,
                    name: '周一',
                    items: [
                        {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx: 1,
                        }, {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx: 2,
                        }],
                }, {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 2,
                    name: '周二',
                    items: [
                        {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx: 1,
                        }, {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx: 2,
                        }],
                }, {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 3,
                    name: '周三',
                    items: [
                        {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx: 1,
                        }, {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx: 2,
                        }],
                }, {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 4,
                    name: '周四',
                    items: [
                        {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx: 1,
                        }, {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx: 2,
                        }],
                }, {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 5,
                    name: '周五',
                    items: [
                        {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx: 1,
                        }, {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx: 2,
                        }],
                }, {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 6,
                    name: '周六',
                    items: [
                        {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx: 1,
                        }, {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx: 2,
                        }],
                }, {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 7,
                    name: '周日',
                    items: [
                        {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx: 1,
                        }, {
                            date1: null,
                            week1: false,
                            roomId1: null,
                            teacherId1: [],
                            teacherId2: [],
                            idx: 2,
                        }],
                }],
            weekDate: []
        };
        this.changeBirthday = this.changeBirthday.bind(this);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.getFormValue = this.getFormValue.bind(this);
        this.chooseRoom = this.chooseRoom.bind(this);
        this.chooseMainTeacher = this.chooseMainTeacher.bind(this);
        this.changeCourseType = this.changeCourseType.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.changedDate = this.changedDate.bind(this);
        this.changeTabs = this.changeTabs.bind(this);
        this.changeWeekItem = this.changeWeekItem.bind(this);
        this.weekContentChange = this.weekContentChange.bind(this);

    }

    componentDidMount() {
        const request = async () => {
            try {

                let teacherId = [];
                let data = await ajax('/academy/class/assignClassById.do', {csId: this.state.id,type:this.state.showType});
                let roomList = await ajax('/academy/room/list.do', {orgId: this.state.group.id});
                let teacherList = await ajax('/academy/teacher/list.do', {orgId: this.state.group.id});
                let registrarList = await ajax('/user/listUserByRole.do', {orgId: this.state.group.id,type:5});

                let weeks = [],checkWeek = null,checkMuiltiWeek = [],weeksDataSource = this.state.weeksDataSource;
                data = data.data;
                let mid = null;
                let weekDate = getWeekDate(data[0].startTime);
                //根据日期找到当前日期对应的当前周的日期
                weeksDataSource.map(source => {
                    mid = source;
                    mid.items = [];
                    data.map(vo => {
                        if(vo.weekName == mid.name){
                            mid.items.push({date1: new Date(vo.startTime),
                                week1: true,
                                roomId1: Number(vo.roomId),
                                teacherId1: changeStringToArrayInt(vo.teacherId),
                                teacherId2: changeStringToArrayInt(vo.registrarId),
                                ch:vo.currentClassHour,
                                ct:vo.currentClassTime,
                                id:vo.id});
                            mid.week1 = true;
                        }
                    });
                    if(mid.items.length > 0){
                        source.items = mid.items;
                    }
                    mid.weekDate = weekDate[source.idx-1];
                    weeks.push(mid);
                });
                data = data[0];
                let defaultClickTab = Number(getNumByWeek(data.weekName));


                this.setState({
                    checkWeek,checkMuiltiWeek,weeksDataSource,weekDate,
                    roomList: roomList.data.items,
                    teacherList: teacherList.data.items,
                    registrarList: registrarList,
                    startTime: data.startTime ? new Date(data.startTime) : new Date(),
                    endTime: data.endTime ? new Date(data.endTime) : new Date(),
                    // roomId: data.roomId ? (data.roomId.indexOf(0) == 0 ? Number(data.roomId.substr(1,data.roomId.length)) : data.roomId) : null,
                    roomId: Number(data.roomId),
                    chooseTeacher: teacherId,
                    teacherId: changeStringToArrayInt(data.clTeacherId),
                    registrar: changeStringToArrayInt(data.clRegistrarId),
                    startDate: new Date(data.loopStartTime),
                    endDate: new Date(data.xunhuanEndDate),
                    data: data,
                    weeks,weeksDataSource,defaultClickTab
                }, () => {
                    if (this.props.isEditor) {
                        const keys = Object.keys(data);
                        keys.map(key => {
                            if (this.form[key]) {
                                if (key === 'createOn') {
                                    this.form[key].value = fmtDate(data[key]);
                                }else{
                                    this.form[key].value = data[key];
                                }
                            }
                        });
                    }

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

    packItems(vo,idx) {
        let one =  {
            date1: new Date(vo.startTime),
            week1: true,
            roomId1: Number(vo.roomId),
            teacherId1: [],
            teacherId2: [],
            idx:idx,
            ch:vo.currentClassHour,
            ct:vo.currentClassTime,
            id:vo.id,
        }, teacherId = [],registrarId=[];
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
        return one;
    }

    // 更新表单值
    handleSelect(type, key, value) {
        if(key == 'showWeek'){
            //选择显示排周几的课
            let weeks = this.state.weeks;
            if (value && value.length > 0) {
                let size = (this.state.form.classHour / this.state.form.classTime);
                size = size ? size : 2;
                weeks.map(item => {
                    if (item.idx == value[0]) {
                        if (item.items && item.items.length > 0) {
                            item.week1 = true;
                        } else {
                            /* let chooseItems = [];
                             for (let i = 0; i < size; i++) {
                                 chooseItems.push({
                                     date1: null,
                                     week1: true,
                                     roomId1: null,
                                     teacherId1: this.state.form.teacherId,
                                     teacherId2: this.state.form.registrar,
                                     idx: (i + 1),
                                     show: i == 0 ? "none" : "normal",
                                     teacherList: []
                                 });
                             }
                             item.items = chooseItems;*/
                        }
                    }else{
                        // item.week1 = false;

                    }
                });
            }
            this.setState({weeks});
        }else if(key == 'week'){
            let weeks = this.state.weeks;
            weeks[(type-1)].week1 = value;
            /*weeks[(type - 1)].items.map(item => {
                if(value){
                    item.teacherId1 = this.state.form.teacherId;
                }else{
                    item.teacherId1 = [];
                    item.date1 = null;
                    item.roomId1 = null;
                    item.teacherId2 = [];
                }
            });*/
            this.setState({weeks});
        }else if (key.indexOf("date") != -1 || key.indexOf("week") != -1 || key.indexOf("Date") != -1) {
            if (key.indexOf("startDate") != -1) {
                //选中开始日期  更新结课日期
                let endDate = this.changedDate(value);
                this.setState({
                    form: Object.assign({}, this.state.form, {["endDate"]: endDate, [key]: value})
                });
            } else {
                this.setState({
                    form: Object.assign({}, this.state.form, {[key]: value})
                });
            }
        } else if(key == 'teacherId'){
            this.state.teacherId = value;
            // let weeks = this.state.weeks;
            // weeks.map(item => {
            //     if(item.items && item.items.length > 0){
            //         item.items.map(vo => {
            //             vo.teacherId1 = value;
            //         });
            //     }
            // })
            // this.setState({weeks});
        }else if(key == 'registrar'){
            this.state.registrar = value;
            // let weeks = this.state.weeks;
            // weeks.map(item => {
            //     if(item.items && item.items.length > 0){
            //         item.items.map(vo => {
            //             vo.teacherId1 = value;
            //         });
            //     }
            // })
            // this.setState({weeks});
        }else {
            //找到选中班级
            // let items = this.state.weeks[0].items,weeks = this.state.weeks;
            let change = false;
            if (key == "classId") {
                this.state.classList.map(item => {
                    if (item.id == value) {
                        this.state.form["classHour"] = item.classHour;
                        this.state.form["classTime"] = item.classTime;
                        this.state.form["currentClassTime"] = item.currentClassTime;
                        this.state.form["courseRange"] = item.courseRange;
                        this.state.form["courseType"] = item.courseType;
                        this.state.form["time"] = item.time;
                        this.state.form["classId"] = item.id;
                        //每天中有几个课时
                        /*if(item.classHour && item.classTime){
                            let size = item.classHour / item.classTime;
                            if(size != items.length){
                                change = true;
                                items = [];
                                for(let i=0;i<size;i++){
                                    items.push( {
                                        date1: null,
                                        week1: false,
                                        roomId1: null,
                                        teacherId1: [],
                                        teacherId2: [],
                                        idx:(i+1),
                                    });
                                }
                                weeks.map(item => {
                                    item.items = items;
                                });
                            }
                        }*/
                    }
                })
            }
            if(change){
                this.setState({
                    classId: this.state.form["classId"],
                    // weeks: weeks
                });
            }else{
                this.setState({
                    classId: this.state.form["classId"]
                });
            }
        }
    }

    //更新日期
    changedDate(startDate) {
        if(startDate && this.state.form.classTime){
            startDate = new Date(startDate.getTime() + 7 * this.state.data.classTime * 24 * 60 * 60 * 1000);;
        }
        return startDate;
    }
    componentWillUnmount() {
        if (this.tipsContainer) {
            document.body.removeChild(this.tipsContainer);
        }

        if (this.actContainer) {
            document.body.removeChild(this.actContainer);
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

    changeBirthday(day) {
        const birthday = day;
        const age = calculateAge(birthday);

        this.setState({birthday, age});
    }

    getFormValue() {

        let query = this.state.data;
        query.showType = this.state.showType;

        let items = [];
        this.state.weeks.map(vo => {
            vo.items.map(id => {
                id.name = vo.name;
                id.date1 = formatWithDateAndTime(vo.weekDate,id.date1);
                items.push(id);
            });
        });
        if (items.length <= 0) {
            return
        }
        query.courseList = items;
        // query.weekName = this.state.weeks[0].name;
        // query.loopTrue = this.state.loopTrue; //1是循环 2是不循环
        query.loopStartTime = new Date(query.loopStartTime);
        query.xunhuanEndDate = new Date(query.xunhuanEndDate);
        query.startTime = new Date(this.state.startTime);
        query.endTime = new Date(this.state.endTime);
        query.createOn = new Date();
        // query.id = this.state.id;
        let teacherNames=[];
        if(this.state.teacherId && this.state.teacherId.length >0){
            this.state.teacherId.map(id=> {
                let teacher = this.state.teacherList.filter(item => item.id == id);
                teacherNames.push(teacher[0].name);
            });
        }
        query.teacherId = changeArrayItemToString(this.state.teacherId);
        query.teacherName = changeArrayItemToString(teacherNames);
        let rNames=[];
        if(this.state.registrar && this.state.registrar.length >0){
            this.state.registrar.map(id=> {
                let teacher = this.state.teacherList.filter(item => item.id == id);
                rNames.push(teacher[0].name);
            });
        }
        query.registrarId = changeArrayItemToString(this.state.registrar);
        query.registrarName = changeArrayItemToString(teacherNames);
        //
        // for (let i = 0; i < this.form.length; i++) {
        //     if (this.form[i].name) {
        //         if (this.form[i].name === 'startTime' || this.form[i].name === 'endTime') {
        //             query[this.form[i].name] = new Date(this.form[i].value).getTime();
        //         } else {
        //             query[this.form[i].name] = this.form[i].value;
        //         }
        //     }
        // }

        return query;
    }

    chooseRoom(evt){
        this.state.roomList.map(item =>{
            if(item.id == evt){
                this.setState({roomId:evt,roomCode:item.code});
            }
        });
    }

    chooseMainTeacher(data){
        this.state.mainTeacherIds = data;
    }

    changeCourseType(evt){
        const request = async () => {
            let allClassCourse = await ajax('/academy/class/classCourseType.do',{orgId: this.state.group.id,courseType:evt.target.value});
            if(allClassCourse){
                let allClassCourseRange = allClassCourse.range;
                this.setState({
                    allClassCourseRange:allClassCourseRange,
                });
            }
        };
        request()
    }

    //改变导航
    changeTabs(evg) {
        this.handleSelect(null, "showWeek", [evg.props.name])
    }

    //增加或删除排课课时
    changeWeekItem(type, itemId, weekIdx) {
        let weeks = this.state.weeks;
        let that = this;

        if (type == 2) {
            //新增一课时
            let index = 0;
            weeks.map(item => {
                if (item.items && item.idx == weekIdx) {
                    //设置当前课时数
                    if(item.items && item.items.length > 0){
                        index = item.items[item.items.length-1].ch + 1;
                    }else{
                        index = this.state.data.currentClassHour;
                    }
                    item.items.push({
                        date1: null,
                        week1: true,
                        roomId1: null,
                        teacherId1: that.state.teacherId,
                        teacherId2: that.state.registrar,
                        idx: (item.items.length + 1),
                        ch: index,
                        ct: this.state.data.currentClassTime
                    });
                }
            });
        } else {
            weeks.map(item => {
                if (item.items && item.items.length > 0 && item.idx == weekIdx) {
                    item.items = item.items.filter(vo => vo.ch != itemId);
                }
            });
            this.resetIndx(weeks);
        }
        this.setState({weeks});
    }

    //课时条目的内容发生变动
    weekContentChange(itemId, weekIdx, value){
        let weeks = this.state.weeks;

        this.resetIndx(weeks);
        weeks.map(item => {
            if (item.items && item.items.length > 0 && item.idx == weekIdx) {
                item.items.map(vv => {
                    if(vv.idx == itemId){
                        //找到相应的课时
                        this.state.courses.map(cou => {
                            if(cou.courseId == value){
                                vv.teacherId1 = cou.teacherId;
                                vv.teacherId2 = cou.registrar;
                                vv.courseId = value;
                                vv.teacherList = cou.teacherList;
                                if(value){
                                    item.week1 = true;
                                }
                                if(!vv.ch){
                                    vv.ch = cou.ch + 1;
                                }
                            }
                        })
                    }
                });
            }
        });
        this.resetIndx(weeks);
        this.setState({weeks});
    }

    //重置显示课时
    resetIndx(weeks){
        //最初的课时
        let startCourse = this.state.data.currentClassHour;
        weeks.map(item => {
            if(item.items && item.items.length > 0){
                item.items.map(vv => {
                    vv.ch = startCourse++;
                });
            }
        });
    }

    //改变日期范围
    changeDateRange(val1, evt){
        let weekDate = this.state.weekDate;
        let weeks = this.state.weeks;
        if(val1 == 1){
            //右移一周
            weekDate.map(item => {
                item = addDate(item, 7);
            });
            weeks.map(item => {
                item.weekDate = addDate(item.weekDate, 7);
            });
        }else if(val1 == 2){
            //左移一周
            weekDate.map(item => {
                item = addDate(item, -7);
            });
            weeks.map(item => {
                item.weekDate = addDate(item.weekDate, -7);
            });
        }
        this.setState({weekDate,weeks});
    }

    render() {
        let that = this;
        return (
            <form ref={(dom) => {
                this.form = dom
            }} encType='multipart/form-data'>
                <div className="row justify-content-md-center">
                    <div className="col col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>班级编号
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="classCode"
                                                       required={true} disabled={true}/>
                                            </div>
                                        </div>
                                        {/*<div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>课程类型
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="courseType"
                                                       required={true} disabled={true}/>
                                            </div>
                                        </div>*/}
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>课程阶段
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="courseName"
                                                       required={true} disabled={true}/>
                                            </div>
                                        </div>
                                        {/*<div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>总课时
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="classHour"
                                                       required={true} disabled={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>总课次
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="classTime"
                                                       required={true} disabled={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>课程时长
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="time"
                                                       required={true} disabled={true}/>
                                            </div>
                                        </div>*/}
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>当前课次
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="currentClassTime"
                                                       required={true} disabled={true}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>主教
                                            </label>
                                            <div className="col-7">
                                                <Select name="teacherId" value={this.state.teacherId} placeholder="请选择教师" multiple={true}
                                                        filterable={true} clearable={true} style={{"width":"100%"}}
                                                        onChange={this.handleSelect.bind(this, 1, "teacherId")}>
                                                    {
                                                        (this.state.teacherList && this.state.teacherList.length > 0) ? this.state.teacherList.map(el => {
                                                            return <Select.Option key={el.id} label={el.name} value={el.id}/>
                                                        }) : null
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>助教
                                            </label>
                                            <div className="col-7">
                                                <Select name="registrar" value={this.state.registrar} placeholder="请选择教务"  multiple={true}
                                                        filterable={true} clearable={true} style={{"width":"100%"}}
                                                        onChange={this.handleSelect.bind(this, 1, "registrar")}>
                                                    {
                                                        (this.state.teacherList && this.state.teacherList.length > 0) ? this.state.teacherList.map(el => {
                                                            return <Select.Option key={el.id} label={el.name} value={el.id}/>
                                                        }) : null
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>开课日期
                                            </label>
                                            <div className="col-7">
                                                <DatePicker
                                                    name="startDate"
                                                    value={this.state.startDate}
                                                    placeholder="选择日期"
                                                    isDisabled={true}
                                                    onChange={this.handleSelect.bind(this, 1, 'startDate')}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>结课日期
                                            </label>
                                            <div className="col-7">
                                                <DatePicker
                                                    name="endDate"
                                                    value={this.state.endDate}
                                                    isDisabled={true}
                                                />
                                            </div>
                                        </div>
                                        {/*<div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">作用范围</label>
                                            <div className="col-7">
                                                <Select value={this.state.loopTrue} style={{width:'100%'}} placeholder="请选择"
                                                        onChange={date => {
                                                            this.setState({loopTrue: date})
                                                        }}>
                                                    <Select.Option key="2" label="当前课次" value="2"/>
                                                    <Select.Option key="1" label="当前及以后课次" value="1"/>
                                                </Select>
                                            </div>
                                        </div>*/}

                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-0.5">
                                        <Button type="primary" icon="arrow-left" onClick={this.changeDateRange.bind(this,2)}></Button>
                                    </div>
                                    <Tabs type="border-card" activeName={this.state.defaultClickTab} className="col-11"
                                          onTabClick={this.changeTabs.bind(this)}>
                                        {that.state.weeks.map(function (vo) {
                                            return (  /*vo.name*/
                                                <Tabs.Pane label={ <span style={{"color": vo.items.length > 0 ? "red" : "black"}}><Icon name="date" /> {vo.name + '(' +vo.weekDate + ')'}</span>} name={vo.idx}>
                                                    <div className="row">
                                                        <div className="col-2 grid-content bg-purple"
                                                            /*style={{"display": item.show}}*/>
                                                            <Button type="primary" icon="plus" size='small'
                                                                    onClick={that.changeWeekItem.bind(this, 2, vo.idx, vo.idx)}></Button>
                                                        </div>
                                                    </div>
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
                                                                    <div className="col-1">{item.ch}</div>
                                                                    <div className="col-2 grid-content bg-purple">
                                                                        <TimePicker
                                                                            value={item.date1}
                                                                            selectableRange="6:30:00 - 22:30:00"
                                                                            placeholder="开始上课日期"
                                                                            onChange={date => {
                                                                                item.date1 = date;
                                                                            }}
                                                                        />
                                                                    </div>

                                                                    <div className="col-2 grid-content bg-purple">
                                                                        <Select value={item.roomId1} placeholder="教室"
                                                                                filterable={true}
                                                                                clearable={true} style={{"width": "100%"}}
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
                                                                                filterable={true} multiple={true}
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
                                                                                filterable={true} multiple={true}
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
                                                                    <div className="col-1 grid-content bg-purple"
                                                                        /*style={{"display": item.show}}*/>
                                                                        <Button type="danger" icon="close"
                                                                                onClick={that.changeWeekItem.bind(this, 1, item.ch, vo.idx)}></Button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </Tabs.Pane>
                                            )
                                        })}
                                    </Tabs>
                                    <div className="col-0.5">
                                        <Button type="primary" onClick={this.changeDateRange.bind(this,1)}><i className="el-icon-arrow-right el-icon-right"></i></Button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

export default EditForm;