import React from 'react'
import ReactDOM from 'react-dom'

import {Button, Checkbox, DatePicker, Form, Input, Layout, Select, TimePicker} from "element-react";
import 'react-day-picker/lib/style.css';

import DialogTips from "../../Dialog/DialogTips";
import CONFIG from '../../../utils/config';

import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import {getTimeFourByDate, getWeekByNum} from "../../../utils/fmtDate";
import {changeArrayItemToString} from "../../../utils/objectToArray";

const WEEKNAME=CONFIG.WEEKNAME;
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
            id : this.props.data ? this.props.data.id : null,
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
                desc: ''
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
        }
        this.handleSelect = this.handleSelect.bind(this);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.getFormValue = this.getFormValue.bind(this);
        this.changedDate = this.changedDate.bind(this);
        this.chooseClass = this.chooseClass.bind(this);
        this.accept = this.accept.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {

                let roomList = await ajax('/academy/room/list.do', {orgId: this.state.group.id});
                let teacherList = await ajax('/academy/teacher/list.do', {orgId: this.state.group.id});
                let registrarList = await ajax('/user/listUserByRole.do', {orgId: this.state.group.id,type:5});
                let classList = await ajax('/academy/class/list.do', {
                    orgId: this.state.group.id,
                    limit: 9999,
                    showAssignStatus: 1
                });
                let data = null;
                let dateRange = [];
                let hasEnd = 0;
                if (this.state.id) {
                    //即编辑
                    let assignClassList = await ajax('/academy/class/assignClassList.do', {csId: this.state.id});
                    if (assignClassList && assignClassList.data && assignClassList.data.length > 0) {
                        data = assignClassList.data[0];
                        if (data.loopStartTime) {
                            dateRange.push(new Date(data.loopStartTime));
                        }
                        if (data.xunhuanEndDate) {
                            dateRange.push(new Date(data.xunhuanEndDate));
                        }
                    }

                }
                debugger
                this.setState({
                    classList: classList.data.items,
                    teacherList: teacherList.data.items,
                    roomList: roomList.data.items,
                    registrarList: registrarList,
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
        console.log(type,key,value);
        if(key == 'showWeek'){
            //选择显示排周几的课
            let weeks = [];
            if(value && value.length > 0){
                let size = (this.state.form.classHour / this.state.form.classTime);
                size = size ? size : 2;
                this.state.weeksDataSource.map(item => {
                    let chooseWeek = null;
                    value.map(we => {
                        if(we == item.name){
                            this.state.weeks.map(old => {
                                if(old.name == we){
                                    //表示之前已经选过
                                    chooseWeek = old;
                                }
                            });
                            if(chooseWeek){
                                weeks.push(chooseWeek);
                            }else{
                                // if(we == item.name){
                                    let chooseItems = [];
                                    for(let i=0;i<size;i++){
                                        chooseItems.push( {
                                            date1: null,
                                            week1: true,
                                            roomId1: null,
                                            teacherId1: this.state.form.teacherId,
                                            teacherId2: this.state.form.registrar,
                                            idx:(i+1),
                                        });
                                    }
                                    item.items = chooseItems;
                                    item.week1 = true;
                                    weeks.push(item);
                                }
                            // }
                        }
                    });
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
            this.state.form.teacherId = value;
            let weeks = this.state.weeks;
            weeks.map(item => {
                if(item.items && item.items.length > 0){
                    item.items.map(vo => {
                        vo.teacherId1 = value;
                    });
                }
            })
            this.setState({weeks});
        }else if(key == 'registrar'){
            this.state.form.registrar = value;
            let weeks = this.state.weeks;
            weeks.map(item => {
                if(item.items && item.items.length > 0){
                    item.items.map(vo => {
                        vo.teacherId2 = value;
                    });
                }
            })
            this.setState({weeks});
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
            startDate = new Date(startDate.getTime() + 7 * this.state.form.classTime * 24 * 60 * 60 * 1000);;
        }
        return startDate;
    }
    //选中班级
    chooseClass(id){
        const request = async () => {
            try {

                let data = await ajax('/academy/class/query.do', {id: id});
                data = data.data;
                if(data && data.mainTeacher){
                    if(data.mainTeacher.indexOf(",") != -1){
                        this.setState({
                            chooseTeacher: data.mainTeacher.split(",")[0]
                        });
                    }else{
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
        request();
    }

    getFormValue() {
        console.log(this.state.weeks);
        let retval = null;
        if(!this.state.form.startDate){
            this.createDialogTips(`请完善开课日期`);
        }
        retval = this.accept();
        return retval;
    }

    accept(){
        let query={};
        let course = null;
        let teacherId = null,helpTeacherId = null;
        this.state.weeks.map(vo => {
            if(vo.week1){
                let hasTeacherId = [];
                vo.items.map(item => {
                    hasTeacherId = [];
                    if(course != null){
                        course = course + "、";
                    }
                    course = (course ? course : "") + vo.name;
                    if(item.date1){
                        course = course + getTimeFourByDate(item.date1);
                    }else{
                        this.createDialogTips(`请完善排课信息时间`);
                        return;
                    }
                    if(item.roomId1){
                        course = course + item.roomId1;
                    }else{
                        this.createDialogTips(`请选择排课信息对应班级编码`);
                        return;
                    }
                    if(item.teacherId1 && item.teacherId1.length >0){
                        teacherId = null;
                        item.teacherId1.map(id=> {
                            if(hasTeacherId.length == 0 || hasTeacherId.filter(str => (str == id)).length == 0){
                                hasTeacherId.push(id);
                                teacherId = (teacherId + id + ",");
                            }
                        });
                        if(teacherId){
                            teacherId = teacherId.substring(0,teacherId.length-1);
                            course = (course + "/" + teacherId);
                        }
                    }else{
                        this.createDialogTips(`请选择排课信息对应主教信息`);
                        return;
                    }
                    if(item.teacherId2 && item.teacherId2.length >0){
                        hasTeacherId = [];
                        helpTeacherId = null;
                            item.teacherId2.map(id=> {
                            if(hasTeacherId.length == 0 || hasTeacherId.filter(str => (str == id)).length == 0){
                                hasTeacherId.push(id);
                                helpTeacherId = (helpTeacherId + id + ",");
                            }
                        });
                        if(helpTeacherId){
                            helpTeacherId = helpTeacherId.substring(0,helpTeacherId.length-1);
                            course = (course + "/" + helpTeacherId);
                        }
                    }else{
                        this.createDialogTips(`请选择排课信息对应助教信息`);
                        return;
                    }
                });
            }
        });

        query.loopStartTime = this.state.form.startDate ? this.state.form.startDate : null;
        query.xunhuanEndDate =  this.state.form.endDate ? this.state.form.endDate : null;
        query.course =  course;
        query.id = this.state.id;
        query.loopId = this.state.loopId;
        query.chooseClass = this.state.form.classId;
        query.classTime = this.state.form.classTime;
        query.loopTrue = this.state.form.loopTrue; //1是循环 2是不循环
        query.chooseTeacher = teacherId;
        if(this.state.form.teacherId.length > 0){
            query.teacherId = changeArrayItemToString(this.state.form.teacherId);
        }
        if(this.state.form.registrar.length > 0){
            query.registrarId = changeArrayItemToString(this.state.form.registrar);
        }
        return query;
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
                                <Form.Item label="班级" prop="classId">
                                    <Select value={this.state.classId} clearable={true}
                                            style={{"width":"100%"}} placeholder="请选择班级"
                                            filterable={true}
                                            onChange={this.handleSelect.bind(this, 1, "classId")} >
                                        {
                                            this.state.classList.map(el => {
                                                return <Select.Option key={el.id} label={el.code} value={el.id}/>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </Layout.Col>
                            <Layout.Col span="6">
                                <Form.Item label="教师">
                                    <Select value={this.state.form.teacherId} placeholder="请选择教师" multiple={true}
                                            filterable={true} clearable={true} style={{"width":"100%"}}
                                            onChange={this.handleSelect.bind(this, 1, "teacherId")}>
                                        {
                                            (this.state.teacherList && this.state.teacherList.length > 0) ? this.state.teacherList.map(el => {
                                                return <Select.Option key={el.id} label={el.name} value={el.id}/>
                                            }) : null
                                        }
                                    </Select>
                                </Form.Item>
                            </Layout.Col>
                        </div>
                        <div className="row">
                            <Layout.Col span="6">
                                <Form.Item label="课程类型">
                                    <Input value={this.state.form.courseType} disabled={true}></Input>
                                </Form.Item>
                            </Layout.Col>
                            <Layout.Col span="6">
                                <Form.Item label="助教">
                                    <Select value={this.state.form.registrar} placeholder="请选择助教"  multiple={true}
                                            filterable={true} clearable={true} style={{"width":"100%"}}
                                            onChange={this.handleSelect.bind(this, 1, "registrar")}>
                                        {
                                            (this.state.teacherList && this.state.teacherList.length > 0) ? this.state.teacherList.map(el => {
                                                return <Select.Option key={el.id} label={el.name} value={el.id}/>
                                            }) : null
                                        }
                                    </Select>
                                </Form.Item>
                            </Layout.Col>
                        </div>
                        <div className="row">
                            <Layout.Col span="6">
                                <Form.Item label="课程阶段">
                                    <Input value={this.state.form.courseRange} disabled={true}></Input>
                                </Form.Item>
                            </Layout.Col>
                        </div>
                        <div className="row">
                            <Layout.Col span="6">
                                <Form.Item label="总课时">
                                    <Input value={this.state.form.classHour} disabled={true}></Input>
                                </Form.Item>
                            </Layout.Col>
                        </div>
                        <div className="row">
                            <Layout.Col span="6">
                                <Form.Item label="总课次">
                                    <Input value={this.state.form.classTime} disabled={true}></Input>

                                </Form.Item>
                            </Layout.Col>
                        </div>
                        <div className="row"></div>
                        <div className="row">
                            <Layout.Col span="6">
                                <Form.Item label="课程时长">
                                    <Input value={this.state.form.time} disabled={true}></Input>
                                </Form.Item>
                            </Layout.Col>
                            {/*<Layout.Col span="6">
                                <Form.Item label="当前课次">
                                    <Input value={this.state.form.currentClassTime} disabled={true}></Input>
                                </Form.Item>
                            </Layout.Col>*/}
                        </div>
                        <div className="row">
                            <Layout.Col span="12">
                                <Form.Item label="排课时间">
                                    <Checkbox.Group value={this.state.checkWeekList} onChange={this.handleSelect.bind(this,null, 'showWeek')}>
                                        <Checkbox label={WEEKNAME[0]}></Checkbox>
                                        <Checkbox label={WEEKNAME[1]}></Checkbox>
                                        <Checkbox label={WEEKNAME[2]}></Checkbox>
                                        <Checkbox label={WEEKNAME[3]}></Checkbox>
                                        <Checkbox label={WEEKNAME[4]}></Checkbox>
                                        <Checkbox label={WEEKNAME[5]}></Checkbox>
                                        <Checkbox label={WEEKNAME[6]}></Checkbox>
                                    </Checkbox.Group>
                                </Form.Item>
                            </Layout.Col>
                            <Layout.Col span="6">
                            </Layout.Col>

                        </div>
                        {/*<div className="row">
                            <Layout.Col span="6">
                                <Form.Item label="是否循环">
                                    <Select value={this.state.form.loopTrue} placeholder="请选择" disabled={this.state.id ? false : true}
                                            onChange={this.handleSelect.bind(this, 1, "loopTrue")}>
                                        <Select.Option key="2" label="否" value="2"/>
                                        <Select.Option key="1" label="是" value="1"/>
                                    </Select>
                                </Form.Item>
                            </Layout.Col>
                        </div>*/}

                        {that.state.weeks.map(function (vo) {
                            return (
                                <div  key={vo.idx}>
                                        {
                                            vo.items.map(function (item) {
                                            return  (
                                                <div className="row" key={item.idx}>
                                                    <Layout.Col span="2">
                                                        <div className="grid-content bg-purple right" style={{"display":item.idx == 1 ? "normal" : "none"}}>
                                                            <Checkbox label={vo.name} name={vo.name} checked={vo.week1} disabled={true}  onChange={that.handleSelect.bind(this, vo.idx, 'week')}></Checkbox>
                                                        </div>
                                                        <div className="grid-content bg-purple right">
                                                            <div style={{"display":"none"}}>
                                                                <Checkbox label={vo.name} name={vo.name} checked={vo.week1} disabled={true}></Checkbox>
                                                            </div>
                                                        </div>
                                                    </Layout.Col>
                                                    <Layout.Col span="5">
                                                        <div className="grid-content bg-purple">
                                                            <Form.Item>
                                                                <TimePicker
                                                                    value={item.date1}
                                                                    selectableRange="6:30:00 - 22:30:00"
                                                                    placeholder="请选择开始上课时间"
                                                                    onChange={date=>{
                                                                        item.date1 = date;
                                                                    }}
                                                                />
                                                            </Form.Item>
                                                        </div>
                                                    </Layout.Col>
                                                    <Layout.Col span="5">
                                                        <div className="grid-content bg-purple">
                                                            <Form.Item>
                                                                <Select value={item.roomId1} placeholder="请选择教室"
                                                                        filterable={true}
                                                                        clearable={true} style={{"width":"100%"}}
                                                                        onChange={data=>{item.roomId1 = data;}}
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

                        <div className="row">
                            <Layout.Col span="5">
                                <Form.Item label="开课日期">
                                    <DatePicker
                                        name="startDate"
                                        value={this.state.form.startDate}
                                        placeholder="选择日期"
                                        onChange={this.handleSelect.bind(this, 1, 'startDate')}
                                    />
                                </Form.Item>
                            </Layout.Col>
                            <Layout.Col span="5">
                                <Form.Item label="结课日期">
                                    <DatePicker
                                        name="endDate"
                                        value={this.state.form.endDate}
                                        disabled={true}
                                    />
                                </Form.Item>
                            </Layout.Col>
                        </div>
                    </Form>
                </div>
            </div>

    )
    }

    }

    export default AssignForm;