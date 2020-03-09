import React from 'react'
import ReactDOM from "react-dom";
import {$} from "../../vendor";

import DialogGroup from './DialogGroup';
import ajax from "../../utils/ajax";
import {DatePicker, DateRangePicker, Message, MessageBox, Select, Radio} from "element-react";
import DialogTips from "./DialogTips";
import {stringToDate} from "../../utils/fmtDate";

class DialogForEvent extends React.Component {
    constructor(props) {
        super(props);
        this.createGroupsDialog = this.createGroupsDialog.bind(this);
        this.acceptGroupDialog = this.acceptGroupDialog.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.accept = this.accept.bind(this);
        this.del = this.del.bind(this);
        this.cancel = this.cancel.bind(this);
        this.closed = this.closed.bind(this);
        this.changedDate = this.changedDate.bind(this);
        this.chooseClass = this.chooseClass.bind(this);
        this.state = {
            group: this.props.changedCrmGroup,
            startTime: this.props.chooseStartDate,
            endTime: this.props.chooseStartDate,
            id : this.props.data ? this.props.data.id : null,
            data: null,
            value2:null,
            isEdit: this.props.data ? true : false,
            showDelete: this.props.data ? 'normal' : 'none',
            showXunhuan: this.props.data ? 'none' : 'normal',
            showXunhuanDate: true,
            classCount:0,
            roomList: [],
            classList: [],
            teacherList: [],
            comment: null,
            loopId: null,
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
                if(this.state.id){
                    //即编辑
                    let assignClassList = await ajax('/academy/class/assignClassList.do', {csId: this.state.id});
                    if(assignClassList && assignClassList.data && assignClassList.data.length>0){
                        data = assignClassList.data[0];
                        if(data.loopStartTime){
                            dateRange.push(new Date(data.loopStartTime));
                        }
                        if(data.xunhuanEndDate){
                            dateRange.push(new Date(data.xunhuanEndDate));
                        }
                    }

                }
                this.setState({
                    classList: classList.data.items,
                    teacherList: teacherList.data.items,
                    roomList: roomList.data.items,
                    data: data,
                    comment: data ? data.comment: null,
                    startTime: data ? new Date(data.startTime): this.props.chooseStartDate,
                    endTime: data ? new Date(data.endTime): this.props.chooseStartDate,
                    chooseTeacher: data ? Number(data.teacherId): null,
                    chooseClass: data ? data.classId: null,
                    chooseRoom: data ? Number(data.roomId): null,
                    value2: dateRange,
                    loopId: data? data.loopId : null,
                    loopStartTime: data? new Date(data.loopStartTime) : null
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
    //选择班级后关联教师
    /*chooseClass(data){
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
    }*/
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

    handleSelect(type, evt) {
        // debugger
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
                if(evt.target.value && evt.target.value == '2' && this.state.showDelete == 'none'){
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

    accept() {
        //校验是否都选择了
        if (!(this.state.chooseClass && this.state.chooseRoom && this.state.chooseTeacher)) {
            this.createGroupsDialog(`请先选择班级、教师、教室`);
            return;
        }
        if (!(this.state.startTime && this.state.endTime)) {
            this.createGroupsDialog(`请录入开始和结束时间`);
            return;
        }

        this.props.accept({
            group: {
                id: this.state.groupId,
                name: this.state.groupName
            },
            user: {
                id: this.state.userId,
                name: this.state.userName
            },
            chooseClass: this.state.chooseClass,
            chooseTeacher: this.state.chooseTeacher,
            chooseRoom: this.state.chooseRoom,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            comment: this.state.comment,
            xunhuanEndDate: this.state.value2 ? this.state.value2[1] : null,
            id:this.state.id,
            loopId: this.state.loopId,
            showXunhuanDate: this.state.showXunhuanDate ? 1 : 2,  //1是循环 2是不循环
            loopStartTime: this.state.loopStartTime ? this.state.loopStartTime : null

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
    changedDate(date) {
        let classCount = 0;
        if(date){
            let day = (date[1].getTime() - date[0].getTime()) / (24 * 60 * 60 * 1000);
            let foramatDate = this.state.startTime.format("yyyy-MM-dd");
            let startTime = stringToDate(foramatDate,'-');
            debugger
            for(let i=0;i<day+1;i++){
                if(startTime.getTime() <= date[1].getTime()){
                    classCount = classCount + 1;
                    startTime = new Date(startTime.getTime() + 7 * 24 * 60 * 60 * 1000);
                }
            }
        }
        this.setState({value2: date,classCount})
    }


    render() {
        return (
            <div id="123456" className="modal fade" tabIndex="-1" role="dialog">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            {this.state.isEdit ? (<h5 className="modal-title">编辑事件</h5>) : (<h5 className="modal-title">添加事件</h5>)}
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group row">
                                <label className="col-3 col-form-label">班级</label>
                                <div className="col-6">
                                    {/*<select className="form-control" name={"class"}
                                            onChange={this.handleSelect.bind(this, 1)} value={this.state.chooseClass}>
                                        <option value="">请选择班级</option>
                                        {
                                            this.state.classList.map(item => (
                                                <option key={item.id} value={item.id} mainteacher={item.mainTeacher}>{item.code}</option>
                                            ))
                                        }
                                    </select>*/}
                                    <Select style={{"width":"100%"}} value={this.state.chooseClass} filterable={true} onChange={this.handleSelect.bind(this, 1)} clearable={true} placeholder="请选择班级">
                                        {
                                            this.state.classList.map(el => {
                                                return <Select.Option key={el.id} label={el.code} value={el.id} />
                                            })
                                        }
                                    </Select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-3 col-form-label">教师</label>
                                <div className="col-6 input-group">
                                    {/*<select className="form-control" name={"teacher"}
                                            onChange={this.handleSelect.bind(this, 2)} value={this.state.chooseTeacher}>
                                        <option value="">请选择教师</option>
                                        {
                                            this.state.teacherList.map(item => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))
                                        }
                                    </select>*/}
                                    <Select style={{"width":"100%"}} value={this.state.chooseTeacher} filterable={true} onChange={this.handleSelect.bind(this, 2)} clearable={true} placeholder="请选择教师">
                                        {
                                            this.state.teacherList.map(el => {
                                                return <Select.Option key={el.id} label={el.name} value={el.id} />
                                            })
                                        }
                                    </Select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-3 col-form-label">教室</label>
                                <div className="col-6 input-group">
                                    {/*<select className="form-control" name={"class"}
                                            onChange={this.handleSelect.bind(this, 3)} value={this.state.chooseRoom}>
                                        <option value="">请选择教室</option>
                                        {
                                            this.state.roomList.map(item => (
                                                <option key={item.id} value={item.id}>{item.code}</option>
                                            ))
                                        }
                                    </select>*/}
                                    <Select style={{"width":"100%"}} value={this.state.chooseRoom} filterable={true} onChange={this.handleSelect.bind(this, 3)} clearable={true} placeholder="请选择教室">
                                        {
                                            this.state.roomList.map(el => {
                                                return <Select.Option key={el.id} label={el.code} value={el.id} />
                                            })
                                        }
                                    </Select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-3 col-form-label">开始时间</label>
                                <div className="col-6">
                                    <DatePicker
                                        name="createTime"
                                        value={this.state.startTime}
                                        isShowTime={true}
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd HH:mm"
                                        onChange={date => {
                                            console.debug('DatePicker1 changed: ', date)
                                            this.setState({startTime: date})
                                        }}
                                    />
                                </div>
                            </div>

                            {/*<div className="form-check form-check-inline">*/}
                                <div className="form-group row">
                                    <label className="col-3 col-form-label">结束时间</label>
                                    <div className="col-6">
                                        <DatePicker
                                            name="createTime"
                                            value={this.state.endTime}
                                            isShowTime={true}
                                            placeholder="选择日期"
                                            format="yyyy-MM-dd HH:mm"
                                            onChange={date => {
                                                console.debug('DatePicker1 changed: ', date)
                                                this.setState({endTime: date})
                                            }}
                                        />
                                    </div>
                                </div>
                            {/*</div>*/}{/*style={{"display":this.state.showXunhuan}}*/}
                            <div className="form-group row">
                                <label className="col-3 col-form-label font-weight-bold">
                                    是否循环
                                </label>
                                <div className="col-6 input-group">
                                    <select className="form-control" name={"class"}
                                            onChange={this.handleSelect.bind(this, 4)}>
                                        <option value="1">否</option>
                                        <option value="2">是</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-3 col-form-label font-weight-bold">
                                    循环周期
                                </label>
                                <div className="col-6 input-group">
                                    <DateRangePicker
                                        value={this.state.value2}
                                        placeholder="选择日期范围"
                                        align="right"
                                        isDisabled={this.state.showXunhuanDate}
                                        ref={e=>this.daterangepicker2 = e}
                                        onChange={this.changedDate}
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-3 col-form-label">课次数</label>
                                <div className="col-6">
                                    <input className="form-control"
                                           type="text"
                                           disabled={true}
                                           value={this.state.classCount}
                                    />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-3 col-form-label">事件备注</label>
                                <div className="col-6">
                                    <input className="form-control"
                                           type="text"
                                           value={this.state.comment}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="modal-footer">
                            <button onClick={this.del} type="button" className="btn btn-danger" style={{"display":this.state.showDelete}}
                                    data-dismiss="modal">删除事件
                            </button>
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

export default DialogForEvent;