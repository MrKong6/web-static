import React from 'react'
import ReactDOM from 'react-dom'

import 'react-day-picker/lib/style.css';
import DialogTips from "../../Dialog/DialogTips";

import ajax from "../../../utils/ajax";
import formatWithTime from "../../../utils/fmtDate";
import calculateAge from "../../../utils/calculateAge";
import {DatePicker, Select} from "element-react";
import './Through.css'

class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            group: this.props.changedCrmGroup,
            birthday: null,
            age: 0,
            option: null,
            data: null,
            throughTime: null,
            throughEndTime: null,
            options:[],
            mainTeacher:[],
            helpTeacher:[],
            userOptions:[],
            roomData:[],
            value: [],
            mainTeacherIds: [],
            assistantIds: [],
            roomIds: [],
        };
        this.changeBirthday = this.changeBirthday.bind(this);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.getFormValue = this.getFormValue.bind(this);
        this.chooseUser = this.chooseUser.bind(this);
        this.chooseHelpTeacher = this.chooseHelpTeacher.bind(this);
        this.chooseMainTeacher = this.chooseMainTeacher.bind(this);
        this.chooseRoom = this.chooseRoom.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let advisorList = [],mainTeacher=[],helpTeacher=[],chooseMain=[],chooseassistant=[],
                    chooseMainTwo=[],chooseassistantTwo=[],roomDataTwo=[],chooseRoomIds = [],chooseRoomIdsTwo = [],chooseAdvisitorList = [],advisorListTwo = [];
                let throughStatus = await ajax('/service/through/throughStatus.do');
                advisorList = await ajax('/user/listUserByRole.do',{orgId:this.state.group.id,type:1});
                let mainTeacherData = await ajax('/academy/teacher/list.do', {orgId: this.state.group.id,position:1});  //主教
                let helpTeacherData = await ajax('/academy/teacher/list.do', {orgId: this.state.group.id});  //助教   ,position:2
                let roomData = await ajax('/academy/room/list.do', {orgId: this.state.group.id});  //助教

                let data = null;

                if (this.props.isEditor) {
                    data = await ajax('/service/through/query.do', {id: this.props.editorId});
                    data = data.data;
                }
                if(mainTeacherData){
                    mainTeacher = mainTeacherData.data.items;
                }
                if(helpTeacherData){
                    helpTeacher = helpTeacherData.data.items;
                }
                if(roomData){
                    roomDataTwo = roomData.data.items;
                }

                this.setState({
                    option: {throughStatus},
                }, () => {
                    if (this.props.isEditor) {
                        const keys = Object.keys(data);
                        debugger
                        keys.map(key => {
                            if (key === 'throughTime') {
                                this.state.throughTime = new Date(data[key]);
                            }
                            if (key === 'adviserIds') {
                                if(data[key].indexOf(',') != -1){
                                    chooseAdvisitorList = data[key].split(",");
                                }else{
                                    chooseAdvisitorList.push(data[key]);
                                }
                            }
                            if (key === 'mainTeacherIds') {
                                if(data[key].indexOf(',') != -1){
                                    chooseMain = data[key].split(",");
                                }else{
                                    chooseMain.push(Number(data[key]));
                                }
                            }
                            if (key === 'roomIds') {
                                if(data[key].indexOf(',') != -1){
                                    chooseRoomIds = data[key].split(",");
                                }else{
                                    chooseRoomIds.push(Number(data[key]));
                                }
                            }
                            if (key === 'assistantIds') {
                                if(data[key].indexOf(',') != -1){
                                    chooseassistant = data[key].split(",");
                                }else{
                                    chooseassistant.push(data[key]);
                                }
                            }
                            if (this.form[key]) {
                                if (key === 'throughTime') {
                                    this.form[key].value = formatWithTime(data[key]);
                                    this.state.throughTime = formatWithTime(data[key]);
                                }else if (key === 'throughEndTime') {
                                    this.form[key].value = formatWithTime(data[key]);
                                    this.state.throughEndTime = formatWithTime(data[key]);
                                } else {
                                    this.form[key].value = data[key];
                                }
                            }
                        })
                    }
                });
                debugger
                if(chooseassistant){
                    chooseassistant.map(item => {
                        chooseassistantTwo.push(Number(item));
                    })
                }
                if(chooseMain){
                    chooseMain.map(item => {
                        chooseMainTwo.push(Number(item));
                    })
                }

                if(chooseRoomIds){
                    chooseRoomIds.map(item => {
                        chooseRoomIdsTwo.push(Number(item));
                    })
                }

                this.setState({userOptions:advisorList,
                                mainTeacher:mainTeacher,
                                helpTeacher:helpTeacher,
                                roomData:roomDataTwo,
                                value:chooseAdvisitorList,
                                mainTeacherIds:chooseMainTwo,
                                assistantIds:chooseassistantTwo,
                                roomIds:chooseRoomIdsTwo});
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
        if (!this.form.checkValidity()) {
            return
        }

        let query = {};
        query.throughTime = this.state.throughTime;
        for (let i = 0; i < this.form.length; i++) {
            if (this.form[i].name) {
                if (this.form[i].tagName !== 'BUTTON' && !this.form[i].readOnly) {
                    query[this.form[i].name] = this.form[i].value;
                }
                if (this.form[i].name === 'throughTime') {
                    query[this.form[i].name] = new Date(this.form[i].value);
                }
            }
        }

        return query;
    }

    chooseUser(data){
        this.state.value = data;
    }
    chooseHelpTeacher(data){
        this.state.assistantIds = data;
    }
    chooseMainTeacher(data){
        this.state.mainTeacherIds = data;
    }
    chooseRoom(data){
        this.state.roomIds = data;
    }

    render() {
        return (
            <form ref={(dom) => {
                this.form = dom
            }}>
                <div className="row justify-content-md-center">
                    <div className="col col-12">
                        <div className="card">
                            <div className="card-body">
                                <p className="ht pb-3 b-b">基本信息</p>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>体验课场次
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="code"
                                                       required={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">状态</label>
                                            <div className="col-7">
                                                <select className="form-control"
                                                        name={this.props.throughStatus || "throughStatus"}>
                                                    {
                                                        (this.state.option && this.state.option.throughStatus) ? this.state.option.throughStatus.map(item => (
                                                            <option key={item.code}
                                                                    value={item.code}>{item.name}</option>
                                                        )) : null
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>开始时间
                                            </label>
                                            <div className="col-7">
                                                <DatePicker
                                                    name="throughTime"
                                                    value={this.state.throughTime}
                                                    width="100%"
                                                    className="allWidth"
                                                    isShowTime={true}
                                                    placeholder="选择日期"
                                                    format="yyyy-MM-dd HH:mm"
                                                    onChange={date => {
                                                        console.debug('DatePicker1 changed: ', date)
                                                        this.setState({throughTime: date})
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>结束时间
                                            </label>
                                            <div className="col-7">
                                                <DatePicker
                                                    name="throughTime"
                                                    value={this.state.throughEndTime}
                                                    width="100%"
                                                    className="allWidth"
                                                    isShowTime={true}
                                                    placeholder="选择日期"
                                                    format="yyyy-MM-dd HH:mm"
                                                    onChange={date => {
                                                        console.debug('DatePicker1 changed: ', date)
                                                        this.setState({throughEndTime: date})
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>教室
                                            </label>
                                            <div className="col-7">
                                                <Select value={this.state.roomIds} multiple={true} style={{width:'100%'}} onChange={this.chooseRoom}>
                                                    {
                                                        this.state.roomData ? this.state.roomData.map(el => {
                                                            return <Select.Option key={el.id} label={el.code}
                                                                                  value={el.id}/>
                                                        }) : null
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>主教
                                            </label>
                                            <div className="col-7">
                                                <Select value={this.state.mainTeacherIds} multiple={true} style={{width:'100%'}} onChange={this.chooseMainTeacher}>
                                                    {
                                                        this.state.mainTeacher ? this.state.mainTeacher.map(el => {
                                                            return <Select.Option key={el.id} label={el.name}
                                                                                  value={el.id}/>
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
                                                <Select value={this.state.assistantIds} multiple={true} style={{width:'100%'}} onChange={this.chooseHelpTeacher}>
                                                    {
                                                        this.state.helpTeacher ? this.state.helpTeacher.map(el => {
                                                            return <Select.Option key={el.id} label={el.name}
                                                                                  value={el.id}/>
                                                        }) : null
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>课程顾问
                                            </label>
                                            <div className="col-7">
                                                <Select value={this.state.value} multiple={true} style={{width:'100%'}} onChange={this.chooseUser}>
                                                    {
                                                        this.state.userOptions ? this.state.userOptions.map(el => {
                                                             return <Select.Option key={el.cId} label={el.cRealName}
                                                                                   value={el.cId}/>
                                                         }) : null
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>体验课人数
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="num"
                                                       required={true}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

export default Form;