import React from 'react'
import ReactDOM from "react-dom";
import {$} from "../../vendor";

import DialogGroup from './DialogGroup';
import ajax from "../../utils/ajax";
import {DatePicker, DateRangePicker, Message, MessageBox} from "element-react";
import DialogTips from "./DialogTips";

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
        this.changedLead = this.changedLead.bind(this);
        this.changedOppor = this.changedOppor.bind(this);
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
            roomList: [],
            classList: [],
            teacherList: [],
            comment: null,
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
                let classList = await ajax('/academy/class/list.do', {orgId: this.state.group.id});
                let data = null;
                if(this.state.id){
                    //即编辑
                    let assignClassList = await ajax('/academy/class/assignClassList.do', {csId: this.state.id});
                    if(assignClassList && assignClassList.data && assignClassList.data.length>0){
                        data = assignClassList.data[0];
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
                    chooseTeacher: data ? data.teacherId: null,
                    chooseClass: data ? data.classId: null,
                    chooseRoom: data ? data.roomId: null,
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

    handleSelect(type, evt) {
        switch (type) {
            case(1): {
                this.setState({chooseClass:evt.target.value});
                this.state.chooseClass = evt.target.value;
                break;
            }
            case(2): {
                this.setState({chooseTeacher:evt.target.value});
                this.state.chooseTeacher = evt.target.value;
                break;
            }
            case(3): {
                this.setState({chooseRoom:evt.target.value});
                this.state.chooseRoom = evt.target.value;
                break;
            }
            case(4): {
                if(evt.target.value && evt.target.value == '2'){
                    //是否循环选择了是   显示循环日期
                    this.setState({showXunhuanDate:false});
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

        });
        this.dialog.modal('hide');
    }

    cancel() {
        console.log(this.state.value2);
        this.dialog.modal('hide');
        this.props.refresh();
    }

    del() {
        MessageBox.confirm('此操作将永久删除教师, 是否继续?', '提示', {
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

    changedOppor() {
        this.state.typeId = '2';
        let checkO = this.state.checkOppor;
        this.setState({
            checkOppor: !checkO,
        })

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
                                <div className="col-6 input-group">
                                    <select className="form-control" name={"class"}
                                            onChange={this.handleSelect.bind(this, 1)} value={this.state.chooseClass}>
                                        <option value="">请选择班级</option>
                                        {
                                            this.state.classList.map(item => (
                                                <option key={item.id} value={item.id}>{item.code}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-3 col-form-label">教师</label>
                                <div className="col-6 input-group">
                                    <select className="form-control" name={"teacher"}
                                            onChange={this.handleSelect.bind(this, 2)} value={this.state.chooseTeacher}>
                                        <option value="">请选择教师</option>
                                        {
                                            this.state.teacherList.map(item => (
                                                <option key={item.id} value={item.id}>{item.name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-3 col-form-label">教室</label>
                                <div className="col-6 input-group">
                                    <select className="form-control" name={"class"}
                                            onChange={this.handleSelect.bind(this, 3)} value={this.state.chooseRoom}>
                                        <option value="">请选择教室</option>
                                        {
                                            this.state.roomList.map(item => (
                                                <option key={item.id} value={item.id}>{item.code}</option>
                                            ))
                                        }
                                    </select>
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
                            {/*</div>*/}
                            <div className="form-group row" style={{"display":this.state.showXunhuan}}>
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
                            <div className="form-group row" style={{"display":this.state.showXunhuan}}>
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
                                        onChange={date=>{
                                            console.debug('DateRangePicker2 changed: ', date)
                                            this.setState({value2: date})
                                        }}
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