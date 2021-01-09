import React from 'react'
import ReactDOM from 'react-dom'
import 'react-day-picker/lib/style.css';

import DialogTips from "../../Dialog/DialogTips";

import ajax from "../../../utils/ajax";
import fmtDate from "../../../utils/fmtDate";
import calculateAge from "../../../utils/calculateAge";
import {ColorPicker, DatePicker, Select} from "element-react";
// import InputColor from 'react-input-color';

class Form extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            group: this.props.changedCrmGroup,
            birthday: null,
            age: 0,
            option: null,
            data: null,
            startTime: null,
            endTime: null,
            courseStartTime: null,
            courseEndTime: null,
            createOn: null,
            classColor: null,
            mainTeacherIds: [],
            courseTypes: [],
            chooseCourseTypes:[]
        };
        this.changeBirthday = this.changeBirthday.bind(this);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.getFormValue = this.getFormValue.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.chooseMainTeacher = this.chooseMainTeacher.bind(this);

    }

    componentDidMount() {
        // $(".el-color-dropdown__btn").setAttribute('type',"button");
        const request = async () => {
            try {

                /*let allClass = await ajax('/academy/class/classList.do', {orgId: this.state.group.id});*/
                let allClassStatus = await ajax('/academy/class/classStatus.do');
                let allClassType = await ajax('/academy/class/classType.do');
                let allClassRange = await ajax('/academy/class/classRange.do');
                // let allClassCourse = await ajax('/academy/class/classCourseType.do', {orgId: this.state.group.id});
                let mainTeacher = await ajax('/academy/teacher/list.do', {orgId: this.state.group.id,position:1});  //主教
                let gender = await ajax('/mkt/gender/list.do');
                let list = await ajax('/course/type/listTypeAndSons.do',{orgId: this.state.group.id});  //课程类别

                let data = null;

                if(mainTeacher){
                    mainTeacher = mainTeacher.data.items;
                }

                // if(allClassCourse){
                //     allClassCourseType = allClassCourse.type;
                //     allClassCourseRange = allClassCourse.range;
                // }

                if (this.props.isEditor) {
                    data = await ajax('/academy/class/query.do', {id: this.props.editorId});
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
                //
                // const birthday = new Date(data.stuBirthday);
                // const age = calculateAge(birthday);
                let main = [];
                if(data && data.mainTeacher){
                    if(data.mainTeacher.indexOf(",") != -1){
                        data.mainTeacher.split(",").map(item => {
                            main.push(Number(item))
                        });
                    }else {
                        main.push(Number(data.mainTeacher));
                    }
                }
                this.setState({
                    option: {allClassStatus, allClassType, allClassRange,mainTeacher},
                    mainTeacherIds: main,
                    courseTypes: list.data ? list.data : [],
                }, () => {
                    if (this.props.isEditor) {
                        const keys = Object.keys(data);
                        keys.map(key => {
                            if (this.form[key]) {
                                if (key === 'createOn') {
                                    this.form[key].value = fmtDate(data[key]);
                                }else{
                                    this.form[key].value = data[key];
                                }
                            }
                            //设置时间
                            if (key === 'startDate') {
                                this.state.startTime = new Date(data[key]);
                            } else if (key === 'endDate') {
                                this.state.endTime =new Date(data[key]);
                            }else if (key === 'courseStartDate') {
                                this.state.courseStartTime =new Date(data[key]);
                            }else if (key === 'courseEndDate') {
                                this.state.courseEndTime =new Date(data[key]);
                            }else if (key === 'classColor') {
                                // this.state.classColor = data[key];
                                this.changeColor(data[key]);
                            }
                        });
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

    getFormValue() {
        if (!this.form.checkValidity()) {
            return
        }

        let query = {};
        /*query.stuBirthday = this.state.birthday;
        query.stuCode = this.form.code.value;
        query.courseType = this.form.courseId.options[this.form.courseId.selectedIndex].text;*/

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

    changeColor(evt){
        this.setState({classColor:evt});
    }

    chooseMainTeacher(data){
        this.state.mainTeacherIds = data;
    }

    //选中课程
    changeClsName(data){
        this.state.chooseCourseTypes = data;
        this.setState({chooseCourseTypes:data});
    }

    render() {

        return (
            <form ref={(dom) => {
                this.form = dom
            }} encType='multipart/form-data'>
                <div className="row justify-content-md-center">
                    <div className="col col-12">
                        <div className="card">
                            <div className="card-body">
                                <p className="ht pb-3 b-b">基本信息</p>
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>班级编号
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="code"
                                                       required={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>色块
                                            </label>
                                            <div className="col-7">
                                                {/*<ColorPicker ref='myInput' value={this.state.classColor ? this.state.classColor : null}
                                                             onChange={this.changeColor}
                                                ></ColorPicker>*/}
                                                <div>
                                                    {/*<InputColor
                                                        colorFormat='hex'
                                                        initialHexColor= "#5e72e4"
                                                        onChange={this.changeColor}
                                                        placement="right"
                                                    />
                                                    <div
                                                        style={{
                                                            width: 50,
                                                            height: 50,
                                                            marginTop: 20,
                                                            backgroundColor: this.state.classColor
                                                        }}
                                                    />*/}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">班级状态</label>
                                            <div className="col-7">
                                                <select className="form-control"
                                                        name={this.props.classStatus || "classStatus"}>
                                                    {
                                                        this.state.option ? this.state.option.allClassStatus.map(item => (
                                                            <option key={item.code}
                                                                    value={item.code}>{item.name}</option>
                                                        )) : null
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>班级类型
                                            </label>
                                            <div className="col-7">
                                                <select className="form-control" name={this.props.name || "type"}>
                                                    {
                                                        this.state.option ? this.state.option.allClassType.map(item => (
                                                            <option key={item.code}
                                                                    value={item.code}>{item.name}</option>
                                                        )) : null
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>班级类别
                                            </label>
                                            <div className="col-7">
                                                <select className="form-control" name={this.props.name || "crange"}>
                                                    {
                                                        this.state.option ? this.state.option.allClassRange.map(item => (
                                                            <option key={item.code}
                                                                    value={item.code}>{item.name}</option>
                                                        )) : null
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                校区
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="schoolArea"/>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="col">
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">开班日期</label>
                                            <div className="col-7">
                                                <DatePicker
                                                    name="createTime"
                                                    value={this.state.startTime}
                                                    isShowTime={false}
                                                    placeholder="选择日期"
                                                    format="yyyy-MM-dd"
                                                    onChange={date => {
                                                        console.debug('DatePicker1 changed: ', date)
                                                        this.setState({startTime: date})
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">结班日期</label>
                                            <div className="col-7">
                                                <DatePicker
                                                    name="createTime"
                                                    value={this.state.endTime}
                                                    isShowTime={false}
                                                    placeholder="选择日期"
                                                    format="yyyy-MM-dd"
                                                    onChange={date => {
                                                        console.debug('DatePicker1 changed: ', date)
                                                        this.setState({endTime: date})
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>计划人数
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="planNum"
                                                       readOnly={true} required={true}/>
                                            </div>
                                        </div>
                                        {/*<div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>开班人数
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="startNum"
                                                       required={true}/>
                                            </div>
                                        </div>*/}
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>实际人数
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="factNum"
                                                       required={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">主教</label>
                                            <div className="col-7">
                                                {/*<input type="text" className="form-control" name="mainTeacher"/>*/}
                                                <Select value={this.state.mainTeacherIds} disabled={true}  multiple={true} style={{width:'100%'}} onChange={this.chooseMainTeacher}>
                                                    {
                                                        (this.state.option && this.state.option.mainTeacher) ? this.state.option.mainTeacher.map(el => {
                                                            return <Select.Option key={el.id} label={el.name}
                                                                                  value={el.id}/>
                                                        }) : null
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">客服</label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="registrar"/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>课程类别
                                            </label>
                                            <div className="col-7">
                                                <Select value={this.state.chooseCourseTypes} multiple={true} disabled={true} onChange={this.changeClsName.bind(this)}>
                                                    {
                                                        this.state.courseTypes.map(group => {
                                                            return (
                                                                <Select.OptionGroup key={group.id} label={group.name}>
                                                                    {
                                                                        group.courses.map(el => {
                                                                            return (
                                                                                <Select.Option key={el.id} label={el.name} value={el.id}>
                                                                                    <span style={{float: 'left'}}>{el.name}</span>
                                                                                </Select.Option>
                                                                            )
                                                                        })
                                                                    }
                                                                </Select.OptionGroup>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            </div>
                                        </div>
                                        {/*<div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>课程类别
                                            </label>
                                            <div className="col-7">
                                                <select className="form-control" name={this.props.name || "courseType"}>
                                                    {
                                                        this.state.option ? this.state.option.allClassCourseType.map(item => (
                                                            <option key={item.code}
                                                                    value={item.code}>{item.name}</option>
                                                        )) : null
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>课程阶段
                                            </label>
                                            <div className="col-7">
                                                <select className="form-control" name={this.props.name || "courseRange"}>
                                                    {
                                                        this.state.option ? this.state.option.allClassType.map(item => (
                                                            <option key={item.code}
                                                                    value={item.code}>{item.name}</option>
                                                        )) : null
                                                    }
                                                </select>
                                            </div>
                                        </div>*/}
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">课程表</label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="course"/>
                                            </div>
                                        </div>
                                        {/*
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">创建时间</label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="createOn"
                                                       readOnly={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">创建人</label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="createBy"/>
                                            </div>
                                        </div>*/}
                                    </div>
                                    <div className="col">
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">开课日期</label>
                                            <div className="col-7">
                                                <DatePicker
                                                    name="createTime"
                                                    value={this.state.courseStartTime}
                                                    isShowTime={false}
                                                    placeholder="选择日期"
                                                    format="yyyy-MM-dd"
                                                    onChange={date => {
                                                        console.debug('DatePicker1 changed: ', date)
                                                        this.setState({courseStartTime: date})
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">结课日期</label>
                                            <div className="col-7">
                                                <DatePicker
                                                    name="createTime"
                                                    value={this.state.courseEndTime}
                                                    isShowTime={false}
                                                    placeholder="选择日期"
                                                    format="yyyy-MM-dd"
                                                    onChange={date => {
                                                        console.debug('DatePicker1 changed: ', date)
                                                        this.setState({courseEndTime: date})
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">备注</label>
                                            <div className="col-7">
                                                {/*<select className="form-control"
                                                        name={this.props.name || "beforeClassCode"}>
                                                    <option value="">请选择</option>
                                                    {
                                                        this.state.option ? this.state.option.allClass.map(item => (
                                                            <option key={item.code}
                                                                    value={item.code}>{item.name}</option>
                                                        )) : null
                                                    }
                                                </select>*/}
                                                <input type="text" className="form-control" name="beforeClassCode"/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        )
    }

    // }
}

export default Form;