import React from 'react'
import historyBack from "../../../utils/historyBack";
import fmtTitle from "../../../utils/fmtTitle";
import CONFIG from "../../../utils/config";
import fmtDate from "../../../utils/fmtDate";
import ajax from "../../../utils/ajax";
import calculateAge from "../../../utils/calculateAge";
import {DatePicker} from "element-react";


class StudentSituationPauseClassAdd extends React.Component {
    constructor(props) {
        super(props);
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,

            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            id: this.props.location.state.id,
            type: this.props.location.state.type,
            data: null,
            list:[],
            classData:null,
            stuData:null,
            applyTime: new Date()
        };
        this.changeStu = this.changeStu.bind(this);
        this.create = this.create.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                //获取信息
                let data = await ajax('/student/situation/getStuInfo.do', {id: this.state.id});
                this.setState({data: data},()=>{
                    let dataOne = data;
                    //学生信息
                    if(dataOne){
                        this.form["stuName"].value = dataOne.stuName;
                        this.form["stuCode"].value = dataOne.stuCode;
                        this.form["parentName"].value = dataOne.parentName;
                        this.form["relation"].value = dataOne.relation;
                        this.form["cellphone"].value = dataOne.cellphone;
                        this.form["applyPerson"].value = this.props.profile.cRealname;
                    }
                    //班级信息
                    if(dataOne.classByStuId != null && dataOne.classByStuId.length > 0){
                        let zeor = dataOne.classByStuId[0];
                        this.form["classStatusName"].value = zeor.classStatusName ? zeor.classStatusName : "";
                        this.form["noUseCourseHour"].value = zeor.noUseCourseHour ? zeor.noUseCourseHour : "";
                        this.form["useCourseHour"].value = zeor.useCourseHour ? zeor.useCourseHour : "";
                        this.form["mainTeacherName"].value = zeor.mainTeacherName ? zeor.mainTeacherName : "";
                    }
                    //设置默认值
                    if(this.form["situationStatus"]){
                        this.form["situationStatus"].value = "已审批,已同意";
                    }
                });
            } catch (err) {

            }
        };
        request();
    }
    //切换班级
    changeStu(evt){
        if(evt.target.value && this.state.data && this.state.data.classByStuId && this.state.data.classByStuId.length > 0){
            this.state.data.classByStuId.map(item => {
                if(item.classId == evt.target.value){
                    let zeor = item;
                    this.form["classStatusName"].value = zeor.classStatusName ? zeor.classStatusName : "";
                    this.form["noUseCourseHour"].value = zeor.noUseCourseHour ? zeor.noUseCourseHour : "";
                    this.form["useCourseHour"].value = zeor.useCourseHour ? zeor.useCourseHour : "";
                    this.form["mainTeacherName"].value = zeor.mainTeacherName ? zeor.mainTeacherName : "";
                    return ;
                }
            });
        }
    }

    //新增
    create(){
        const request = async () => {
            try {
                let query = {};

                for (let i = 0; i < this.form.length; i++) {
                    if (this.form[i].name) {
                        query[this.form[i].name] = this.form[i].value;
                    }
                }
                query.type = 2;
                query.stuId = this.state.data.stuId;
                query.applyTime = this.state.applyTime.getTime();

                let rs = await ajax('/student/situation/situationAdd.do', query);
                historyBack(this.props.history)
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
    render() {
        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                    &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
                    <p className="d-inline text-muted">休学信息创建</p>
                    <div className="btn-group float-right" role="group">
                        <button onClick={() => {
                            historyBack(this.props.history)
                        }} type="button" className="btn btn-light">取消
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={this.create}
                            disabled={this.state.isAnimating}
                        >
                            保存
                        </button>
                    </div>
                </h5>
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
                                                <label className="col-5 col-form-label font-weight-bold">学员姓名</label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="stuName"
                                                           readOnly={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>学员编号
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="stuCode"
                                                           readOnly={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>学员状态
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="classStatusName"
                                                           readOnly={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">异动状态</label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="situationStatus"/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">休学原因</label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="reason"/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>班级名称
                                                </label>
                                                <div className="col-7">
                                                    <select className="form-control"
                                                            name="classId" onChange={this.changeStu}>
                                                        {
                                                            (this.state.data && this.state.data.classByStuId) ? this.state.data.classByStuId.map(item => (
                                                                <option key={item.classId}
                                                                        value={item.classId}>{item.classCode}</option>
                                                            )) : null
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>班级教师
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="mainTeacherName"
                                                           readOnly={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>已消耗课时
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="useCourseHour"
                                                           readOnly={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>剩余课时
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="noUseCourseHour"
                                                           readOnly={true}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>家长姓名
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="parentName"
                                                           readOnly={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>与学员关系
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="relation"
                                                           readOnly={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">联系方式</label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="cellphone" readOnly/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">

                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>申报人
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="applyPerson"
                                                           readOnly={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>申报时间
                                                </label>
                                                <div className="col-7">
                                                    <DatePicker
                                                        name="createTime"
                                                        value={this.state.applyTime}
                                                        isShowTime={false}
                                                        placeholder="选择日期"
                                                        format="yyyy-MM-dd"
                                                        onChange={date => {
                                                            console.debug('DatePicker1 changed: ', date)
                                                            this.setState({applyTime: date})
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

export default StudentSituationPauseClassAdd;