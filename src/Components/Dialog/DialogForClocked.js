import React from 'react'
import ReactDOM from "react-dom";
import {$} from "../../vendor";

import ajax from "../../utils/ajax";
import {
    DatePicker,
    Message,
    MessageBox,
    Select,
    Checkbox,
    TimePicker
} from "element-react";
import DialogTips from "./DialogTips";
import {formatWithDateAndTime, formatWithOnlyTime} from "../../utils/fmtDate";

class DialogForClocked extends React.Component {
    constructor(props) {
        super(props);
        this.createGroupsDialog = this.createGroupsDialog.bind(this);
        this.acceptGroupDialog = this.acceptGroupDialog.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.accept = this.accept.bind(this);
        this.del = this.del.bind(this);
        this.cancel = this.cancel.bind(this);
        this.closed = this.closed.bind(this);
        this.changedLead = this.changedLead.bind(this);
        this.changedCommonDate = this.changedCommonDate.bind(this);
        this.changeChecked = this.changeChecked.bind(this);
        this.changeClassTime = this.changeClassTime.bind(this);
        this.chooseClassTeacherInfo = this.chooseClassTeacherInfo.bind(this);
        this.state = {
            group: this.props.changedCrmGroup,
            startTime:  formatWithOnlyTime(new Date().getTime()),
            endTime: formatWithOnlyTime(new Date().getTime()),
            data: this.props.data ? this.props.data : null,
            isEdit: this.props.data ? true : false,
            checked : false,
            hasCheckedCount:0,//已经签退过的人数
            date: formatWithOnlyTime(new Date().getTime()),
            classTimes: this.props.classTimes,
            selectedClassTime: null,
            classTimeList: [],
            mainTeacher: this.props.mainTeacher ? this.props.mainTeacher : [],
            helpTeacher: this.props.helpTeacher ? this.props.helpTeacher : [],
            roomList: this.props.roomList,
            chooseRoom:null,
            chooseMainTeacher:null,
            chooseHelpTeacher: [],
        }
        // if(this.props.data && this.props.data.start)
    }

    componentDidMount() {
        this.dialog = $(`#123456`);
        this.dialog.on('hidden.bs.modal', () => {
            this.closed();
        });
        //对空的签到时间赋值
        let maxClassTime = 1;
        let index = 1;
        this.state.data.map(item => {
            if(item.maxClassTime && item.maxClassTime > maxClassTime){
                maxClassTime = item.maxClassTime;
            }
            item.index = index++;
        });
        this.changeClassTime(maxClassTime);
        //赋值数组
        let timeList = [];
        for(let i=1;i<this.state.classTimes;i++){
            timeList.push(i);
        }
        this.setState({classTimeList:timeList});
    }

