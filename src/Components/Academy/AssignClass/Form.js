import React from 'react'
import ReactDOM from 'react-dom'

import {Button, DatePicker, Form, Icon, Input, Layout, Message, Select, Tabs, TimePicker} from "element-react";
import 'react-day-picker/lib/style.css';
import './AssignClass.css';

import DialogTips from "../../Dialog/DialogTips";
import CONFIG from '../../../utils/config';

import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import {addDate, formatWithDateAndTime, getTimeFourByDate, getWeekDate, getWeekDateByDate, stringToDate} from "../../../utils/fmtDate";
import {arrayAppend, changeArrayItemToString, deepClone, getArrayIndex, getSubArray} from "../../../utils/objectToArray";
import {AssignCommonCode} from "../../Dic/AssignCommonCode";
import fmtDate from "../../../utils/fmtDate";

const WEEKNAME = CONFIG.WEEKNAME;

class AssignForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            group: this.props.changedCrmGroup,
            birthday: null,
            age: 0,
            option: null,
            data: null,
            roomList: [],
            classList: [],
            teacherList: [],
            registrarList: [],
            checkWeekList: [],
            weeks: [
                {
                    date1: null,
                    week1: true,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 1,
                    ct:null,
                    name: '周一',
                    items: [],
                }, {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 2,
                    ct:null,
                    name: '周二',
                    items: [],
                }, {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 3,
                    ct:null,
                    name: '周三',
                    items: [],
                }, {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 4,
                    ct:null,
                    name: '周四',
                    items: [],
                }, {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 5,
                    ct:null,
                    name: '周五',
                    items: [],
                }, {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 6,
                    ct:null,
                    name: '周六',
                    items: [],
                }, {
                    date1: null,
                    week1: false,
                    roomId1: null,
                    teacherId1: [],
                    teacherId2: [],
                    idx: 7,
                    ct:null,
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
            id: this.props.data ? this.props.data.id : null,
            form: {
                name: null,
                classId: null,
                teacherId: [],
                registrar: [],
                roomId: null,
                classHour: null,
                classTime: null,
                time: null,
                courseRange: null,
                startDate: null,
                endDate: null,
                loopTrue: "1",
                currentClassTime: null,

                delivery: false,

                resource: '',
                desc: '',
            },
            rules: {
                /*classId: [
                    { required: false, message: '请输入密码', trigger: 'change' },
                    /!*{ validator: (rule, value, callback) => {
                        debugger
                        /!*if (value === '') {
                            callback(new Error('请选择班级'));
                        } else {
                            callback();
                        }}*!/
                    }*!/
                ],*/
                /* startDate: [
                     { required: true, message: '请选择开课日期', trigger: 'change' }
                 ]*/
            },
            courses: [/*{
                courseId: null,
                courseName: "瑞思英语（K1）",
                teacherId: [],
                registrar: [],
            }, {
                courseId: null,
                courseName: "大语文（S1）",
                teacherId: [],
                registrar: [],
            }*/],
            keepWeeksAll:[],  //全局缓存  用于存放切换周再切换回去后的数据
            weekDate:[]
        }
        this.handleSelect = this.handleSelect.bind(this);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.getFormValue = this.getFormValue.bind(this);
        this.changedDate = this.changedDate.bind(this);
        this.chooseClass = this.chooseClass.bind(this);
        this.accept = this.accept.bind(this);
        this.changeWeekItem = this.changeWeekItem.bind(this);
        this.changeTabs = this.changeTabs.bind(this);
        this.weekContentChange = this.weekContentChange.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {

                let roomList = await ajax('/academy/room/list.do', {orgId: this.state.group.id});
                let teacherList = await ajax('/academy/teacher/list.do', {orgId: this.state.group.id});
                let registrarList = await ajax('/user/listUserByRole.do', {orgId: this.state.group.id, type: 5});
                let classList = await ajax('/academy/class/clsListWithCourse.do', {
                    orgId: this.state.group.id,
                    limit: 9999,
                    showAssignStatus: 1
                });
                let data = null, dateRange = [], hasEnd = 0, weeks = this.state.weeks;
                let weekDate = getWeekDateByDate(new Date());
                weeks.map(mid => {
                    mid.weekDate = weekDate[mid.idx-1];
                });
                let keepWeeksAll = [];
                arrayAppend(keepWeeksAll, weeks);

                this.setState({
                    classList: classList.data,
                    teacherList: teacherList.data.items,
                    roomList: roomList.data.items,
                    registrarList: registrarList,
                    weeks,keepWeeksAll,weekDate,
                    form: {
                        name: null,
                        classId: data ? data.classId : null,
                        teacherId: [],
                        registrar: [],
                        roomId: data ? data.roomId : null,
                        classHour: null,
                        classTime: null,
                        courseRange: null,
                        startDate: null,
                        endDate: null,
                        loopTrue: "1",
                        currentClassTime: null,
                    }
                });
                // this.handleSelect(null, "showWeek", [1])
                if(this.props.classId){
                    this.handleSelect(null, "classId", this.props.classId)
                }
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
        mainSize();
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

    // 更新表单值
    handleSelect(type, key, value) {
        console.log(type, key, value);
        if (key == 'showWeek') {
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
        } else if (key == 'week') {
            let weeks = this.state.weeks;
            weeks[(type - 1)].week1 = value;
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
        } else if (key.indexOf("date") != -1 || key.indexOf("week") != -1 || key.indexOf("Date") != -1) {
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
        } else if (key == 'teacherId') {
            /*this.state.form.teacherId = value;
            let weeks = this.state.weeks;
            weeks.map(item => {
                if (item.items && item.items.length > 0) {
                    item.items.map(vo => {
                        vo.teacherId1 = value;
                    });
                }
            })
            this.setState({weeks});*/
            let courses = this.state.courses;
            courses.map(item => {
                if(item.courseName == type){
                    item.teacherId = value;
                }
            });
            this.state.courses = courses;
            this.setState({courses});

        } else if (key == 'registrar') {
            /*this.state.form.registrar = value;
            let weeks = this.state.weeks;
            weeks.map(item => {
                if (item.items && item.items.length > 0) {
                    item.items.map(vo => {
                        vo.teacherId2 = value;
                    });
                }
            })
            this.setState({weeks});*/
            let courses = this.state.courses;
            courses.map(item => {
                if(item.courseName == type){
                    item.registrar = value;
                }
            });
            this.state.courses = courses;
            this.setState({courses});
        } else {
            //找到选中班级
            // let items = this.state.weeks[0].items,weeks = this.state.weeks;
            let change = false;
            if (key == "classId") {
                let courses = [];
                this.state.classList.map(item => {
                    if (item.id == value) {
                        if(item.courses && item.courses.length > 0){
                            item.courses.map(cou => {
                                courses.push({
                                    courseId: cou.id,
                                    weekNum: cou.classHourPerWeek ? (cou.classHour / cou.classHourPerWeek) : 0,
                                    courseName: cou.courseType + '(' + cou.name + ')',
                                    teacherId: [],
                                    registrar: [],
                                    teacherList: this.state.teacherList ? this.state.teacherList.filter(item => {
                                        if(item.courseId){
                                            let judge = false;
                                            item.courseName.split(",").map(sp => {
                                                if(sp == cou.courseType){
                                                    judge = true;
                                                }
                                            });
                                            return judge;
                                        }
                                    }) : []
                                });
                            });
                        }
                    }
                })
                console.log(courses);
                this.setState({courses:courses});
            }
            if (change) {
                this.setState({
                    classId: value,
                    // weeks: weeks
                });
            } else {
                this.setState({
                    classId: value
                });
            }
        }
    }

    //改变导航
    changeTabs(evg) {
        this.handleSelect(null, "showWeek", [evg.props.name])
    }

    //更新日期
    changedDate(startDate) {
        //课程的课次数求和
        let clsTime = 0;
        let weekNum = 0;
        this.state.courses.map(item => {
            if(item.weekNum > weekNum){
                weekNum = item.weekNum;
            }
        });
        if (startDate && weekNum) {
            startDate = new Date(startDate.getTime() + 7 * weekNum * 24 * 60 * 60 * 1000);
            ;
        }
        return startDate;
    }

    //选中班级
    chooseClass(id) {
        this.state.classList.map(item => {
            if(item.id == id){
                console.log(item);
            }
        });
        /*const request = async () => {
            try {

                let data = await ajax('/academy/class/query.do', {id: id});
                data = data.data;
                if (data && data.mainTeacher) {
                    if (data.mainTeacher.indexOf(",") != -1) {
                        this.setState({
                            chooseTeacher: data.mainTeacher.split(",")[0]
                        });
                    } else {
                        this.setState({
                            chooseTeacher: data.mainTeacher
                        });
                    }
                }
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
        request();*/
    }

    getFormValue() {
        console.log(this.state.weeks);
        let retval = null;
        if (!this.state.form.startDate) {
            this.createDialogTips(`请完善开课日期`);
        }
        retval = this.accept();
        return retval;
    }

    accept() {
        let query = {};
        let course = null;
        let teacherId = null, helpTeacherId = null, chooseTeacherId = [],chooseRegistrarId = [];
        //先将本weeks里面选择的排课信息同步到全局缓存keepWeeksAll中
        this.state.weeks.map(item => {
            this.state.keepWeeksAll.map(vo => {
                if(item.weekDate == vo.weekDate){
                    //表明同一天
                    vo.items = deepClone(item.items);
                }
            });
        });
        //封装排课信息
        let weeks = this.state.keepWeeksAll.filter(item => item.items.length > 0);
        console.log(weeks);
        weeks.map(vo => {
            let hasTeacherId = [];
            vo.items.map(item => {
                hasTeacherId = [];
                if (course != null) {
                    course = course + "、";
                }
                course = (course ? course : "") + vo.name;
                if (item.date1) {
                    course = course + getTimeFourByDate(item.date1);
                } else {
                    console.log(`请完善排课信息时间`,item);
                    this.createDialogTips(`请完善排课信息时间`);
                    return;
                }
                if (item.roomId1) {
                    course = course + item.roomId1;
                } else {
                    console.log(`请选择排课信息对应教室编码`);
                    this.createDialogTips(`请选择排课信息对应教室编码`);
                    return;
                }
                if (item.courseId) {
                    course = (course + "/" + item.courseId);
                } else {
                    console.log(`请选择排课信息对应课程编码`);
                    this.createDialogTips(`请选择排课信息对应课程编码`);
                    return;
                }
                if (item.teacherId1 && item.teacherId1.length > 0) {
                    teacherId = null;
                    item.teacherId1.map(id => {
                        if (hasTeacherId.length == 0 || hasTeacherId.filter(str => (str == id)).length == 0) {
                            hasTeacherId.push(id);
                            teacherId = (teacherId + id + ",");
                        }
                    });
                    if (teacherId) {
                        teacherId = teacherId.substring(0, teacherId.length - 1);
                        course = (course + "/" + teacherId);
                    }
                } else {
                    console.log(`请选择排课信息对应主教信息`);
                    this.createDialogTips(`请选择排课信息对应主教信息`);
                    return;
                }
                if (item.teacherId2 && item.teacherId2.length > 0) {
                    hasTeacherId = [];
                    helpTeacherId = null;
                    item.teacherId2.map(id => {
                        if (hasTeacherId.length == 0 || hasTeacherId.filter(str => (str == id)).length == 0) {
                            hasTeacherId.push(id);
                            helpTeacherId = (helpTeacherId + id + ",");
                        }
                    });
                    if (helpTeacherId) {
                        helpTeacherId = helpTeacherId.substring(0, helpTeacherId.length - 1);
                        course = (course + "/" + helpTeacherId);
                    }
                } else {
                    // console.log(`请选择排课信息对应助教信息`);
                    // this.createDialogTips(`请选择排课信息对应助教信息`);
                    // return;
                }
            });
        });

        //封装排课时修改的课程对应的主教和助教信息
        let teacherList = this.state.teacherList;
        this.state.courses.map(item => {
            if(item.teacherId){
                //主教
                let teacherName = [];
                item.teacherId.map(t => {
                    let teacher = teacherList.filter(tl => tl.id == t);
                    if(teacher.length > 0){
                        teacherName.push(teacher[0].name);
                    }
                });
                item.teacherName = changeArrayItemToString(teacherName);
                item.teacherId = changeArrayItemToString(item.teacherId);
                if(chooseTeacherId.filter(vo => vo == item.teacherId).length == 0){
                    chooseTeacherId.push(item.teacherId);
                }
            }
            //助教
            if(item.registrar && item.registrar.length > 0){
                let teacherName = [];
                item.registrar.map(t => {
                    let teacher = teacherList.filter(tl => tl.id == t);
                    if(teacher.length > 0){
                        teacherName.push(teacher[0].name);
                    }
                });
                item.registrarName = changeArrayItemToString(teacherName);
                item.registrarId = changeArrayItemToString(item.registrar);
                if(chooseRegistrarId.filter(vo => vo == item.registrar).length == 0){
                    chooseRegistrarId.push(item.registrar);
                }
            }
            item.teacherList = null;
        })
        query.classCourseDtos = this.state.courses;

        query.loopStartTime = this.state.form.startDate ? this.state.form.startDate : null;
        query.xunhuanEndDate = this.state.form.endDate ? this.state.form.endDate : null;
        query.course = course;
        query.id = this.state.id;
        query.loopId = this.state.loopId;
        query.chooseClass = this.state.classId;
        query.classTime = this.state.form.classTime;
        query.loopTrue = this.state.form.loopTrue; //1是循环 2是不循环
        query.chooseTeacher = teacherId;


        if (chooseTeacherId.length > 0) {
            query.teacherId = changeArrayItemToString(chooseTeacherId);
        }
        if (chooseRegistrarId.length > 0) {
            query.registrarId = changeArrayItemToString(chooseRegistrarId);
        }
        return query;
    }

    //增加或删除排课课时
    changeWeekItem(type, itemId, weekIdx) {
        let weeks = this.state.weeks;
        let keepWeeksAll = this.state.keepWeeksAll;
        let that = this;

        //获取当前选中天的日期
        let chooseDay = weeks.filter(item => item.idx == weekIdx)[0].weekDate;

        if (type == 2) {
            //新增一课时
            //两个课时间不能超过一周
            let oldData = keepWeeksAll.filter(item => item.items.length > 0);
            if(oldData.length > 0){
                let marginMillTime = stringToDate(chooseDay).getTime() - stringToDate(oldData[0].weekDate).getTime();
                if(marginMillTime >= 604800000 || marginMillTime <= -604800000){
                    Message({
                        message: "只能排一周的课",
                        type: 'error'
                    });
                    return;
                }
            }

            let classTime = 0;
            let index = 1;
            weeks.map(item => {
                if (item.items && item.idx == weekIdx) {
                    if(item.items && item.items.length > 0){
                        index = item.items[item.items.length-1].ch + 1;
                    }
                    item.items.push({
                        date1: null,
                        week1: true,
                        roomId1: null,
                        teacherId1: this.state.form.teacherId,
                        teacherId2: this.state.form.registrar,
                        idx: (item.items.length + 1),
                    });
                    //更新总的数据缓存
                    for(let i=0;i<keepWeeksAll.length;i++){
                        let kwa = keepWeeksAll[i];
                        //设置课次
                        if(kwa.items &&kwa.items.length > 0){
                            kwa.ct = ++classTime;
                        }else{
                            kwa.ct = null;
                        }
                        if(kwa.weekDate == item.weekDate){
                            item.ct = kwa.ct;
                        }
                        if(kwa.weekDate == item.weekDate){
                            kwa.items.push({
                                date1: null,
                                week1: true,
                                roomId1: null,
                                teacherId1: that.state.teacherId,
                                teacherId2: that.state.registrar,
                                idx: (item.items.length + 1),
                                ch: index,
                                ct: classTime,
                            });
                            kwa.editAim = true;
                            break;
                        }
                    }
                }

            });
        } else {
            weeks.map(item => {
                if (item.items && item.items.length > 0 && item.idx == weekIdx) {
                    item.items = item.items.filter(vo => vo.idx != itemId);
                    //更新总的数据缓存
                    for(let i=0;i<keepWeeksAll.length;i++){
                        let kwa = keepWeeksAll[i];
                        if(kwa.weekDate == item.weekDate){
                            if(kwa.weekDate == item.weekDate){
                                kwa.items = kwa.items.filter(vo => vo.ch != itemId);
                            }
                            break;
                        }
                    }
                }
            });
            let course = this.state.courses;
            this.resetIndx(course,weeks);
        }
        this.setState({weeks, keepWeeksAll});
    }
    //课时条目的内容发生变动
    weekContentChange(itemId, weekIdx, value){
        let weeks = this.state.weeks;
        let course = this.state.courses;
        let keepWeeksAll = this.state.keepWeeksAll;

        this.resetIndx(course,weeks,keepWeeksAll);
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
                                if(!vv.index){
                                    vv.index = cou.index + 1;
                                }
                            }
                        })
                    }
                });
            }
        });
        this.resetIndx(course,weeks,keepWeeksAll);
        this.setState({weeks});
    }
    //重置显示课时
    resetIndx(course,weeks,keepWeeksAll){
        course.map(item => {
            item.index = 0;
        });

        if(keepWeeksAll){
            keepWeeksAll.map(item => {
                item.items.map(vv => {
                    let idx = 1;
                    course.map(cou => {
                        if(cou.courseId == vv.courseId){
                            if(cou.index){
                                idx = cou.index+1;
                                cou.index = idx;
                            }else{
                                cou.index = 1;
                            }
                        }
                    });
                });
            });
        }

        let classTime = 0;
        weeks.map(item => {
            item.items.map(vv => {
                let idx = 1;
                course.map(cou => {
                    if(cou.courseId == vv.courseId){
                        if(cou.index){
                            idx = cou.index+1;
                            cou.index = idx;
                        }else{
                            cou.index = 1;
                        }
                        vv.index = idx;
                    }
                });
            });
        });

    }

    //改变日期范围
    changeDateRange(val1, evt){
        let weekDate = deepClone(this.state.weekDate);
        let weeks = this.state.weeks;
        let weekInIdx = this.state.weekInIdx;
        let keepWeeksAll = this.state.keepWeeksAll;
        if(val1 == 1){
            //右移一周
            let remainData = weeks.filter(item => item.items.length > 0);  //获取编辑课次的数据
            for(let i=0;i<weekDate.length;i++){
                weekDate[i] = addDate(weekDate[i], 7);
            }
            if(remainData.length > 0 && stringToDate(addDate(remainData[0].weekDate, 7)).getTime() < stringToDate(weekDate[0]).getTime()){
                Message({
                    message: "只能在编辑当前课次的一自然周内排课",
                    type: 'error'
                });
                return;
            }
            this.refreshWeeksAll(weeks,keepWeeksAll);
            weeks.map(item => {
                item.weekDate = addDate(item.weekDate, 7);
                item.items = [];
                item.forbidon = false;
                item.editAim = false;
            });
            weekInIdx += 1;
        }else if(val1 == 2){
            //左移一周
            let hasForbidonData = weeks.filter(item => item.forbidon);
            for(let i=0;i<weekDate.length;i++){
                weekDate[i] = addDate(weekDate[i], -7);
            }
            if(hasForbidonData.length > 0){
                Message({
                    message: "只能在编辑当前课次的一自然周内排课",
                    type: 'error'
                });
                return;
            }
            this.refreshWeeksAll(weeks,keepWeeksAll);
            weeks.map(item => {
                item.weekDate = addDate(item.weekDate, -7);
                item.items = [];
                item.editAim = false;
            });
            weekInIdx -= 1;
        }
        //查看keepWeeks中的日期是否和当前一致  一致则把数据keepWeeks赋值给当前周  否则直接向前拨
        let fData = keepWeeksAll.filter(ob => (ob.weekDate == weeks[0].weekDate));
        if(fData && fData.length>0){
            let fromIdx = getArrayIndex(keepWeeksAll, weeks[0], 'weekDate');
            weeks = getSubArray(keepWeeksAll, fromIdx, fromIdx + 6)
        }else{
            arrayAppend(keepWeeksAll, weeks);
        }
        this.setState({weekDate,weeks,weekInIdx,keepWeeksAll});
    }

    //翻页时刷新总缓存
    refreshWeeksAll(weeks,keepWeeksAll){
        weeks.map(item =>{
            keepWeeksAll.map(vo => {
                if(item.weekDate == vo.weekDate && item.items.length > 0){
                    //说明当前周的数据在总缓存中有  则更新总缓存
                    vo.items = deepClone(item.items);
                    vo.ct = item.ct;
                }
            });
        });
    }

    render() {
        let that = this;
        return (
            <div className="row justify-content-md-center">
                <div className="col col-12">
                    <Form ref="form" model={this.state.form} rules={this.state.rules} labelWidth="80"
                          className="demo-ruleForm">
                        <div className="row">
                            <Layout.Col span="6">
                                <Form.Item label="班级编号" prop="classId">
                                    <Select value={this.state.classId} clearable={true}
                                            style={{"width": "100%"}} placeholder="请选择班级"
                                            filterable={true} disabled={true}
                                            onChange={this.handleSelect.bind(this, 1, "classId")}>
                                        {
                                            this.state.classList.map(el => {
                                                return <Select.Option key={el.id} label={el.code} value={el.id}/>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Layout.Col>
                            <Layout.Col span="1">
                            </Layout.Col>
                            <Layout.Col span="12">
                                <div className="row">
                                    <div className="col-2" style={{"textAlign": "center", "color": "red"}}>课程</div>
                                    <div className="col-3" style={{"textAlign": "center", "color": "red"}}>主教</div>
                                    <div className="col-3" style={{"textAlign": "center", "color": "red"}}>助教</div>
                                </div>
                                {
                                    /*遍历排课课程*/
                                    that.state.courses.map(function (item) {
                                        return <div className="row" style={{"marginTop": "10px"}}>
                                            <div className="col-2"
                                                 style={{"textAlign": "center"}}>{item.courseName}</div>
                                            <div className="col-3">
                                                <Select value={item.teacherId} placeholder="请选择教师" multiple={true}
                                                        filterable={true} clearable={true} style={{"width": "100%"}}
                                                        onChange={that.handleSelect.bind(that, item.courseName, "teacherId")}>
                                                    {
                                                        (item.teacherList && item.teacherList.length > 0) ? item.teacherList.map(el => {
                                                            return <Select.Option key={el.id} label={el.name}
                                                                                  value={el.id}/>
                                                        }) : null
                                                    }
                                                </Select>
                                            </div>
                                            <div className="col-3">
                                                <Select value={item.registrar} placeholder="请选择助教" multiple={true}
                                                        filterable={true} clearable={true} style={{"width": "100%"}}
                                                        onChange={that.handleSelect.bind(that, item.courseName, "registrar")}>
                                                    {
                                                        (item.teacherList && item.teacherList.length > 0) ? item.teacherList.map(el => {
                                                            return <Select.Option key={el.id} label={el.name}
                                                                                  value={el.id}/>
                                                        }) : null
                                                    }
                                                </Select>
                                            </div>
                                            <br/>
                                        </div>
                                    })
                                }
                                <div className="row" style={{"marginTop": "10px"}}>
                                    <div className="col-5">
                                        <Form.Item label="开课日期">
                                            <DatePicker
                                                name="startDate"
                                                value={this.state.form.startDate}
                                                isDisabled={true}
                                                onChange={this.handleSelect.bind(this, 1, 'startDate')}
                                            />
                                        </Form.Item>
                                    </div>
                                    <div className="col-5">
                                        <Form.Item label="结课日期">
                                            <DatePicker
                                                name="endDate"
                                                value={this.state.form.endDate}
                                                isDisabled={true}
                                            />
                                        </Form.Item>
                                    </div>
                                </div>
                            </Layout.Col>
                        </div>
                        <div className="row"></div>
                        <div className="row"></div>

                        <div className="row" style={{"marginTop": "20px"}}>
                            <div className="col-0.5">
                                <Button type="primary" icon="arrow-left" onClick={this.changeDateRange.bind(this,2)}></Button>
                            </div>
                            <Tabs type="border-card" activeName={1} className="col-11"
                                  onTabClick={this.changeTabs.bind(this)}>
                                {that.state.weeks.map(function (vo) {
                                    return (  /*vo.name*/
                                        <Tabs.Pane label={ <span style={{"color": vo.items.length > 0 ? "red" : "black"}}><Icon name="date" /> {vo.name + '(' +vo.weekDate + ')'}</span>} name={vo.idx}>
                                            <div className="row">
                                                <div className="col-2 grid-content bg-purple"
                                                    /*style={{"display": item.show}}*/>
                                                    {/*只有排了课的才可以*/}
                                                    <label>{vo.items && vo.items.length > 0 ? vo.ct : ""}</label>
                                                    <Button type="primary" icon="plus" size='small'
                                                            onClick={that.changeWeekItem.bind(this, 2, vo.idx, vo.idx)}></Button>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-2">课程</div>
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
                                                            {/*<Layout.Col span="3">*/}
                                                            <div className="col-2 grid-content bg-purple" style={{"display":"inherit"}}>
                                                                <label>{item.idx}</label>
                                                                <Select value={item.courseId} placeholder="课程"
                                                                        filterable={true}
                                                                        clearable={true} style={{"width": "100%"}}
                                                                        onChange={that.weekContentChange.bind(that, item.idx, vo.idx)}
                                                                >
                                                                    {
                                                                        that.state.courses && that.state.courses.length > 0 ? that.state.courses.map(el => {
                                                                            return <Select.Option key={el.courseId}
                                                                                                  label={el.courseName}
                                                                                                  value={el.courseId}/>
                                                                        }) : null
                                                                    }
                                                                </Select>
                                                            </div>
                                                            <div className="col-1">{item.index}</div>
                                                            <div className="col-2 grid-content bg-purple">
                                                                <TimePicker
                                                                    value={item.date1}
                                                                    selectableRange="6:30:00 - 22:30:00"
                                                                    placeholder="开始上课时间"
                                                                    onChange={date => {
                                                                        item.date1 = date;
                                                                        let has = false;
                                                                        let keepWeeksAll = that.state.keepWeeksAll.filter(item => item.items.length > 0);
                                                                        if(keepWeeksAll.length > 0){
                                                                            if(stringToDate(keepWeeksAll[0].weekDate).getTime() < stringToDate(vo.weekDate).getTime()){
                                                                                has = true
                                                                            }
                                                                        }
                                                                        if(!has){
                                                                            let form = that.state.form;
                                                                            form.startDate = formatWithDateAndTime(stringToDate(vo.weekDate), date);
                                                                            console.log( form.startDate);
                                                                            that.setState({form});
                                                                        }
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
                                                                        item.teacherList && item.teacherList.length > 0 ? item.teacherList.map(el => {
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
                                                                        item.teacherList && item.teacherList.length > 0 ? item.teacherList.map(el => {
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
                                                                        onClick={that.changeWeekItem.bind(this, 1, item.idx, vo.idx)}></Button>
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


                    </Form>
                </div>
            </div>
        )
    }

}

export default AssignForm;