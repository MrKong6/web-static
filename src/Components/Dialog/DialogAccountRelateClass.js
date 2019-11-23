import React from 'react'
import ReactDOM from "react-dom";
import {$} from "../../vendor";

import ajax from "../../utils/ajax";
import {DatePicker, DateRangePicker, Message, MessageBox, Select, Radio, Input} from "element-react";
import DialogTips from "./DialogTips";

class DialogAccountRelateClass extends React.Component {
    constructor(props) {
        super(props);
        this.cancel = this.cancel.bind(this);
        this.closed = this.closed.bind(this);
        this.changeClass = this.changeClass.bind(this);
        this.confirmRelateClass = this.confirmRelateClass.bind(this);
        this.state = {
            group: this.props.changedCrmGroup,
            id : this.props.id ? this.props.id : null,
            mainAccountId: this.props.mainAccountId,
            classList:[],
            totalFee:this.props.totalFee ? this.props.totalFee : 0,
            classHour:0,
            averageFee:0,
            chooseClass: null,
        }
    }

    componentDidMount() {
        this.dialog = $(`#accountRelateClass`);
        this.dialog.on('hidden.bs.modal', () => {
            this.closed();
        });
        const request = async () => {
            try {
                let classList = await ajax('/academy/class/getClassListByStu.do', {stuId: this.state.id});
                if(classList && classList.data){
                    let fee = (classList.data[0].classHour && classList.data[0].classHour != 0) ? this.state.totalFee / classList.data[0].classHour : 0;
                    this.setState({classList:classList.data,chooseClass:classList.data[0].id,averageFee:Math.floor(fee*100)/100,classHour:classList.data[0].classHour})
                }
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    // this.createDialogTips(`${err.errCode}: ${err.errText}`);
                }
            } finally {
                this.setState({isAnimating: false});
            }
        };
        request();
    }

    closed() {
        if (this.groupContainer) {
            document.body.removeChild(this.groupContainer);
        }
        // document.body.removeChild(this.props.container);
    }

    cancel() {
        // console.log(this.state.value2);
        this.dialog.modal('hide');
        // this.props.refresh();
    }
    //更改班级
    changeClass(evt){
        let classData = null;
        this.state.chooseClass = evt.target.value;
        this.state.classList.map(item => {
            if(item.id == evt.target.value){
                classData = item;
                let fee = (item.classHour && item.classHour != 0) ? this.state.totalFee / item.classHour : 0;
                this.setState({
                    chooseClass: evt.target.value,
                    classHour: item.classHour ? item.classHour : 0,
                    averageFee: Math.floor(fee*100)/100,
                });
                return;
            }
        });
    }
    //确认关联班级
    confirmRelateClass(){
        const request = async () => {
            try {
                await ajax('/service/account/relateClass.do', {id: this.state.mainAccountId,classId:this.state.chooseClass});
                this.cancel();
                Message({
                    message: "关联成功",
                    type: 'success'
                });
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    // this.createDialogTips(`${err.errCode}: ${err.errText}`);
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
                <div id="accountRelateClass" className="modal fade" tabIndex="-1" role="dialog">
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
                                <label className="col-3 col-form-label">请选择班级</label>
                                <div className="col-6">
                                    <select className="form-control" name={"type"} onChange={this.changeClass}>
                                        {/*<option key='1' value='1'>K0001</option>
                                        <option key='1' value='1'>K0002</option>
                                        <option key='1' value='1'>K0003</option>*/}
                                        {
                                            this.state.classList ? this.state.classList.map(item => (
                                                <option key={item.id}
                                                        value={item.id}>{item.code}</option>
                                            )) : null
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-3 col-form-label">课时数</label>
                                <div className="col-6">
                                    <Input value={'60'} disabled name={"classHour"} value={this.state.classHour}  />
                                </div>
                            </div>
                            <div className="form-group row">
                                <label className="col-3 col-form-label">平均每节课时扣除费用</label>
                                <div className="col-6">
                                    <Input value={'200'} disabled value={this.state.averageFee} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={this.cancel} type="button" className="btn btn-secondary"
                                    data-dismiss="modal">取消
                            </button>
                            <button onClick={this.confirmRelateClass} type="button" className="btn btn-primary">确认</button>
                        </div>
                    </div>
                </div>
            </div>
            </form>
        )
    }
}

export default DialogAccountRelateClass;