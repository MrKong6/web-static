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
            accountType:this.props.accountType,
            payTypes:[],
            contractList:[],
            contractId: null,
            contractNumId: null,
            outRow: this.props.outRow
        }
        // if(this.props.data && this.props.data.start)
        this.changeAccountType = this.changeAccountType.bind(this);
        this.chooseContract = this.chooseContract.bind(this);
        this.confirmAdd = this.confirmAdd.bind(this);
        this.changeOutType = this.changeOutType.bind(this);
    }

    /*shouldComponentUpdate(nextProps, nextState){
        // if (this.state.accountType !== nextState.accountType){
            return true;
        // }else {
        //     return false;
        // }
    }*/

    componentDidMount() {
        this.dialog = $(`#accountView`);
        this.dialog.on('hidden.bs.modal', () => {
            this.cancel();
        });
        this.changeAccountType(this.props.accountType);
        //清空表单数据
        const request = async () => {
            try {
                let data = await ajax('/service/account/getDictionariesByCode.do', {code: 'PAY_OUT_TYPE'});
                let contractList = await ajax('/service/contract/getContractListByStuId.do', {id: this.state.id,needReciecedAmount:1});
                if(data != null){
                    this.setState({payTypes:data,contractList:contractList}, () => {
                        for (let i = 0; i < this.form.length; i++) {
                            this.form[i].value = null;
                        }
                        this.form["remark"].value = "";
                        if(contractList.length > 0){
                            this.form["income"].value = contractList[0].thisAmount;
                        }
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

    /*componentWillReceiveProps(nextProps) {
        if (this.props.accountType !== nextProps.accountType) {
            this.setState({accountType: nextProps.accountType})
        }
    }*/

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
        this.state.accountType = value;
        this.setState({ accountType:value});
    }
    //更改合同期数
    chooseContract(value){
        let conId = null,numId = null;
        if(value){
            this.state.contractList.map(item => {
                if(item.id == value){
                    this.form["income"].value = item.thisAmount;
                    conId = item.contractId;
                    numId = item.id;
                }
            });
        }else{
            this.form["income"].value = null;
        }
        this.setState({contractId:conId,contractNumId:numId});
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
                query.accountType = this.props.accountType;
                query.contractNumId = this.state.contractNumId;
                if(query.accountType == 1){
                    query.outcome = null;
                }else{
                    query.income = null;
                }
                query.contractId = this.state.contractId;

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
    //更改支出方式
    changeOutType(evt){
        let outRow = this.state.outRow;
        if(outRow){
            this.state.payTypes.map(item => {
                if(item.id == evt.target.value){
                    if(item.code == 'CLASS_FEE'){
                        this.form["outcome"].value = outRow.amount ? outRow.amount : 0;
                    }else if(item.code == 'BOOK_FEE'){
                        this.form["outcome"].value = outRow.bookFee ? outRow.bookFee : 0;
                    }else if(item.code == 'OTHER_FEE'){
                        this.form["outcome"].value = outRow.otherFee ? outRow.otherFee : 0;
                    }
                }
            })
        }
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
                                {/*收入页面*/}
                                <div id="income">
                                    <div className="form-group row">
                                        <label className="col-3 col-form-label">请选择合同编号</label>
                                        <div className="col-6">
                                            <Select name="teacherId" placeholder="请选择"
                                                    filterable={true} clearable={true} style={{"width":"100%"}}
                                                onChange={this.chooseContract.bind(this)}>
                                                {
                                                    this.state.contractList ? this.state.contractList.map(el => {
                                                        return <Select.Option key={el.id} label={el.contractCode} value={el.id}>
                                                                    <span style={{float: 'left'}}>{el.contractCode}</span>
                                                                    <span style={{float: 'right', color: '#8492a6', fontSize: 13}}>{el.periodNum + '期'}</span>
                                                                </Select.Option>
                                                    }) : null
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-3 col-form-label">金额</label>
                                        <div className="col-6">
                                            <Input placeholder="请输入金额" name={"income"} readOnly={true} />
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