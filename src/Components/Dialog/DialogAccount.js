import React from 'react'
import ReactDOM from "react-dom";
import {$} from "../../vendor";

import ajax from "../../utils/ajax";
import {DatePicker, DateRangePicker, Message, MessageBox, Select, Radio, Input} from "element-react";
import DialogTips from "./DialogTips";
import fmtDate from "../../utils/fmtDate";

class DialogAccount extends React.Component {
    constructor(props) {
        super(props);
        this.cancel = this.cancel.bind(this);
        this.state = {
            group: this.props.changedCrmGroup,
            id : this.props.id ? this.props.id : null,
            accountType:1,
            payTypes:[],
        }
        // if(this.props.data && this.props.data.start)
        this.changeAccountType = this.changeAccountType.bind(this);
        this.confirmAdd = this.confirmAdd.bind(this);
    }

    componentDidMount() {
        this.dialog = $(`#accountView`);
        this.dialog.on('hidden.bs.modal', () => {
            this.cancel();
        });
        $("#income").show();
        $("#pay").hide();
        //清空表单数据
        const request = async () => {
            try {
                let data = await ajax('/service/account/getDictionariesByCode.do', {code: 'PAY_OUT_TYPE'});
                if(data != null){
                    this.setState({payTypes:data}, () => {
                        for (let i = 0; i < this.form.length; i++) {
                            this.form[i].value = null;
                        }
                        this.form["remark"].value = "";
                    });
                }
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {

                }
            } finally {
                this.setState({isAnimating: false});
            }
        };
        request();
    }

    cancel() {
        // console.log(this.state.value2);
        this.dialog.modal('hide');
        this.props.refresh();
    }

    //更改款项类型
    changeAccountType(value) {
        let str = value == 1 ? 'normal' : 'none';
        if(value == 1){
            $("#income").show();
            $("#pay").hide();
        }else{
            $("#income").hide();
            $("#pay").show();
        }
        this.setState({ accountType:value});
    }
    //保存数据
    confirmAdd(){
        const request = async () => {
            try {
                let query = {};
                for (let i = 0; i < this.form.length; i++) {
                    if (this.form[i].name) {
                        if (this.form[i].name) {
                            query[this.form[i].name] = this.form[i].value;
                        }
                    }
                }
                query.payDate = (this.state.payDate ? this.state.payDate : new Date()).getTime();
                query.stuId = this.state.id;
                query.accountType = this.state.accountType;
                if(query.accountType == 1){
                    query.outType = null;
                }
                let resp = await ajax('/service/account/add.do', query);
                this.setState({}, () => {
                    for (let i = 0; i < this.form.length; i++) {
                        this.form[i].value = null;
                    }
                    this.form["remark"].value = "";
                });
                if(resp.code == '200'){
                    this.cancel();
                    Message({
                        message: "添加成功",
                        type: 'success'
                    });
                }else{
                    this.cancel();
                    Message({
                        message: resp.detail,
                        type: 'error'
                    });
                }
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {

                }
            } finally {
                this.setState({isAnimating: false});
            }
        };
        request();
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
                                    <label className="col-3 col-form-label">款项类型</label>
                                    <div className="col-6">
                                        <Radio value="1" checked={this.state.accountType === 1} onChange={this.changeAccountType.bind(this)}>收入</Radio>
                                        <Radio value="2" checked={this.state.accountType === 2} onChange={this.changeAccountType.bind(this)}>支出</Radio>
                                    </div>
                                </div>
                                {/*收入页面*/}
                                <div id="income">
                                    <div className="form-group row">
                                        <label className="col-3 col-form-label">金额</label>
                                        <div className="col-6">
                                            <Input placeholder="请输入金额" name={"income"} />
                                        </div>
                                    </div>
                                </div>
                                {/*支出页面*/}
                                <div id="pay">
                                    <div className="form-group row">
                                        <label className="col-3 col-form-label">支出类型</label>
                                        <div className="col-6">
                                            <select className="form-control" name={"outType"}>
                                                {/*<option key='1' value='1'>课时费</option>
                                                <option key='2' value='2'>资料费</option>
                                                <option key='3' value='3'>其他费用</option>*/}
                                                {
                                                    this.state.payTypes ? this.state.payTypes.map(item => (
                                                        <option key={item.id}
                                                                value={item.id}>{item.name}</option>
                                                    )) : null
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-3 col-form-label">金额</label>
                                        <div className="col-6">
                                            <Input placeholder="请输入金额" name={"outcome"} />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-3 col-form-label">付款日期</label>
                                    <div className="col-6">
                                        <DatePicker
                                            name="createTime"
                                            value={this.state.payDate}
                                            isShowTime={true}
                                            placeholder="选择日期"
                                            format="yyyy-MM-dd HH:mm"
                                            onChange={date => {
                                                console.debug('DatePicker1 changed: ', date)
                                                this.setState({payDate: date})
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-3 col-form-label">摘要</label>
                                    <div className="col-6">
                                        <Input placeholder="请输入摘要" name={"remark"} />
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-3 col-form-label">备注</label>
                                    <div className="col-6">
                                        <Input placeholder="请输入备注" name={"comment"}  />
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

export default DialogAccount;