import React from 'react'
import ReactDOM from "react-dom";
import {$} from "../../vendor";

import DialogGroup from './DialogGroup';
import ajax from "../../utils/ajax";
import {
    DatePicker,
    DateRangePicker,
    Message,
    MessageBox,
    Select,
    Radio,
    Form,
    Layout,
    Checkbox,
    TimePicker, Input, Button
} from "element-react";
import DialogTips from "./DialogTips";
import {getTimeFourByDate, getWeekByNum, stringToDate} from "../../utils/fmtDate";

class DialogForEvent extends React.Component {
    constructor(props) {
        super(props);
        this.handleSelect = this.handleSelect.bind(this);
        this.accept = this.accept.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.del = this.del.bind(this);
        this.cancel = this.cancel.bind(this);
        this.closed = this.closed.bind(this);
        this.changedDate = this.changedDate.bind(this);
        this.chooseClass = this.chooseClass.bind(this);
        debugger
        this.state = {
            group: this.props.changedCrmGroup,
            startTime: this.props.chooseStartDate,
            endTime: this.props.chooseStartDate,
            id : this.props.data ? this.props.data.id : null,
            data: null,
            value2:null,
            isEdit: this.props.data ? true : false,
            showDelete: (this.props.data) ? 'normal' : 'none',
            showXunhuan: this.props.data ? 'none' : 'normal',
            showXunhuanDate: true,
            classCount:0,
            roomList: [],
            classList: [],
            teacherList: [],
            comment: null,
            loopId: null,
            form: {
                name: null,
                classId: null,
                teacherId: [],
                roomId: null,
                classHour: null,
                classTime: null,
                courseRange: null,
                startDate: null,
                endDate: null,
                loopTrue: 1,
                currentClassTime: null,
                startTime: null,
                endTime: null
            },
            chooseCls:null
        }
        // if(this.props.data && this.props.data.start)
    }

    componentDidMount() {
        this.dialog = $(`#123456`);
        this.dialog.on('hidden.bs.modal', () => {
            this.closed();
        });
        const request = async () => {
            try {

                let roomList = await ajax('/academy/room/list.do', {orgId: this.state.group.id});
                let teacherList = await ajax('/academy/teacher/list.do', {orgId: this.state.group.id});
                let classList = await ajax('/academy/class/list.do', {orgId: this.state.group.id,limit:9999,showAssignStatus:1});
                let data = null;
                let dateRange = [];
                let hasEnd = 0,teacherId = [];
                if(this.state.id){
                    //即编辑
                    let assignClassList = await ajax('/academy/class/assignClassById.do', {csId: this.state.id});
                    data = assignClassList.data;
                    if(data.teacherId && data.teacherId.indexOf(",") != -1){
                        teacherId = data.teacherId.split(",");
                    }else{
                        teacherId.push(Number(data.teacherId));
                    }
                }
                this.setState({
                    classList: classList.data.items,
                    teacherList: teacherList.data.items,
                    roomList: roomList.data.items,
                    form:{
                        name: null,
                        classId: data.classId,
                        teacherId: teacherId,
                        roomId: data.roomId,
                        classHour: data.classHour,
                        classTime: data.classTime,
                        courseRange: data.courseRange,
                        startDate: new Date(data.loopStartTime),
                        endDate: new Date(data.xunhuanEndDate),
                        loopTrue: 1,
                        currentClassTime: data.currentClassTime,
                        startTime: new Date(data.startTime),
                        endTime:new Date(data.endTime)
                    }
                });

            } catch (err) {

            } finally {
                this.setState({isAnimating: false});
            }
        };
        request();
    }

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

    handleSelect(type, key, value) {
        if(key.indexOf("date") != -1 || key.indexOf("week") != -1 || key.indexOf("Date") != -1){

            if(key.indexOf("startDate") != -1){
                 //选中开始日期  更新结课日期
                let endDate = this.changedDate(value);
                this.setState({
                    form: Object.assign({}, this.state.form, { ["endDate"]: endDate,[key]: value })
                });
            }else{
                this.setState({
                    form: Object.assign({}, this.state.form, { [key]: value })
                });
            }
        }else{
            //找到选中班级
            if(key == "classId"){
                this.state.classList.map(item => {
                    if(item.id == value){
                        this.state.form["classHour"] = item.classHour;
                        this.state.form["classTime"] = item.classTime;
                        this.state.form["courseRange"] = item.courseRange;
                    }
                })
            }
            this.setState({
                form: Object.assign({}, this.state.form, { [key]: value+"" })
            });
        }
    }

    onSubmit(e) {
        e.preventDefault();

        this.refs.form.validate((valid) => {
            if (valid) {
                this.accept();
            } else {
                console.log('error submit!!');
                return false;
            }
        });

    }
    accept() {

        let course = null;

        this.props.accept({
            group: {
                id: this.state.groupId,
                name: this.state.groupName
            },
            user: {
                id: this.state.userId,
                name: this.state.userName
            },
            chooseClass: this.state.form.classId,
            chooseTeacher: this.state.form.teacherId,
            chooseRoom: this.state.form.roomId,
            classTime: this.state.form.classTime,
            loopTrue: this.state.form.loopTrue,  //1是循环 2是不循环
            loopStartTime: this.state.form.startDate ? this.state.form.startDate : null,
            xunhuanEndDate: this.state.form.endDate ? this.state.form.endDate : null,
            course: course,
            startTime: this.state.form.startTime,
            endTime: this.state.endTime,
            comment: this.state.comment,
            id:this.state.id,
            loopId: this.state.loopId,


        });
        this.dialog.modal('hide');
    }

    cancel() {
        console.log(this.state.value2);
        this.dialog.modal('hide');
        this.props.refresh();
    }

