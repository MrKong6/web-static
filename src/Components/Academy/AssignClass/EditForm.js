import React from 'react'
import ReactDOM from 'react-dom'
import 'react-day-picker/lib/style.css';

import DialogTips from "../../Dialog/DialogTips";

import ajax from "../../../utils/ajax";
import CONFIG from '../../../utils/config';

import fmtDate, {addDate, formatWithDateAndTime, getNumByWeek, getWeekDate, stringToDate} from "../../../utils/fmtDate";
import calculateAge from "../../../utils/calculateAge";
import {Button, Tabs, DatePicker, Icon, Input, Layout, Radio, Select, TimePicker, Message} from "element-react";
import {arrayAppend, changeArrayItemToInt, changeArrayItemToString, changeStringToArrayInt, deepClone, getArrayIndex, getSubArray} from "../../../utils/objectToArray";

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
            showType: this.props.type,  //2是当前课次  1是所有课次
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
            keepWeeksAll:[],  //全局缓存  用于存放切换周再切换回去后的数据
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
            weekDate: [],
            weekInIdx: 0, //0表示处于当前课次周   1表示后一周   -1表示前一周
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
                let respData = await ajax('/academy/class/assignClassById.do', {csId: this.state.id,type:this.state.showType});
                let roomList = await ajax('/academy/room/list.do', {orgId: this.state.group.id});
                let teacherList = await ajax('/academy/teacher/list.do', {orgId: this.state.group.id});
                let registrarList = await ajax('/user/listUserByRole.do', {orgId: this.state.group.id,type:5});

                let weeks = [],checkWeek = null,checkMuiltiWeek = [],weeksDataSource = this.state.weeksDataSource;
                let data = respData.data;
                let mid = null;
                let weekDate = getWeekDate(data[0].startTime);
                let isForbidon = true;
                let aimData = data.filter(item => item.id == this.state.id)[0];
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
                                id:vo.id,

                            });
                            mid.week1 = true;
                        }
                    });
                    if(mid.items.length > 0){
                        source.items = mid.items;
                    }
                    if(mid.items && mid.items.length > 0 && mid.items[0].ct == aimData.currentClassTime){
                        isForbidon = false;
                    }
                    mid.weekDate = weekDate[source.idx-1];
                    mid.forbidon = isForbidon;   //该字段表明这数据是不可动的元素
                    mid.editAim = mid.items && mid.items.length > 0 ? (mid.items[0].ct == aimData.currentClassTime) : false;   //该字段表明编辑课次的元素
                    weeks.push(mid);
                });
                let filData = data.filter(item => item.id == this.state.id);
                if(filData && filData.length > 0){
                    data = data.filter(item => item.classTime == filData[0].classTime)[0];
                }
                let defaultClickTab = Number(getNumByWeek(data.weekName));

                let keepWeeksAll = [];
                arrayAppend(keepWeeksAll, weeks);

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
                    teacherId: changeStringToArrayInt(data.teacherId),
                    registrar: changeStringToArrayInt(data.registrarId),
                    startDate: new Date(data.loopStartTime),
                    endDate: new Date(data.xunhuanEndDate),
                    data: data,
                    respData: respData.data,
                    weeks,defaultClickTab,
                    keepWeeksAll: keepWeeksAll
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
        query.registrarName = changeArrayItemToString(rNames);

        if(this.state.showType == 1){
            //所有课次

            //先将本weeks里面选择的排课信息同步到全局缓存keepWeeksAll中
            this.state.weeks.map(item => {
                this.state.keepWeeksAll.map(vo => {
                    if(item.weekDate == vo.weekDate){
                        //表明同一天
                        vo.items = deepClone(item.items);
                    }
                });
            });

            let weeks = this.state.keepWeeksAll.filter(item => item.items.length > 0 && item.items[0].ct >= query.classTime);
            let items = [];
            weeks.map(vo => {
                vo.items.map(id => {
                    id.name = vo.name;
                    id.date1 = formatWithDateAndTime(vo.weekDate,id.date1);
                    items.push(id);
                });
            });
            if (items.length <= 0) {
                return
            }
            query.loopStartTime = null;
            query.xunhuanEndDate = null;
            query.startTime = null;
            query.endTime = null;
            query.createOn = null;
            query.courseList = items;
        }else{

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
        }
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
        let weekInIdx = this.state.weekInIdx;
        let keepWeeksAll = this.state.keepWeeksAll;
        let deleteCh = null;

        //获取当前选中天的日期
        let chooseDay = weeks.filter(item => item.idx == weekIdx)[0].weekDate;
        let oldData = this.state.respData.filter(item => item.classTime < this.state.data.classTime);
        //不能再上一课时之前编辑
        if(oldData.length > 0 && stringToDate(chooseDay).getTime() <= stringToDate(fmtDate(oldData[oldData.length - 1].startTime)).getTime()){
            Message({
                message: "不能操作此课时以前的课时",
                type: 'error'
            });
            return;
        }

        if (type == 2) {
            //新增一课时
            //新增加的课时不能大于编辑课次的7天以上
            let mid = keepWeeksAll.filter(item => item.items.length > 0 && item.items[0].ct == this.state.data.classTime);
            if(mid && mid.length > 0){
                // 604800000 = 7*24*60*60*1000
                if((stringToDate(chooseDay).getTime() - stringToDate(mid[0].weekDate).getTime()) >= 604800000){
                    Message({
                        message: "不能操作当前编辑课次一周后的课时",
                        type: 'error'
                    });
                    return;
                }
            }
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
                        ct: this.state.data.currentClassTime,
                        editAim: true
                    });
                    //更新总的数据缓存
                    for(let i=0;i<keepWeeksAll.length;i++){
                        let kwa = keepWeeksAll[i];
                        if(kwa.weekDate == item.weekDate){
                            kwa.items.push({
                                date1: null,
                                week1: true,
                                roomId1: null,
                                teacherId1: that.state.teacherId,
                                teacherId2: that.state.registrar,
                                idx: (item.items.length + 1),
                                ch: index,
                                ct: this.state.data.currentClassTime,
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
                    let delVo = item.items.filter(vo => vo.ch == itemId);
                    deleteCh = delVo[0].ch;
                    item.items = item.items.filter(vo => vo.ch != itemId);
                    if(item.items.length == 0){
                        weekInIdx = 0;
                        item.editAim = false;
                    }
                    //更新总的数据缓存
                    for(let i=0;i<keepWeeksAll.length;i++){
                        let kwa = keepWeeksAll[i];
                        if(kwa.weekDate == item.weekDate){
                            if(kwa.weekDate == item.weekDate){
                                kwa.items = kwa.items.filter(vo => vo.ch != itemId);
                                if(kwa.items.length == 0){
                                    kwa.editAim = false;
                                }
                            }
                            break;
                        }
                    }
                }
            });
        }
        this.resetWeekCourseHourIndx(weeks,keepWeeksAll,this.state.data,chooseDay,type,deleteCh)
        this.setState({weeks,weekInIdx,keepWeeksAll});
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

    //重置新增的课时的课时数  deleteCh:删除的课时数
    resetWeekCourseHourIndx(weeks, keepWeeksAll, data, chooseDay, type, deleteCh){
        let idx = data.classHour;
        let idx2 = data.classHour;
        let finalIdx = data.classHour;
        //先找到全局缓存最小的课时数  方便后续累加
        for(let i=0;i<keepWeeksAll.length;i++){
            if(keepWeeksAll[i].items.length > 0){
                if(type == 1 && stringToDate(chooseDay).getTime() < stringToDate(keepWeeksAll[i].weekDate).getTime()){
                    break;
                }
                idx = keepWeeksAll[i].items[0].ch;
                idx2 = keepWeeksAll[i].items[0].ch;
                break;
            }
        }
        keepWeeksAll.map(item => {
            if(item.items.length > 0){
                item.items.map(vo => {
                    vo.ch = idx2++;
                });
                if(item.weekDate == chooseDay){
                    finalIdx = item.items[0].ch;
                }
            }
        });
        weeks.map(item => {
            if(type == 2){
                if(item.items.length > 0 && stringToDate(item.weekDate).getTime() >= stringToDate(chooseDay).getTime()){
                    item.items.map(vo => {
                        vo.ch = finalIdx++;
                    });
                }
            }else{
                if(item.items.length > 0 && item.items[0].ch >= deleteCh){
                    item.items.map(vo => {
                        vo.ch = vo.ch - 1;
                    });
                }
            }

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
            let hasAimData = keepWeeksAll.filter(item => item.editAim);  //获取编辑课次的数据
            for(let i=0;i<weekDate.length;i++){
                weekDate[i] = addDate(weekDate[i], 7);
            }
            if(hasAimData.length > 0 && stringToDate(addDate(hasAimData[hasAimData.length-1].weekDate, 7)).getTime() < stringToDate(weekDate[0]).getTime()){
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
                }
            });
        });
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