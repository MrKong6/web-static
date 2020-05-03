import React from 'react'
import ReactDOM from "react-dom";
import {$} from "../../vendor";

import ajax from "../../utils/ajax";
import {DatePicker, DateRangePicker, Message, MessageBox, Select, Radio, Input} from "element-react";
import DialogTips from "./DialogTips";
import fmtDate from "../../utils/fmtDate";
import {Redirect} from "react-router-dom";

class DialogAssignClass extends React.Component {
    constructor(props) {
        super(props);
        debugger
        this.cancel = this.cancel.bind(this);
        this.state = {
            group: this.props.changedCrmGroup,
            id : this.props.id ? this.props.id : null,
            value: 1,
            redirectTo: false,
        }
        // if(this.props.data && this.props.data.start)
        this.changeType = this.changeType.bind(this);
        this.confirmAdd = this.confirmAdd.bind(this);
    }

    componentDidMount() {
        this.dialog = $(`#accountView`);
        this.dialog.on('hidden.bs.modal', () => {
            this.cancel();
        });
    }

    cancel() {
        // console.log(this.state.value2);
        this.dialog.modal('hide');
    }

    //更改radio button
    changeType(value) {
        this.setState({ value});
    }
    //保存数据
    confirmAdd(){
        this.props.toDirect(this.state.value,this.state.id);
        this.cancel();
    }

    render() {
        return (
            <form ref={(dom) => {
                this.form = dom
            }} encType='multipart/form-data'>
                <div id="accountView" className="modal fade" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">款项操作</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group row">
                                    <div className="col-2"></div>
                                    <div className="col-10">
                                        <Radio value="2" checked={this.state.value === 2} onChange={this.changeType.bind(this)}>仅此课次</Radio>
                                        <Radio value="1" checked={this.state.value === 1} onChange={this.changeType.bind(this)}>此课次及后续课次（不包括已上课时）</Radio>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button onClick={this.cancel} type="button" className="btn btn-secondary"
                                        data-dismiss="modal">取消
                                </button>
                                <button onClick={this.confirmAdd} type="button" className="btn btn-primary">确认</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        )
    }
}

export default DialogAssignClass;