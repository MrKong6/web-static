import React from 'react'
import ReactDOM from 'react-dom'
import 'react-day-picker/lib/style.css';

import DialogTips from "../../Dialog/DialogTips";
import Gender from '../../Dic/Gender';
import Relation from '../../Dic/Relation';
import Grade from '../../Dic/Grade';
import CourseType from '../../Dic/CourseType';
import CourseName from '../../Dic/CourseName';
import Document from '../../Dic/Document';

import ajax from "../../../utils/ajax";
import fmtDate, {formatWithTime,formatWithOnlyTime} from "../../../utils/fmtDate";
import calculateAge from "../../../utils/calculateAge";
import {Button, DatePicker} from "element-react";

class Form extends React.Component {
    constructor(props) {
        super(props);
        debugger
        this.state = {
            group: this.props.changedCrmGroup,
            birthday: null,
            age: 0,
            option: null,
            data: null,
            moneyList: [],
            oneAmount: null,
            oneDate : null,
        };
        this.changeBirthday = this.changeBirthday.bind(this);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.getFormValue = this.getFormValue.bind(this);
        this.addPayItem = this.addPayItem.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let relation = await ajax('/mkt/relation/list.do');
                let gender = await ajax('/mkt/gender/list.do');
                let data = null,oneDate = null,oneAmount = null;

                if (this.props.isEditor) {
                    data = await ajax('/service/contract/query.do', {id: this.props.editorId});
                    //处理付款信息中的时间
                    if (data.list && data.list.length > 0) {
                        oneDate = formatWithOnlyTime(data.list[0].contractDate);
                        oneAmount = data.list[0].amount;
                        data.list.map(item => {
                            if (item.contractDate) {
                                item.contractDate = formatWithOnlyTime(item.contractDate);
                                item.clsName = "cls" + item.contractTime;
                            }
                        });
                        data.list.shift();
                    }
                } else {
                    data = {
                        stuName: this.props.apporData.student.name,
                        stuGrade: this.props.apporData.student.classGrade,
                        stuBirthday: new Date(this.props.apporData.student.birthday),
                        stuGenderId: this.props.apporData.student.genderId || '',
                        stuSchoolName: this.props.apporData.student.schoolName,
                        parName: this.props.apporData.parent.name,
                        relation: this.props.apporData.parent.relation,
                        parCellphone: this.props.apporData.parent.cellphone,
                        parWechat: this.props.apporData.parent.wechat || '',
                        parAddress: this.props.apporData.parent.address,
                        courseId: this.props.apporData.courseId || '',
                        courseName: this.props.apporData.courseName || ''
                    }
                }

                const birthday = data.stuBirthday ? new Date(data.stuBirthday) : new Date();
                const age = calculateAge(birthday);
                data.age = age;

                this.setState({
                    option: {relation, gender},
                    data,
                    birthday,
                    age,
                    moneyList: data.list,
                    oneDate,
                    oneAmount
                }, () => {
                    const keys = Object.keys(data);

                    keys.map(key => {
                        if (this.form[key]) {
                            if (key === 'startDate' || key === 'endDate') {
                                this.form[key].value = fmtDate(data[key]);
                            } else {
                                this.form[key].value = data[key];
                            }
                        }
                    });
                    if(data.list && data.list.length > 0){
                        data.list.map(item => {
                            this.form[item.clsName].value = item.amount;
                        });
                    }
                    this.form["oneAmount"].value = oneAmount;
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
        debugger
        const birthday = day;
        const age = calculateAge(birthday);
        this.setState({birthday},() => {
            this.form["stuAge"].value = age;
        });
    }

    //添加付费信息Item
    addPayItem(){
        let moneyList = this.state.moneyList;
        let size = (!moneyList && moneyList.length == 0) ? 2 : (moneyList.length + 1) + 1;
        moneyList.push({"contractTime":size,"time":null,"amount":null,"clsName":"cls"+size});
        this.setState({moneyList:moneyList});
    }

    getFormValue() {
        /*if (!this.form.checkValidity() || !this.form.stuGrade.value || !this.form.courseId.value || !this.form.courseName.value) {
            return
        }*/

        let query = {};
        let list = [];
        // if(this.state.moneyList){
        //     this.state.moneyList.map(item => {
        //         if(item.amount && item.amount > 0){
        //             list.push({"contractId":item.contractId,"contractTime":item.name,"contractDate":item.contractDate,"amount":this.form[item.clsName].value})
        //         }
        //     });
        //     query.listStr=JSON.stringify(list);
        // }
        //付费信息
        list.push({"contractTime":1,"contractDate":this.state.oneDate,"amount":this.form["oneAmount"].value})
        if(this.state.moneyList){
            this.state.moneyList.map(item => {
                if(this.form[item.clsName] && this.form[item.clsName].value > 0){
                    list.push({"contractTime":item.contractTime,"contractDate":item.contractDate,"amount":this.form[item.clsName].value})
                }
            });
        }

        query.listStr=JSON.stringify(list);
        query.stuBirthday = this.state.birthday;
        query.stuId=this.state.data.stuId;
        query.parId = this.state.data.parId;
        // query.stuCode = this.form.code.value;
        query.courseType = this.form.courseId.options[this.form.courseId.selectedIndex].text;

        for (let i = 0; i < this.form.length; i++) {
            if (this.form[i].name) {
                if (this.form[i].name === 'startDate' || this.form[i].name === 'endDate') {
                    query[this.form[i].name] = new Date(this.form[i].value);
                } else {
                    query[this.form[i].name] = this.form[i].value;
                }
            }
        }

        return query;
    }

    render() {
        var aa = this;
        if (!this.state.option || (this.props.isEditor && !this.state.data)) {
            return (
                <form ref={(dom) => {
                    this.form = dom
                }}>
                    <div className="row justify-content-md-center">
                        <div className="col col-12">
                            <div className="card">
                                <div className="card-body">数据加载中...</div>
                            </div>
                        </div>
                    </div>
                </form>
            )
        } else {
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
                                                    <em className="text-danger">*</em>学员姓名
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="stuName"
                                                           required={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">学员性别</label>
                                                <div className="col-7">
                                                    <Gender data={this.state.option.gender} name="stuGenderId"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>出生年月
                                                </label>
                                                <div className="col-7">
                                                    <DatePicker
                                                        name="createTime"
                                                        value={this.state.birthday}
                                                        isShowTime={true}
                                                        placeholder="选择日期"
                                                        format="yyyy-MM-dd"
                                                        onChange={this.changeBirthday}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>学员年龄
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="stuAge"
                                                           readOnly={true}
                                                           value={this.state.data.age ? this.state.data.age : ''}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>在读年级
                                                </label>
                                                <div className="col-7">
                                                    <Grade name="stuGrade"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>所在学校
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="stuSchoolName"
                                                           required={true}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">证件类型</label>
                                                <div className="col-7">
                                                    <Document name="stuIdType"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">证件号码</label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="stuIdCode"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>家长姓名
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="parName"
                                                           required={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>与孩子关系
                                                </label>
                                                <div className="col-7">
                                                    <Relation data={this.state.option.relation}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>联系电话
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="parCellphone"
                                                           required={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">微信号</label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="parWechat"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">电子邮箱</label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="parEmail"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">家庭住址</label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="parAddress"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col"/>
                                    </div>
                                    <p className="ht pt-3 pb-3 b-t b-b">合同信息</p>
                                    <div className="row">
                                        <div className="col">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>课程类别
                                                </label>
                                                <div className="col-7">
                                                    <CourseType/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>课程产品
                                                </label>
                                                <div className="col-7">
                                                    <CourseName/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>总课时
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="courseHours"
                                                           required={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>总课次
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="courseTimes"
                                                           required={true}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>课时费
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="oriPrice"
                                                           required={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>培训资料费
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="discPrice"
                                                           required={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    其他费用
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="otherPrice"
                                                           required={true}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>合同金额
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="contractPrice"
                                                           required={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>折扣金额
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="countPrice"
                                                           required={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>应付金额
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="finalPrice"
                                                           required={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>已付金额
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="paid"
                                                           required={true}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>创建人
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="cRealname"
                                                           required={true}
                                                           value={this.state.data.creatorName ? this.state.data.creatorName : ''}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>创建时间
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="startDate"
                                                           required={true}
                                                           value={formatWithTime(this.state.data.createTime ? this.state.data.createTime : new Date())}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="ht pt-3 pb-3 b-t b-b">付费信息</p>
                                    <div className="row">
                                        <div className="col-1">
                                            <label className="col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>1期：
                                            </label>
                                        </div>
                                        <div className="col-3">
                                            <div className="form-group">
                                                <DatePicker
                                                    name="oneDate"
                                                    value={this.state.oneDate}
                                                    isShowTime={false}
                                                    placeholder="选择日期"
                                                    format="yyyy-MM-dd"
                                                    onChange={date => {
                                                        console.debug('DatePicker1 changed: ', date)
                                                        this.setState({oneDate:date});
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-3">
                                            <div className="form-group row">
                                                <input type="text" className="form-control" name="oneAmount"
                                                       placeholder="请输入金额" required={true}/>
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <Button type="primary" icon="plus" onClick={this.addPayItem}></Button>
                                        </div>
                                    </div>
                                    {this.state.moneyList ? this.state.moneyList.map(function (evt) {
                                        return <div className="row">
                                            <div className="col-1">
                                                <label className="col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>{evt.contractTime}期：
                                                </label>
                                            </div>
                                            <div className="col-3">
                                                <div className="form-group">
                                                    <DatePicker
                                                        value={evt.contractDate}
                                                        isShowTime={false}
                                                        placeholder="选择日期"
                                                        format="yyyy-MM-dd"
                                                        onChange={date => {
                                                            console.debug('DatePicker1 changed: ', date)
                                                            evt.contractDate = date;
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <div className="form-group row">
                                                    <input type="text" className="form-control" name={evt.clsName}
                                                           placeholder="请输入金额" required={true}/>
                                                </div>
                                            </div>
                                        </div>
                                        }) : null
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )
        }
    }
}

export default Form;