    del() {
        MessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
            type: 'warning'
        }).then(() => {
            request();
            this.props.refresh();
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消删除'
            });
        });
        const request = async () => {
            try {
                //事件列表
                let assignClassList = await ajax('/academy/class/delAssignClass.do', {id: this.state.id,loopTrue:(this.state.showXunhuanDate ? 2 : 1)});
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

    closed() {
        if (this.groupContainer) {
            document.body.removeChild(this.groupContainer);
        }

        document.body.removeChild(this.props.container);
    }
    //更新日期
    changedDate(startDate) {
        if(startDate && this.state.form.classTime){
            // let day = (date[1].getTime() - date[0].getTime()) / (24 * 60 * 60 * 1000);
            // let foramatDate = this.state.startTime.format("yyyy-MM-dd");
            // let startTime = stringToDate(foramatDate,'-');
            // debugger
            startDate = new Date(startDate.getTime() + 7 * this.state.form.classTime * 24 * 60 * 60 * 1000);;
        }
        return startDate;
    }

    render() {
        return (
            <div id="123456" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document" style={{"maxWidth":"650px"}}>
                    <div className="modal-content">
                        <div className="modal-header">
                            {this.state.isEdit ? (<h5 className="modal-title">编辑事件</h5>) : (<h5 className="modal-title">添加事件</h5>)}
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Form ref="form" model={this.state.form} rules={this.state.rules} labelWidth="80" className="demo-ruleForm">

                                <Layout.Col span="12">
                                    <Form.Item label="班级" prop="classId">
                                        <Select value={this.state.form.classId} placeholder="请选择班级" filterable={true} onChange={this.handleSelect.bind(this, 1, "classId")} clearable={true}>
                                            {
                                                this.state.classList.map(el => {
                                                    return <Select.Option key={el.id} label={el.code} value={el.id} />
                                                })
                                            }
                                        </Select>
                                    </Form.Item>
                                </Layout.Col>
                                <Layout.Col span="12">
                                    <Form.Item label="教师" prop="teacherId">
                                        <Select value={this.state.form.teacherId} placeholder="请选择教师" multiple={true} filterable={true}  clearable={true} onChange={this.handleSelect.bind(this, 1, "teacherId")}>
                                            {
                                                this.state.teacherList ? this.state.teacherList.map(el => {
                                                    return <Select.Option key={el.id} label={el.name} value={el.id} />
                                                }) : null
                                            }
                                        </Select>
                                    </Form.Item>
                                </Layout.Col>
                                <Layout.Col span="12">
                                    <Form.Item prop="startDate" label="开课日期">
                                        <DatePicker
                                            value={this.state.form.startDate}
                                            placeholder="选择日期"
                                            onChange={this.handleSelect.bind(this, 1, 'startDate')}
                                        />
                                    </Form.Item>
                                </Layout.Col>
                                <Layout.Col span="12">
                                    <Form.Item label="结课日期">
                                        <DatePicker
                                            value={this.state.form.endDate}
                                            disabled={true}
                                        />
                                    </Form.Item>
                                </Layout.Col>
                                <Layout.Col span="8">
                                    <Form.Item label="课程时长">
                                        <Input value={this.state.form.classHour} disabled={true}></Input>
                                    </Form.Item>
                                </Layout.Col>
                                <Layout.Col span="8">
                                    <Form.Item label="总课次">
                                        <Input value={this.state.form.classTime} disabled={true}></Input>

                                    </Form.Item>
                                </Layout.Col>
                                <Layout.Col span="8">
                                    <Form.Item label="课程阶段">
                                        <Input value={this.state.form.courseRange} disabled={true}></Input>
                                    </Form.Item>
                                </Layout.Col>
                                <Layout.Col span="8">
                                    <Form.Item label="当前课次">
                                        <Input value={this.state.form.currentClassTime} disabled={true}></Input>
                                    </Form.Item>
                                </Layout.Col>

                                <Layout.Col span="8">
                                    <Form.Item label="是否重复">
                                        <Select value={this.state.form.loopTrue} placeholder="请选择" onChange={this.handleSelect.bind(this, 1, "loopTrue")}>
                                            <Select.Option key="2" label="否" value="2" />
                                            <Select.Option key="1" label="是" value="1" />
                                        </Select>
                                    </Form.Item>
                                </Layout.Col>

                                <Layout.Col span="8" offset="2">
                                    <div></div>
                                </Layout.Col>
                                <Layout.Col span="12">
                                    <Form.Item prop="startDate" label="开始时间">
                                        <DatePicker
                                            value={this.state.form.startTime}
                                            placeholder="选择日期"
                                            format="yyyy-MM-dd HH:mm"
                                            onChange={this.handleSelect.bind(this, 1, 'startTime')}
                                        />
                                    </Form.Item>
                                </Layout.Col>
                                <Layout.Col span="12">
                                    <Form.Item prop="startDate" label="结束时间">
                                        <DatePicker
                                            value={this.state.form.endTime}
                                            placeholder="选择日期"
                                            format="yyyy-MM-dd HH:mm"
                                            onChange={this.handleSelect.bind(this, 1, 'endTime')}
                                        />
                                    </Form.Item>
                                </Layout.Col>
                                <Layout.Col span="12"><div className="grid-content bg-purple">
                                    <Form.Item>
                                        <Button type="primary" onClick={this.del} style={{"display":this.state.showDelete}} data-dismiss="modal">删除</Button>
                                        <Button type="primary" onClick={this.onSubmit}>确认</Button>
                                        <Button>取消</Button>
                                    </Form.Item>
                                </div></Layout.Col>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default DialogForEvent;