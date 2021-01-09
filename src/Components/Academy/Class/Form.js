import React from 'react'
import ReactDOM from 'react-dom'
import 'react-day-picker/lib/style.css';

import DialogTips from "../../Dialog/DialogTips";

import ajax from "../../../utils/ajax";
import fmtDate from "../../../utils/fmtDate";
import calculateAge from "../../../utils/calculateAge";
import {DatePicker, Message, Select} from "element-react";
import InputColor from 'react-input-color';
import {getSonListByGroupId, sonListByGroup} from "../../../utils/groupProcess";
import {$} from "../../../vendor";
import groupProcess from "../../../utils/groupProcess";
import Org from "../../Dic/Org";

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
            allClassCourseRange: [],
            chooseCourseTypes:[],
            courseTypes: [],
            userList: [],
            orgList: [],
        };
        this.changeBirthday = this.changeBirthday.bind(this);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.getFormValue = this.getFormValue.bind(this);
        this.changeColor = this.changeColor.bind(this);
        this.chooseMainTeacher = this.chooseMainTeacher.bind(this);
        this.changeCourseType = this.changeCourseType.bind(this);
        this.changeClsName = this.changeClsName.bind(this);
        this.refreshUserList = this.refreshUserList.bind(this);
    }

    componentDidMount() {
        // $(".el-color-dropdown__btn").setAttribute('type',"button");
        const request = async () => {
            try {

                //设置所属组织
                let orgList = await ajax('/user/listOrgs.do');
                //设置组织
                let dataList = [];
                let dataByOrgId = [];
                dataByOrgId.push(getSonListByGroupId(groupProcess(orgList), this.state.group.id));
                sonListByGroup(dataByOrgId, dataList);

                /*let allClass = await ajax('/academy/class/classList.do', {orgId: this.state.group.id});*/
                let allClassStatus = await ajax('/academy/class/classStatus.do');
                let allClassType = await ajax('/academy/class/classType.do');
                let allClassRange = await ajax('/academy/class/classRange.do');
                let allClassCourse = await ajax('/academy/class/classCourseType.do',{orgId: this.state.group.id});
                let mainTeacher = await ajax('/academy/teacher/list.do', {orgId: this.state.group.id,position:1});  //主教
                let list = await ajax('/course/type/listTypeAndSons.do',{orgId: this.state.group.id});  //课程类别
                let data = null,allClassCourseType=[],allClassCourseRange=[],chooseCourseTypes=[];
                if(mainTeacher){
                    mainTeacher = mainTeacher.data.items;
                }

                if(allClassCourse){
                    allClassCourseType = allClassCourse.type;
                    allClassCourseRange = allClassCourse.range;
                }

                if (this.props.isEditor) {
                    data = await ajax('/academy/class/query.do', {id: this.props.editorId});
                    data = data.data;
                    allClassStatus = this.dealClassStatus(data.classStatus, allClassStatus);
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
                    if(data.mainTeacher.indexOf(",") !== -1){
                        data.mainTeacher.split(",").map(item => {
                            main.push(Number(item))
                        });
                    }else {
                        main.push(Number(data.mainTeacher));
                    }
                }

                //课程
                if(data && data.courses){
                    data.courses.map(item => {
                        chooseCourseTypes.push(item.id);
                    });
                }
                this.setState({
                    option: {allClassStatus, allClassType, allClassRange, allClassCourseType,mainTeacher},
                    mainTeacherIds: main,
                    allClassCourseRange: allClassCourseRange,
                    courseTypes: list.data ? list.data : [],
                    chooseCourseTypes,
                    orgList: dataList
                }, () => {
                    if (this.props.isEditor) {
                        const keys = Object.keys(data);
                        debugger
                        keys.map(key => {
                            if (this.form[key]) {
                                if (key === 'createOn') {
                                    this.form[key].value = fmtDate(data[key]);
                                }else if (key === 'courseStartDate') {
                                    this.form[key].value =fmtDate(data[key]);
                                }else if (key === 'courseEndDate') {
                                    this.form[key].value =fmtDate(data[key]);
                                }else if (key === 'orgName') {
                                    this.form["orgName"].value = data['orgId'];
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
                    }else{
                        this.form['classStatus'].value = '1';
                        this.form['createOn'].value = fmtDate(new Date());
                        // this.form['crea'].value = this.state.group.cRealName;
                        this.form['createBy'].value = this.state.group.cRealName;
                        this.form['orgName'].value = this.state.group.id;
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
        this.refreshUserList();
        request()
    }

    dealClassStatus(classStatus, allClassStatus){
        let codes = [3,4,5,6];
        debugger
        //未排课情况下不能编辑班级状态
        if(classStatus == 1){
            allClassStatus.map(item => {
                item.showStr = "2";
            });
        }else if(classStatus == 2){
            //已排课状态下放开 3/4/5/6
            allClassStatus.map(item => {
                if(codes.filter(it => item.code == it).length <= 0){
                    item.showStr = "2";
                }
            });
        }else if(codes.filter(it => classStatus == it).length > 0){
            //进入3/4/5/6 可互选     到6可选7
            allClassStatus.map(item => {
                if(item.code > 6 || item.code < codes[0]){
                    item.showStr = "2";
                }
                if(classStatus == 6 && item.code == 7){
                    item.showStr = null;
                }
            });
        }else if(classStatus == 7){
            //7   放开6
            allClassStatus.map(item => {
                if(item.code != 6){
                    item.showStr = "2";
                }
            });
        }else if(classStatus == 8){
            //只有在已开课8时才放开未结课9
            allClassStatus.map(item => {
                if(item.code < 8){
                    item.showStr = "2";
                }
            });

        }
        return allClassStatus;
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

    errorMsg(msg) {
        Message({
            message: msg,
            type: 'error'
        });
    }

    getFormValue() {

        //处理课程阶段
        let hasCourse = [], courseRange = '';
        this.state.chooseCourseTypes.map(item => {
            let courseTypeId = null;
            this.state.courseTypes.map(vo => {
                if(vo.courses && vo.courses.length > 0){
                    vo.courses.map(cou => {
                        if(cou.id == item){
                            courseTypeId = vo.id;
                            courseRange += (vo.name+'('+ cou.name +')');
                        }
                    })
                }
            });
            if(hasCourse.filter(item => item == courseTypeId).length > 0){
                this.errorMsg("同一课程阶段下只能选择一个");
                return
            }else{
                hasCourse.push(courseTypeId);
            }
        });
        if (!this.form.checkValidity()) {
            this.errorMsg("请补全信息");
            return
        }

        if(!this.state.chooseCourseTypes){
            this.errorMsg("请选择课程阶段");
            return
        }

        let query = {courseRelIds: this.state.chooseCourseTypes,courseRange:courseRange};
        /*query.stuBirthday = this.state.birthday;
        query.stuCode = this.form.code.value;
        query.courseType = this.form.courseId.options[this.form.courseId.selectedIndex].text;*/


        for (let i = 0; i < this.form.length; i++) {
            if (this.form[i].name) {
                if (this.form[i].name === 'startDate' || this.form[i].name === 'endDate') {
                    query[this.form[i].name] = new Date(this.form[i].value);
                } else if(this.form[i].name === 'orgName'){
                    query.orgId = this.form[i].value;
                } else if(this.form[i].name === 'executiveName'){
                    query.executiveId = this.form[i].value;
                } else {
                    query[this.form[i].name] = this.form[i].value ? this.form[i].value : null;
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

    changeCourseType(evt){
        const request = async () => {
            let allClassCourse = await ajax('/academy/class/classCourseType.do',{orgId: this.state.group.id,courseType:evt.target.value});
            if(allClassCourse){
                let allClassCourseRange = allClassCourse.range;
                this.setState({
                    allClassCourseRange:allClassCourseRange,
                });
            }
        };
        request()
    }

    //获取所属用户列表
    refreshUserList(){
        const request = async () => {
            try {
                let list = await ajax('/user/listUserByRole.do', {orgId: this.state.group.id, type: 5});
                this.setState({
                    userList: list
                });
            } catch (err) {
                if (err.errCode === 401) {
                    this.dialog.modal('hide');
                    // this.props.replace('/login', {from: this.props.from})
                } else {
                    this.setState({errText: `${err.errCode}: ${err.errText}`});
                }
            }
        };
        request();
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
                                                   <InputColor
                                                        colorFormat='hex'
                                                        initialHexColor= "#5e72e4"
                                                        onChange={this.changeColor}
                                                        placement="right"
                                                    />
                                                    <div
                                                        style={{
                                                            backgroundColor: this.state.classColor,
                                                            width: 50,
                                                            height: 50,
                                                            marginTop: 20,
                                                        }}
                                                    />
                                                </div>
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
                                            <label className="col-5 col-form-label font-weight-bold">班级状态</label>
                                            <div className="col-7">
                                                <select className="form-control"
                                                        name={this.props.classStatus || "classStatus"} disabled={!this.props.isEditor}>/**/
                                                    {
                                                        this.state.option ? this.state.option.allClassStatus.map(item => (
                                                            (item.showStr) == '2' ?
                                                                <option key={item.code} value={item.code} disabled={'disabled'} style={{"background":"#e9ecef"}}>{item.name}</option>
                                                            :
                                                                <option key={item.code} value={item.code}>{item.name}</option>
                                                        )) : null
                                                    }
                                                </select>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="col">
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>课程类别
                                            </label>
                                            <div className="col-7">
                                                <Select value={this.state.chooseCourseTypes} multiple={true} onChange={this.changeClsName.bind(this)}>
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

                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>计划人数
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="planNum"
                                                       required={true}/>
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
                                                <input type="text" className="form-control" name="factNum" readOnly={true}
                                                       required={true}/>
                                            </div>
                                        </div>
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
                                    </div>
                                    <div className="col">
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">主教</label>
                                            <div className="col-7">
                                                {/*<input type="text" className="form-control" name="mainTeacher"/>*/}
                                                {/*<Select value={this.state.mainTeacherIds} multiple={true} style={{width:'100%'}} onChange={this.chooseMainTeacher}>
                                                    {
                                                        (this.state.option && this.state.option.mainTeacher) ? this.state.option.mainTeacher.map(el => {
                                                            return <Select.Option key={el.id} label={el.name}
                                                                                  value={el.id}/>
                                                        }) : null
                                                    }
                                                </Select>*/}
                                                <input type="text" className="form-control" name="mainTeacherName" readOnly={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">助教</label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="registrar" readOnly={true}/>
                                            </div>
                                        </div>
                                        {/*<div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>课程阶段
                                            </label>
                                            <div className="col-7">
                                                <select className="form-control" name={this.props.name || "courseRange"}>
                                                    {
                                                        this.state.allClassCourseRange ? this.state.allClassCourseRange.map(item => (
                                                            <option key={item}
                                                                    value={item}>{item}</option>
                                                        )) : null
                                                    }
                                                </select>
                                            </div>
                                        </div>*/}
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">课程表</label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="course" readOnly={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">开课日期</label>
                                            <div className="col-7">
                                                {/*<DatePicker
                                                    name="createTime"
                                                    value={this.state.courseStartTime}
                                                    isShowTime={false}
                                                    placeholder="选择日期"
                                                    format="yyyy-MM-dd"
                                                    onChange={date => {
                                                        console.debug('DatePicker1 changed: ', date)
                                                        this.setState({courseStartTime: date})
                                                    }}
                                                />*/}
                                                <input type="text" className="form-control" name="courseStartDate" readOnly={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">结课日期</label>
                                            <div className="col-7">
                                                {/*<DatePicker
                                                    name="createTime"
                                                    value={this.state.courseEndTime}
                                                    isShowTime={false}
                                                    placeholder="选择日期"
                                                    format="yyyy-MM-dd"
                                                    onChange={date => {
                                                        console.debug('DatePicker1 changed: ', date)
                                                        this.setState({courseEndTime: date})
                                                    }}
                                                />*/}
                                                <input type="text" className="form-control" name="courseEndDate" readOnly={true}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">所属用户</label>
                                            <div className="col-7">
                                                <select name="executiveId" className="form-control">
                                                    <option value="">请选择</option>
                                                    {
                                                        this.state.userList ? this.state.userList.map((user) => (
                                                            <option value={user.cId}>{user.cRealName}</option>
                                                        )) : []
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">所属组织</label>
                                            <div className="col-7">
                                                {/*<input type="text" id="orgName" className="form-control" name="orgName" readOnly={true}/>*/}
                                                <select name="orgName" className="form-control" id="orgName">
                                                    {
                                                        this.state.orgList ? this.state.orgList.map(item => (
                                                            <option key={item.id}
                                                                    value={item.id}>{item.name}({item.name})</option>
                                                        )) : null
                                                    }
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">创建时间</label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="createOn"
                                                       readOnly={true}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">创建用户</label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="createBy" readOnly={true}/>
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
                                        {/*<div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">备注</label>
                                            <div className="col-7">
                                                <select className="form-control"
                                                        name={this.props.name || "beforeClassCode"}>
                                                    <option value="">请选择</option>
                                                    {
                                                        this.state.option ? this.state.option.allClass.map(item => (
                                                            <option key={item.code}
                                                                    value={item.code}>{item.name}</option>
                                                        )) : null
                                                    }
                                                </select>
                                                <input type="text" className="form-control" name="beforeClassCode"/>
                                            </div>
                                        </div>*/}
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