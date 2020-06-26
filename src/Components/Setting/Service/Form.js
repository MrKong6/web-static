import React from 'react'
import ReactDOM from 'react-dom'
import 'react-day-picker/lib/style.css';

import DialogTips from "../../Dialog/DialogTips";

import ajax from "../../../utils/ajax";
import calculateAge from "../../../utils/calculateAge";
import {Button, DatePicker} from "element-react";

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            group: this.props.changedCrmGroup,
            birthday: null,
            age: 0,
            option: null,
            data: null,
            selectedCou: this.props.selectedCou,
            selectedCouText: this.props.selectedCouText,
            moneyList: [],
            oneAmount: null,
            oneDate : null,
            oneId : null,
        };
        this.changeBirthday = this.changeBirthday.bind(this);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.getFormValue = this.getFormValue.bind(this);
        this.addPayItem = this.addPayItem.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let data = null;

                if (this.props.isEditor) {
                    data = await ajax('/course/type/query.do', {id: this.props.editorId});
                    data = data.data
                    let moneyList = [],oneAmount = (data.fields && data.fields.length > 0) ? data.fields[0].classHour : 0,
                        oneId = (data.fields && data.fields.length > 0) ? data.fields[0].id : null;
                    if(data.fields){
                        data.fields.map(item => {
                            item.clsName = "cls"+item.periodNum;
                        })
                    }
                    if(data && data.fields && data.fields.length > 1){
                        moneyList = data.fields.slice(1);
                    }
                    this.setState({
                        data: data,
                        moneyList: moneyList,
                        oneId
                    }, () => {
                        const keys = Object.keys(data);
                        this.form["oneAmount"].value = oneAmount;
                        keys.map(key => {
                            if (this.form[key]) {
                                this.form[key].value = data[key];
                            }
                        })
                        moneyList.map(item =>{
                            // item.clsName = "cls"+((!moneyList && moneyList.length == 0) ? 2 : (moneyList.length + 1) + 1);
                            this.form[item.clsName].value = item.classHour;
                        })
                    });
                } else {

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
        query.courseTypeId = this.state.selectedCou;
        query.courseType = this.state.selectedCouText;

        for (let i = 0; i < this.form.length; i++) {
            if (this.form[i].name) {
                if (this.form[i].name === 'startDate' || this.form[i].name === 'endDate') {
                    query[this.form[i].name] = new Date(this.form[i].value);
                } else {
                    query[this.form[i].name] = this.form[i].value;
                }
            }
        }

        //课时数
        let list=[]
        list.push({"periodNum":1,"classHour":this.form["oneAmount"].value,"id": this.state.oneId})
        if(this.state.moneyList){
            this.state.moneyList.map(item => {
                if(this.form[item.clsName] && this.form[item.clsName].value > 0){
                    list.push({"periodNum":item.periodNum,"classHour":this.form[item.clsName].value,"id":item.id})
                }
            });
        }
        query.fields = list;

        return query;
    }

    //添加付费信息Item
    addPayItem(){
        let moneyList = this.state.moneyList;
        let size = (!moneyList && moneyList.length == 0) ? 2 : (moneyList.length + 1) + 1;
        moneyList.push({"periodNum":size,"time":null,"periodClassHour":null,"clsName":"cls"+size});
        this.setState({moneyList:moneyList});
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
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>课程类别
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" value={this.state.selectedCouText}
                                                       disabled={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>课程阶段
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="name"
                                                       required={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>总课时
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="classHour"
                                                       required={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>总课次
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="classTime"
                                                       required={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>每周课时
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="classHourPerWeek"
                                                       required={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>每周课次
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="classTimePerWeek"
                                                       required={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>时长(min)
                                            </label>
                                            <div className="col-7">
                                                <input type="number" className="form-control" name="time"
                                                       required={true}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group row">
                                            <div className="col-3">
                                            </div>
                                            <div className="col-2">
                                                <label className="col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>1期：
                                                </label>
                                            </div>
                                            <div className="col-3">
                                                <div className="form-group row">
                                                    <input type="text" className="form-control" name="oneAmount"
                                                           placeholder="请输入课时数" />
                                                </div>
                                            </div>
                                            <div className="col-2">
                                                <Button type="primary" icon="plus" onClick={this.addPayItem}></Button>
                                            </div>
                                        </div>
                                        {this.state.moneyList ? this.state.moneyList.map(function (evt) {
                                            return <div className="form-group row">
                                                        <div className="col-3"></div>
                                                        <div className="col-2">
                                                            <label className="col-form-label font-weight-bold">
                                                                <em className="text-danger">*</em>{evt.periodNum}期：
                                                            </label>
                                                        </div>
                                                        <div className="col-3">
                                                            <div className="form-group row">
                                                                <input type="text" className="form-control" name={evt.clsName}
                                                                       placeholder="请输入课时数" required={true}/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }) : null
                                        }
                                    </div>
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