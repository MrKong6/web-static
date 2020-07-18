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
import {Button, DatePicker, Select} from 'element-react';

class Form extends React.Component {
    constructor(props) {
        super(props);
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
        this.changeInput = this.changeInput.bind(this);
        this.changeClass = this.changeClass.bind(this);
        this.changeCourse = this.changeCourse.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let relation = await ajax('/mkt/relation/list.do');
                let gender = await ajax('/mkt/gender/list.do');
                let contractAllStatus = await ajax('/service/contract/contractAllStatus.do');
                let contractStuAllStatus = await ajax('/service/contract/contractStuAllStatus.do');
                let classAllType = await ajax('/academy/class/classType.do');
                let classList = await ajax('/academy/class/getClassShortList.do',{statusId:4,orgId:this.state.group.id});
                let data = null,oneDate = null,oneAmount = null;
                classList = classList.data;
                if (this.props.isEditor) {
                    data = await ajax('/sales/contract/query.do', {id: this.props.editorId});
                    //处理付款信息中的时间
                    if (data.list && data.list.length > 0) {
                        if(!data.stuBirthday){
                            data.stuBirthday = new Date().getTime();
                        }
                        data.list.map(item => {
                            if (item.id) {
                                item.clsName = "cls" + item.periodNum;
                                item.name = item.periodNum;
                                // item.ttt = item.amount;
                                // item.amount=null;
                            }
                        });
                    }
                } else {

                    data = {
                        stuName: this.props.apporData.student.name,
                        stuGrade: this.props.apporData.student.classGrade,
                        stuBirthday: this.props.apporData.student.birthday ? new Date(this.props.apporData.student.birthday) : new Date(),
                        stuGenderId: this.props.apporData.student.genderId || '',
                        stuSchoolName: this.props.apporData.student.schoolName,
                        parName: this.props.apporData.parent.name,
                        relation: this.props.apporData.parent.relation,
                        parCellphone: this.props.apporData.parent.cellphone,
                        parWechat: this.props.apporData.parent.wechat || '',
                        parAddress: this.props.apporData.parent.address,
                        courseId: this.props.apporData.courseId || '',
                        courseName: this.props.apporData.courseName || '',
                        age: this.props.apporData.student.age,
                    }
                }

                const birthday = new Date(data.stuBirthday);
                const startDate = data.startDate ? new Date(data.startDate) : null;
                const age = calculateAge(birthday);
                data.age = age;

                this.setState({
                    option: {relation, gender},
                    data,
                    birthday,
                    age,
                    moneyList: data.list ? data.list : [],
                    oneAmount,
                    oneDate,
                    contractAllStatus,
                    contractStuAllStatus,
                    classAllType,
                    classList,
                    startDate,
                    typeId: data ? data.typeId : null,
                    contractStatus: data ? data.contractStatus : null,
                    contractStuStatus: data ? data.contractStuStatus : null,
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
                    })
                    if(data.list && data.list.length > 0){
                        // data.list.map(item => {
                        //     this.form["cls"+item.contractTime].value = item.amount;
                        // });
                    }
                    // this.form["oneAmount"].value = oneAmount;
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
        const birthday = day;
        const age = calculateAge(birthday);
        this.setState({birthday},() => {
            this.form["stuAge"].value = age;
        });
    }