    createGroupsDialog(text) {
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

    acceptGroupDialog(selected) {
        this.setState({
            groupId: selected.id,
            groupName: selected.name,
            userId: '',
            userName: ''
        });
    }

    handleSelect(type, evt) {
        switch (type) {
            case(1): {
                this.chooseClass(evt);
                this.setState({chooseClass:evt});
                this.state.chooseClass = evt;
                break;
            }
            case(2): {
                this.setState({chooseTeacher:evt});
                this.state.chooseTeacher = evt;
                break;
            }
            case(3): {
                this.setState({chooseRoom:evt});
                this.state.chooseRoom = evt;
                break;
            }
            case(4): {
                if(evt.target.value && evt.target.value == '2'){
                    //是否循环选择了是   显示循环日期
                    // if(!this.state.showXunhuan === 'none'){
                        this.setState({showXunhuanDate:false});
                    // }
                }else{
                    this.setState({showXunhuanDate:true});
                }
                break;
            }
        }
    }
    //签到 签退
    accept(evt) {
        //校验是否都选择了
        console.log(this.state.data);
        let dataList = this.state.data;
        let commitVo = {"vos":dataList,"checkInToday":this.state.checked,"classTime":this.state.selectedClassTime,
            "startTime":new Date(this.state.startTime.getTime()),"checkOutToday":this.props.typeName,
            "hasCheckedCount":this.state.hasCheckedCount,"roomId":this.state.chooseRoom,"techerId":this.state.chooseMainTeacher,"helpTeacherId":this.state.chooseHelpTeacher.join(",")};
        const request = async () => {
            try {
                let response = await ajax('/student/clocked/clockedAdd.do', {"clockedAddVo":JSON.stringify(commitVo)});
                this.dialog.modal('hide');
                this.props.refresh();
            } catch (err) {
                Message({
                    type: 'error',
                    message: 'err'
                });
            }

        };
        request();
    }

    cancel() {
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
                let assignClassList = await ajax('/academy/class/delAssignClass.do', {id: this.state.id});
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

    changedLead(evt) {
        this.state.typeId = evt.target.value;
    }

    //统一选择签到时间
    changedCommonDate(evt) {
        if(evt){
            let chooseDate = formatWithDateAndTime(this.state.startTime.getTime(),evt.getTime());
            let dataList = this.state.data;
            if(dataList && dataList.length > 0){
                dataList.map(item => {
                    if(item.checkInToday && item.checkInToday == 1){
                        if(this.props.typeName && this.props.typeName == '2'){
                            //签退时间
                            item.endTime = chooseDate;
                            this.setState({data:dataList,endTime:chooseDate});
                        }else{
                            item.startTime = chooseDate;
                            this.setState({data:dataList,startTime:chooseDate});
                        }
                    }
                })
            }
        }
    }
    //统一选择签到
    changeChecked(evt){
        console.log(evt);
        let dataList = this.state.data;
        if(dataList && dataList.length > 0){
            dataList.map(item => {
                item.checkInToday = evt ? 1 : 2;
            })
            this.setState({data:dataList,checked:evt});
        }
    }
    //更改签到次数
    changeClassTime(evt){
        let dataList = this.state.data;
        if(dataList && dataList.length > 0){
            let existTime = null;
            let hasCheckedCount = 0;
            let teacherId = 0,roomId = 0,helpTeacherId=[];
            dataList.map(item => {
                if(item[evt]){
                    //即历史签到过该次数
                    console.log(item[evt]);
                    item.checkInToday = item[evt].clocked;
                    if(item[evt].startTime){
                        item.startTime = formatWithOnlyTime(item[evt].startTime);
                        existTime = item.startTime;
                    }else{
                        item.startTime = null;
                    }
                    if(item[evt].endTime){
                        item.endTime = formatWithOnlyTime(item[evt].endTime);
                    }else{
                        item.endTime = null;
                    }
                    if(item.startTime && item.endTime){
                        hasCheckedCount += 1;
                    }
                    if(item[evt].teacherId > 0){
                        teacherId = item[evt].teacherId;
                        roomId = item[evt].roomId;
                        if(item[evt].helpTeacherId && item[evt].helpTeacherId.indexOf(",") != -1){
                            let array = item[evt].helpTeacherId.split(",");
                            array.map(aa => {helpTeacherId.push(Number(aa))});
                        }else{
                            helpTeacherId = helpTeacherId.push(Number(item[evt].helpTeacherId));
                        }
                    }
                    if(item.checkInToday != 1){
                        //没有签过到
                        item.startTime = formatWithOnlyTime(new Date());
                        item.endTime = formatWithOnlyTime(new Date());
                    }
                }else{
                    item.checkInToday = 2;
                    item.startTime = formatWithOnlyTime(new Date());
                    item.endTime = formatWithOnlyTime(new Date());
                }
            })
            if(!existTime){
                //既没有历史签到过
                existTime = formatWithOnlyTime(new Date());
            }
            this.setState({data:dataList,date:existTime,selectedClassTime:evt,hasCheckedCount:hasCheckedCount,chooseMainTeacher:teacherId,
                chooseRoom:roomId,chooseHelpTeacher:helpTeacherId});
        }
    }
    //选择教室  主教 助教
    chooseClassTeacherInfo(type,evt){
        if(type == 1){
            //教室
            this.state.chooseRoom = evt;
        }else if(type == 2){
            //教室
            this.state.chooseMainTeacher = evt;
        }else if(type == 3){
            //教室
            this.state.chooseHelpTeacher = evt;
        }
    }

    render() {
        if(this.props.typeName && this.props.typeName == '1'){
            return (
                <div id="123456" className="modal fade" tabIndex="-1" role="dialog" data-backdrop="static">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{this.props.title}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.cancel}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group row">
                                    <label className="col-3 col-form-label" style={{"textAlign":"right","color":"red"}}>签到课次</label>
                                    <div className="col-3">
                                        <Select value={this.state.selectedClassTime} placeholder="课次" onChange={this.changeClassTime} required={true}>
                                            {
                                                this.state.classTimeList.map(el => {
                                                    return <Select.Option key={el} label={el} value={el} />
                                                })
                                            }
                                        </Select>
                                    </div>
                                    <div className="col-6">
                                        <DatePicker
                                            value={this.state.date}
                                            placeholder="选择日期"
                                            onChange={date=>{
                                                console.debug('DatePicker1 changed: ', date)
                                                this.setState({date: date})
                                            }}
                                            disabledDate={time=>time.getTime() < Date.now() - 8.64e7}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-3 col-form-label" style={{"textAlign":"right","color":"red"}}>教室/教师</label>
                                    <div className="col-3">
                                        <Select value={this.state.chooseRoom} placeholder="教室" onChange={this.chooseClassTeacherInfo.bind(this,'1')} required={true}>
                                            {
                                                this.state.roomList.map(el => {
                                                    return <Select.Option key={el.id} label={el.code} value={el.id} />
                                                })
                                            }
                                        </Select>
                                    </div>
                                    <div className="col-3">
                                        <Select value={this.state.chooseMainTeacher} placeholder="主教" onChange={this.chooseClassTeacherInfo.bind(this,'2')} required={true}>
                                            {
                                                this.state.mainTeacher.map(el => {
                                                    return <Select.Option key={el.id} label={el.name} value={el.id} />
                                                })
                                            }
                                        </Select>
                                    </div>
                                    <div className="col-3">
                                        <Select value={this.state.chooseHelpTeacher} multiple={true}  placeholder="助教" onChange={this.chooseClassTeacherInfo.bind(this,'3')} required={true}>
                                            {
                                                this.state.helpTeacher.map(el => {
                                                    return <Select.Option key={el.id} label={el.name} value={el.id} />
                                                })
                                            }
                                        </Select>
                                    </div>

                                </div>
                                <hr/>
                                <div className="form-group row">
                                    <label className="col-3 col-form-label" style={{"textAlign":"right","color":"red"}}>统一选择</label>
                                    <div className="col-2 col-form-label">
                                        <Checkbox checked={this.state.checked} onChange={this.changeChecked}>签到</Checkbox>
                                    </div>
                                    <div className="col-7">
                                        <TimePicker
                                            selectableRange="08:30:00 - 21:30:00"
                                            value={this.state.startTime}
                                            onChange={this.changedCommonDate.bind(this)}
                                            placeholder="选择时间"
                                        />
                                    </div>
                                </div>
                                <hr/>
                                {
                                    this.state.data ? this.state.data.map(function(val) {
                                        let i=1;
                                        return <div className="form-group row">
                                            <label className="col-3 col-form-label" style={{"textAlign":"left"}}>{val.index+'.'}  {val.name}</label>
                                            <div className="col-2 col-form-label">
                                                <Checkbox checked={val.checkInToday == 1}
                                                          onChange={check=>{
                                                              val.checkInToday = check ? 1 : 2;
                                                          }}></Checkbox>
                                            </div>
                                            <div className="col-7">
                                                <TimePicker
                                                    selectableRange="08:30:00 - 21:30:00"
                                                    value={val.startTime}
                                                    onChange={date=>{
                                                        console.debug('DatePicker1 changed: ', date);
                                                        val.startTime = date;
                                                    }}
                                                    placeholder="选择时间"
                                                />
                                            </div>
                                        </div>
                                    }) : null
                                }

                            </div>
                            <div className="modal-footer">
                                <button onClick={this.cancel} type="button" className="btn btn-secondary"
                                        data-dismiss="modal">取消
                                </button>
                                <button onClick={this.accept} type="button" className="btn btn-primary">确认</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }else{
            return (
                <div id="123456" className="modal fade" tabIndex="-1" role="dialog" data-backdrop="static">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{this.props.title}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.cancel}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group row">
                                    <label className="col-4 col-form-label" style={{"textAlign":"right","color":"red"}}>签退课次</label>
                                    <div className="col-3">
                                        <Select value={this.state.selectedClassTime} placeholder="课次" onChange={this.changeClassTime} required={true}>
                                            {
                                                this.state.classTimeList.map(el => {
                                                    return <Select.Option key={el} label={el} value={el} />
                                                })
                                            }
                                        </Select>
                                    </div>
                                    <div className="col-5">
                                        <DatePicker
                                            value={this.state.date}
                                            placeholder="选择日期"
                                            onChange={date=>{
                                                console.debug('DatePicker1 changed: ', date)
                                                this.setState({date: date})
                                            }}
                                            disabledDate={time=>time.getTime() < Date.now() - 8.64e7}
                                        />
                                    </div>
                                </div>
                                <hr/>
                                <div className="form-group row">
                                    <label className="col-3 col-form-label" style={{"textAlign":"right","color":"red"}}>签退</label>
                                    <div className="col-2 col-form-label">
                                        <Checkbox checked={this.state.checked} onChange={this.changeChecked}></Checkbox>
                                    </div>
                                    <div className="col-7">
                                        <TimePicker
                                            selectableRange="08:30:00 - 21:30:00"
                                            value={this.state.startTime}
                                            onChange={this.changedCommonDate.bind(this)}
                                            placeholder="选择时间"
                                        />
                                    </div>
                                </div>
                                <hr/>
                                {
                                    this.state.data ? this.state.data.map(function(val) {
                                        return <div className="form-group row">
                                            <label className="col-3 col-form-label" style={{"textAlign":"right"}}>{val.index+'.'}  {val.name}</label>
                                            <div className="col-2 col-form-label">
                                                <Checkbox checked={val.checkInToday == 1}
                                                          onChange={check=>{
                                                              val.checkInToday = check ? 1 : 2;
                                                          }}></Checkbox>
                                            </div>
                                            <div className="col-7">
                                                <TimePicker
                                                    selectableRange="08:30:00 - 21:30:00"
                                                    value={val.endTime}
                                                    onChange={date=>{
                                                        console.debug('DatePicker1 changed: ', date);
                                                        val.endTime = date;
                                                    }}
                                                    placeholder="选择时间"
                                                />
                                            </div>
                                        </div>
                                    }) : null
                                }

                            </div>
                            <div className="modal-footer">
                                <button onClick={this.cancel} type="button" className="btn btn-secondary"
                                        data-dismiss="modal">取消
                                </button>
                                <button onClick={this.accept} type="button" className="btn btn-primary">确认</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

    }
}

export default DialogForClocked;