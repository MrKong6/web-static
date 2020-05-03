import React from 'react'
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'
import {$} from "../../vendor";

import DialogGroup from './DialogGroup';
import ajax from "../../utils/ajax";
import {Input, Select} from "element-react";

class DialogCourse extends React.Component {
    constructor(props) {
        super(props);
        this.dialogId = `d-${new Date().getTime()}`;
        this.state = {
            groupId: this.props.groupId,
            groupName: this.props.groupName,
            typeName: this.props.typeName,
            list: [],
            courseTypeName: "",
        };
        this.createGroupsDialog = this.createGroupsDialog.bind(this);
        this.acceptGroupDialog = this.acceptGroupDialog.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.accept = this.accept.bind(this);
        this.cancel = this.cancel.bind(this);
        this.closed = this.closed.bind(this);
        this.changedLead = this.changedLead.bind(this);
        this.changedOppor = this.changedOppor.bind(this);
        this.changeInput = this.changeInput.bind(this);
    }

    componentDidMount() {
        this.dialog = $(`#${this.dialogId}`);
        this.dialog.on('hidden.bs.modal', () => {
            this.closed();
        });

        const request = async () => {
            try {
                // let list = await ajax(this.props.path, {orgId: this.state.groupId, typeId: this.props.typeName});
                // let listThrough = null;
                // if (this.state.type && this.state.type == 30) {
                //     listThrough = await ajax(this.props.path, {orgId: this.state.groupId});
                //
                //     if (listThrough && listThrough.data.items.length > 0) {
                //         this.state.throughId = listThrough.data.items[0].id;
                //     }
                // }
                //
                // this.setState({
                //     list: list,
                //     userId: this.props.defaults.userId,
                //     userName: this.props.defaults.userName,
                //     option: listThrough ? listThrough.data.items : null
                // });
            } catch (err) {
                if (err.errCode === 401) {
                    this.dialog.modal('hide');
                    this.props.replace('/login', {from: this.props.from})
                } else {
                    this.setState({errText: `${err.errCode}: ${err.errText}`});
                }
            }
        };

        request();
    }

    createGroupsDialog() {
        if (this.group === undefined) {
            this.groupContainer = document.createElement('div');
            ReactDOM.render(
                <DialogGroup
                    accept={this.acceptGroupDialog}
                    defaults={this.state.groupId}
                    replace={this.props.replace}
                    from={this.props.from}
                    ref={(dom) => {
                        this.group = dom
                    }}
                />,
                document.body.appendChild(this.groupContainer)
            );
        }

        this.group.dialog.modal('show');
    }

    acceptGroupDialog(selected) {
        this.setState({
            groupId: selected.id,
            groupName: selected.name,
            userId: '',
            userName: ''
        });

        const request = async () => {
            try {
                let list = await ajax('/org/listUsers.do', {id: selected.id});

                this.setState({list: list});
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    this.setState({errText: `${err.errCode}: ${err.errText}`});
                }
            }
        };

        request();
    }

    handleSelect(evt) {
        this.setState({
            userId: evt.target.value,
            userName: evt.target.options[evt.target.selectedIndex].text
        })
    }

    accept() {
        if(this.state.typeName == 1){
            this.props.accept({
                group: {
                    id: this.state.groupId,
                    name: this.state.groupName
                },
                courseTypeName: this.state.courseTypeName
            });
            this.dialog.modal('hide');
        }

    }

    cancel() {
        this.dialog.modal('hide');
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

    changeInput(key, value) {
        this.setState({
            [key] : value}
        )
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
        if (this.state.typeName && this.state.typeName == 1) {
            // 课程类别
            return (
                <div id={this.dialogId} className="modal fade" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{this.props.title}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label" style={{"width":"200px"}}>
                                        课程类别名称：
                                    </label>
                                    <Input placeholder="请输入内容" value={this.state.courseTypeName} onChange={this.changeInput.bind(this,'courseTypeName')} />
                                </div>
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
        } else if (this.state.typeName && this.state.typeName == 2) {
            //课程
            return (
                <div id={this.dialogId} className="modal fade" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{this.props.title}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="row">
                                    <div className="form-group row">
                                        <label className="col-5 col-form-label font-weight-bold">
                                            <em className="text-danger">*</em>课程类别
                                        </label>
                                        <div className="col-7">
                                            <Input type="text"  onChange={this.changeInput.bind(this,'courseType')} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-5 col-form-label font-weight-bold">
                                            <em className="text-danger">*</em>课程阶段
                                        </label>
                                        <div className="col-7">
                                            <Input type="text" onChange={this.changeInput.bind(this,'name')} required={true}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-5 col-form-label font-weight-bold">
                                            <em className="text-danger">*</em>总课时
                                        </label>
                                        <div className="col-7">
                                            <Input type="text" onChange={this.changeInput.bind(this,'classHour')} required={true}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-5 col-form-label font-weight-bold">
                                            <em className="text-danger">*</em>总课次
                                        </label>
                                        <div className="col-7">
                                            <Input type="text" onChange={this.changeInput.bind(this,'classTime')} required={true}/>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-5 col-form-label font-weight-bold">
                                            <em className="text-danger">*</em>时长(min)
                                        </label>
                                        <div className="col-7">
                                            <Input type="number" onChange={this.changeInput.bind(this,'time')} required={true}/>
                                        </div>
                                    </div>
                                </div>
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
        } else {
            return (
                <div id={this.dialogId} className="modal fade" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{this.props.title}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                {
                                    this.state.errText ? <div className="alert alert-danger"
                                                              role="alert">{this.state.errText}</div> : null
                                }
                                <div className="form-group">
                                    <label>所属组织</label>
                                    <div className="input-group">
                                        <input type="text" className="form-control" value={this.state.groupName}
                                               readOnly={true}/>
                                        <span className="input-group-btn">
                                        <button onClick={this.createGroupsDialog} className="btn btn-secondary"
                                                type="button">
                                          <i className="fa fa-pencil-square-o fa-lg" aria-hidden="true"/>
                                        </button>
                                    </span>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>所属用户</label>
                                    <select className="form-control" onChange={this.handleSelect}
                                            value={this.state.userId}>
                                        <option value="">请选择</option>
                                        {
                                            this.state.list.map((user) => (
                                                <option value={user.cId}>{user.cRealName}</option>
                                            ))
                                        }
                                    </select>
                                </div>
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

export default DialogCourse;