    getFormValue() {

        let query = {};
        //付费信息
        if(this.state.moneyList){
            this.state.moneyList.map(item => {
                item.thisAmount = this.form[item.clsName4].value;
                item.discount = this.form[item.clsName3].value;
                item.otherFee = this.form[item.clsName2].value;
                item.bookFee = this.form[item.clsName1].value;
            });
        }

        query.typeId = this.state.typeId ? this.state.typeId : 1;
        query.stuId = this.state.data ? this.state.data.stuId : null;
        query.parId = this.state.data ? this.state.data.parId : null;
        query.listStr=JSON.stringify(this.state.moneyList);
        query.stuBirthday = this.state.birthday;
        query.startDate = this.state.startDate;
        query.courseType = this.form.courseTypeId.options[this.form.courseTypeId.selectedIndex].text;
        query.courseName = this.form.courseId.options[this.form.courseId.selectedIndex].text;
        query.courseId = this.state.data.courseId;
        query.contractStuStatus = this.state.contractStuStatus;
        query.contractStatus = this.state.contractStatus;

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
    //添加付费信息Item
    addPayItem(){
        let moneyList = this.state.moneyList;
        let size = (!moneyList && moneyList.length == 0) ? 2 : (moneyList.length + 1) + 1;
        moneyList.push({"name":size,"time":null,"amount":null,"clsName":"cls"+size});
        this.setState({moneyList:moneyList});
    }

    changeInput(key, value) {
        this.setState({
            [key] : value}
        )
    }

    changeClass(value){

    }

    changeCourse(children,data){
        if(data){
            // console.log(data);
            const keys = Object.keys(data);
            this.form['oriPrice'].value = data['amount'] ? data['amount'] : 0;
            this.state.data.courseId = data.id;
            keys.map(key => {
                if (this.form[key]) {
                    if (key === 'startDate' || key === 'endDate') {
                        this.form[key].value = fmtDate(data[key]);
                    } else {
                        this.form[key].value = data[key];
                    }
                }
            })
            if(data.fields && data.fields.length > 0){
                //期数
                data.fields.map(item => {
                    item.clsName1="cls1"+item.periodNum;
                    item.clsName2="cls2"+item.periodNum;
                    item.clsName3="cls3"+item.periodNum;
                    item.clsName4="cls4"+item.periodNum;
                });
                this.setState({moneyList:data.fields});
            }
        }
    }

    changeSelect(value,val){
        if(value == "1"){
            this.setState({contractStatus: val});
        }else if(value == "2"){
            this.setState({contractStuStatus: val});
        }
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
                                                    <input type="text" className="form-control" name="stuAge" readOnly={true}
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
                                                    <em className="text-danger">*</em>合同编号
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="code"
                                                           readOnly={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>合同日期
                                                </label>
                                                <div className="col-7">
                                                    <DatePicker
                                                        value={this.state.startDate}
                                                        isShowTime={false}
                                                        placeholder="选择日期"
                                                        format="yyyy-MM-dd"
                                                        onChange={this.changeInput.bind(this,"startDate")}
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>合同状态
                                                </label>
                                                <div className="col-7">
                                                    <Select value={this.state.contractStatus} placeholder="请选择"
                                                            onChange={this.changeSelect.bind(this, "1")}>
                                                        {
                                                            this.state.contractAllStatus ? this.state.contractAllStatus.map(el => {
                                                                return <Select.Option key={el.code} label={el.name} value={el.code} />
                                                            }) : null
                                                        }
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>(学员合同状态)
                                                </label>
                                                <div className="col-7">
                                                    <Select value={this.state.contractStuStatus} placeholder="请选择"
                                                            onChange={this.changeSelect.bind(this, "2")}>
                                                        {
                                                            this.state.contractStuAllStatus ? this.state.contractStuAllStatus.map(el => {
                                                                return <Select.Option key={el.code} label={el.name} value={el.code} />
                                                            }) : null
                                                        }
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>合同类型
                                                </label>
                                                <div className="col-7">
                                                    <Select value={this.state.typeId} placeholder="请选择">
                                                        <Select.Option key='1' label='新招' value='1' />
                                                        <Select.Option key='2' label='续报' value='2' />
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>班级类型
                                                </label>
                                                <div className="col-7">
                                                    <Select value={this.state.classType} placeholder="请选择">
                                                        {
                                                            this.state.classAllType ? this.state.classAllType.map(el => {
                                                                return <Select.Option key={el.code} label={el.name} value={el.code} />
                                                            }) : null
                                                        }
                                                    </Select>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>班级编号
                                                </label>
                                                <div className="col-7">
                                                    <Select value={this.state.classId} placeholder="请选择" onChange={this.changeClass}>
                                                        {
                                                            this.state.classList ? this.state.classList.map(el => {
                                                                return <Select.Option key={el.id} label={el.code} value={el.id} />
                                                            }) : null
                                                        }
                                                    </Select>
                                                </div>
                                            </div>
                                        </div>
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
                                                    <em className="text-danger">*</em>课程阶段
                                                </label>
                                                <div className="col-7">
                                                    <CourseName parent={this} />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>总课时
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="classHour"
                                                           readOnly={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>总课次
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="classTime"
                                                           readOnly={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>时长
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="time"
                                                           readOnly={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>单课时费
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="price"
                                                           readOnly={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>总课时费
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="oriPrice"
                                                           readOnly={true}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
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
                                                           required={true} value={this.state.profiles && this.state.profiles.cRealname ? this.state.profiles.cRealname : ''} />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>创建时间
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="startDate"
                                                           required={true}
                                                           value={formatWithTime(new Date())}
                                                           placeholder={fmtDate(new Date())}/>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="ht pt-3 pb-3 b-t b-b">付费信息</p>
                                    {/* <div className="row">
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
                                                <input type="text" className="form-control" name="oneAmount" value={this.state.oneAmount}  onChange={evt => {
                                                    this.setState({oneAmount:evt.target.value});
                                                }}
                                                       placeholder="请输入金额" required={true}/>
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <Button type="primary" icon="plus" onClick={this.addPayItem}></Button>
                                        </div>
                                    </div>*/}
                                    <div className="row">
                                        <div className="col-1">
                                            <label className="col-form-label font-weight-bold">
                                                期数
                                            </label>
                                        </div>
                                        <div className="col-1">
                                            <label className="col-form-label font-weight-bold">
                                                课时
                                            </label>
                                        </div>
                                        <div className="col-1">
                                            <label className="col-form-label font-weight-bold">
                                                课时费
                                            </label>
                                        </div>
                                        <div className="col-1">
                                            <label className="col-form-label font-weight-bold">
                                                培训资料费
                                            </label>
                                        </div>
                                        <div className="col-1">
                                            <label className="col-form-label font-weight-bold">
                                                其他费用
                                            </label>
                                        </div>
                                        <div className="col-1">
                                            <label className="col-form-label font-weight-bold">
                                                折扣费用
                                            </label>
                                        </div>
                                        <div className="col-1">
                                            <label className="col-form-label font-weight-bold">
                                                本期应收
                                            </label>
                                        </div>
                                    </div>
                                    {this.state.moneyList.map(function (item) {
                                        return <div className="row">
                                            <div className="col-1">
                                                <label className="col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>{item.periodNum}期：
                                                </label>
                                            </div>
                                            <div className="col-1">
                                                <label className="col-form-label font-weight-bold">
                                                    {item.classHour}
                                                </label>
                                            </div>
                                            <div className="col-1">
                                                <label className="col-form-label font-weight-bold">
                                                    {item.amount}
                                                </label>
                                            </div>
                                            <div className="col-1">
                                                <div className="form-group row">
                                                    <input type="text" className="form-control" name={item.clsName1} value={item.bookFee}
                                                           placeholder="请输入金额" required={true}/>
                                                </div>
                                            </div>
                                            <div className="col-1">
                                                <div className="form-group row">
                                                    <input type="text" className="form-control" name={item.clsName2} value={item.otherFee}
                                                           placeholder="请输入金额" required={true}/>
                                                </div>
                                            </div>
                                            <div className="col-1">
                                                <div className="form-group row">
                                                    <input type="text" className="form-control" name={item.clsName3} value={item.discount}
                                                           placeholder="请输入金额" required={true}/>
                                                </div>
                                            </div>
                                            <div className="col-1">
                                                <div className="form-group row">
                                                    <input type="text" className="form-control" name={item.clsName4} value={item.thisAmount}
                                                           placeholder="请输入金额" required={true}/>
                                                </div>
                                            </div>
                                        </div>
                                    })
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