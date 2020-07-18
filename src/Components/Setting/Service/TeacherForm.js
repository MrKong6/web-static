import React from 'react'
import ReactDOM from 'react-dom'

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import DialogTips from "../../Dialog/DialogTips";
import Gender from '../../Dic/Gender';
import Grade from '../../Dic/Grade';
import Document from '../../Dic/Document';

import ajax from "../../../utils/ajax";
import fmtDate from "../../../utils/fmtDate";
import calculateAge from "../../../utils/calculateAge";
import {DatePicker, Message, Select} from "element-react";
import {changeArrayItemToString} from "../../../utils/objectToArray";
import {$} from "../../../vendor";


class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            group: this.props.changedCrmGroup,
            birthday: null,
            age: 0,
            option: {'gender':[],'positionList':[],'typeList':[],'rangeList':[],'accountTeacherList':[]},
            data: null,
            courseTypeList: [],
            chooseCouse: [],
        };
        this.changeBirthday = this.changeBirthday.bind(this);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.getFormValue = this.getFormValue.bind(this);
        this.changeCourse = this.changeCourse.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let gender = await ajax('/mkt/gender/list.do',{filterNone:'1'});
                let typeList = await ajax('/academy/teacher/teacherTypeList.do');
                let rangeList = await ajax('/academy/teacher/teacherRangeList.do');
                let positionList = await ajax('/academy/teacher/teacherPosition.do');
                let accountTeacherList = await ajax('/user/listUserByRole.do',{orgId:this.state.group.id,type:2});
                let courseTypeList = await ajax('/course/type/courseTypeList.do');
                let data = null;
                if (this.props.isEditor) {
                    data = await ajax('/academy/teacher/query.do', {id: this.props.editorId});
                    data = data.data;
                }
                /*else {
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
                       }*/

                let birthday = null;
                let age = null;
                if (data) {
                    birthday = data.birthday  ? new Date((data.birthday)) : new Date();
                    age = calculateAge(birthday);
                }
                $('.el-input__inner').attr('name','course')
                this.setState({
                    option: {gender,typeList,rangeList,positionList,accountTeacherList},
                    data,
                    birthday,
                    age,
                    courseTypeList: courseTypeList,
                    chooseCouse: data && data.courseId ? data.courseId.split(",") : [],
                }, () => {
                    if (this.props.isEditor) {
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
                    }
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

        this.setState({birthday, age});
    }

    //更改课程
    changeCourse(value){
        this.state.chooseCouse = value;
    }
    getFormValue() {
        if (!this.form.checkValidity()) {
            return
        }

        if (this.state.chooseCouse.length  <= 0) {
            Message({
                type: 'warning',
                message: '请选择负责学科!'
            });
            return
        }

        let query = {};

        query.birthday = this.state.birthday;
        for (let i = 0; i < this.form.length; i++) {
            if (this.form[i].name) {
                /*if (this.form[i].name === 'startDate' || this.form[i].name === 'endDate') {
                    query[this.form[i].name] = new Date(this.form[i].value);
                } else {*/
                    query[this.form[i].name] = this.form[i].value;
                /*}*/
            }
        }
        let courseNames = [];
        this.state.chooseCouse.map(cc => {
            this.state.courseTypeList.map(item => {
                if(cc == item.id){
                    courseNames.push(item.name);
                }
            });
        });
        query.courseId = changeArrayItemToString(this.state.chooseCouse);
        query.courseName = changeArrayItemToString(courseNames);

        return query;
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
                                                <em className="text-danger">*</em>编号
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="code"
                                                       required={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>姓名
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="name"
                                                       required={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>英文名
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="enName"
                                                       required={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">性别</label>
                                            <div className="col-7">
                                                <Gender data={this.state.option.gender} name="genderId" type={"1"}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">职位</label>
                                            <div className="col-7">
                                                <select className="form-control"
                                                        name={this.props.name || "position"}>
                                                    <option value="">请选择</option>
                                                    {
                                                        this.state.option ? this.state.option.positionList.map(item => (
                                                            <option key={item.code}
                                                                    value={item.code}>{item.name}</option>
                                                        )) : null
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">类型</label>
                                            <div className="col-7">
                                                <select className="form-control"
                                                        name={this.props.name || "type"}>
                                                    <option value="">请选择</option>
                                                    {
                                                        this.state.option ? this.state.option.typeList.map(item => (
                                                            <option key={item.code}
                                                                    value={item.code}>{item.name}</option>
                                                        )) : null
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">类别</label>
                                            <div className="col-7">
                                                <select className="form-control"
                                                        name={this.props.name || "ranget"}>
                                                    <option value="">请选择</option>
                                                    {
                                                        this.state.option ? this.state.option.rangeList.map(item => (
                                                            <option key={item.code}
                                                                    value={item.code}>{item.name}</option>
                                                        )) : null
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">负责学科</label>
                                            <div className="col-7">
                                                <Select name={'course'} value={this.state.chooseCouse} placeholder="负责学科" name={'course'} multiple={true}
                                                        filterable={true} clearable={true} style={{"width": "100%"}}
                                                        onChange={this.changeCourse.bind(this)}>
                                                    {
                                                        (this.state.courseTypeList && this.state.courseTypeList.length > 0) ? this.state.courseTypeList.map(el => {
                                                            return <Select.Option key={el.id+''} label={el.name}
                                                                                  value={el.id+''}/>
                                                        }) : null
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>出生年月
                                            </label>
                                            <div className="col-7">
                                                <DatePicker
                                                    name="birthday"
                                                    value={this.state.birthday}
                                                    isShowTime={false}
                                                    placeholder="选择日期"
                                                    format="yyyy-MM-dd"
                                                    onChange={date => {
                                                        let get = calculateAge(fmtDate(date));
                                                        this.setState({birthday: date,age: get})
                                                        console.debug('DatePicker1 changed: ', this.state.age)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>年龄
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="age"
                                                       value={this.state.age ? this.state.age : ''} readOnly={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">关联账户</label>
                                            <div className="col-7">
                                                <select className="form-control"
                                                        name={this.props.name || "userId"}>
                                                    <option value="">请选择</option>
                                                    {
                                                        this.state.option ? this.state.option.accountTeacherList.map(item => (
                                                            <option key={item.cId}
                                                                    value={item.cId}>{item.cRealName}({item.cLoginName})</option>
                                                        )) : null
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                备注
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="comment"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col"/>
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