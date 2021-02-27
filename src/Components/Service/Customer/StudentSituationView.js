import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'
import {Button, Dialog, Pagination, Radio, Table, Tabs} from 'element-react';

import DialogTips from "../../Dialog/DialogTips";
import Commands from "../../Commands/Commands";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import fmtDate, {formatWithTime} from "../../../utils/fmtDate";
import StudentSit from "../../Service/Situation/StudentSituation"

class StudentSituation extends React.Component {
    constructor(props) {
        super(props);
        debugger
        this.commands = this.props.commands ? this.props.commands.filter(command => (command.name !== 'Mod')): (this.props.location.state && this.props.location.state.commands ? this.props.location.state.commands : []);
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            id: this.props.match.params.contractId,
            data: {},
            stuName: null,
            ids: [],
            totalPage: 0,
            currentPage: 1,
            pageSize: 10,
            totalCount: 0,
            situationView: 1
        };
        this.modAction = this.modAction.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let data = await ajax('/student/situation/getSituationInfo.do', {
                    id:this.state.id
                });
                if(data && data.applyTime){
                    data.applyTime = formatWithTime(data.applyTime);
                }
                this.setState({data,situationView: data ? data.type : 1});
            } catch (err) {

            }
        };

        request();
        mainSize();
    }

    toDirect() {
        if(this.state.situationView == 1){
            this.props.history.push(`/home/academy/class/situation/backMoneyAdd/${this.state.id}`, {id: this.state.id,type: 2, data: this.state.data});
        }else if(this.state.situationView == 2){
            this.props.history.push(`/home/academy/class/situation/pauseClassAdd/${this.state.id}`, {id: this.state.id,type: 2, data: this.state.data});
        }else{
            this.props.history.push(`/home/academy/class/situation/changeClassAdd/${this.state.id}`, {id: this.state.id,type: 2, data: this.state.data});
        }
    }

    modAction() {
        // this.toDirect();
        this.props.history.push(`/home/academy/class/situation/backMoneyAdd/${this.state.id}`, {id: this.state.id,type: 2, data: this.state.data});
    }

    //返回按钮
    back(){
        debugger
        this.props.history.goBack();
    }

    render() {

        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                    &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
                    <p className="d-inline text-muted">{this.state.data.stuName}</p>
                    <div className="btn-group float-right" role="group">
                        <div className="btn-group float-right" role="group">
                            <button onClick={this.back.bind(this)} type="button" className="btn btn-light">返回
                            </button>
                        </div>
                    </div>
                    <Commands
                        commands={this.commands}
                        modAction={this.modAction}
                    />
                </h5>
                <div className="row justify-content-md-center">
                    <div className="col col-12">
                        <div className="card">
                            <div className="card-body">
                                <div className="row">
                                    <div className="col">
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">学员姓名</label>
                                            <div className="col-7">
                                                <input type="text" className="form-control-plaintext" name="stuName"
                                                       readOnly={true} value={this.state.data.stuName ? this.state.data.stuName : ""}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>学员编号
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control-plaintext" name="stuCode"
                                                       readOnly={true} value={this.state.data.stuCode ? this.state.data.stuCode : ""}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>学员状态
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control-plaintext" name="classStatusName"
                                                       readOnly={true} value={this.state.data.classStatusName}/>
                                            </div>
                                        </div>
                                        {
                                            this.state.data && this.state.data.type == 1 ?
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">
                                                        <em className="text-danger">*</em>退费额度
                                                    </label>
                                                    <div className="col-7">
                                                        <input type="text" className="form-control-plaintext" name="amount"
                                                               readOnly={true} value={this.state.data.amount}/>
                                                    </div>
                                                </div>
                                                : null
                                        }
                                        {
                                            this.state.data && this.state.data.type == 3 ?
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">
                                                        <em className="text-danger">*</em>转入班级名称
                                                    </label>
                                                    <div className="col-7">
                                                        <input type="text" className="form-control-plaintext" name="inClassId"
                                                               required={true}  value={this.state.data.inClassCode}/>
                                                    </div>
                                                </div>
                                                : null
                                        }
                                        {
                                            this.state.data && this.state.data.type == 3 ?
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">
                                                        <em className="text-danger">*</em>转入班级教师
                                                    </label>
                                                    <div className="col-7">
                                                        <input type="text" className="form-control-plaintext" name="inMainTeacherName"
                                                               required={true} value={this.state.data.inMainTeacherName}/>
                                                    </div>
                                                </div>
                                                : null
                                        }
                                        {
                                            this.state.data && this.state.data.type == 3 ?
                                                <div className="form-group row">
                                                    <label className="col-5 col-form-label font-weight-bold">
                                                        <em className="text-danger">*</em>转入班级已消耗课时
                                                    </label>
                                                    <div className="col-7">
                                                        <input type="text" className="form-control-plaintext" name="inUseCourseHour"
                                                               required={true}  value={this.state.data.inUseCourseHour}/>
                                                    </div>
                                                </div>
                                                : null
                                        }
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">异动状态</label>
                                            <div className="col-7">
                                                <input type="text" className="form-control-plaintext" name="situationStatus"
                                                       required={true} value={this.state.data.situationStatus}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">异动原因</label>
                                            <div className="col-7">
                                                <input type="text" className="form-control-plaintext" name="reason"
                                                       required={true} value={this.state.data.reason}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>班级名称
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control-plaintext" name="classCode"
                                                       readOnly={true} value={this.state.data.classCode}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>班级教师
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control-plaintext" name="mainTeacherName"
                                                       readOnly={true}  value={this.state.data.mainTeacherName}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>总课时
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control-plaintext"
                                                       name="classHour"readOnly={true}  value={this.state.data.classHour}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>已消耗课时
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control-plaintext" name="useCourseHour" value={this.state.data.useCourseHour} />
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>剩余课时
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control-plaintext" name="noUseCourseHour"
                                                       readOnly={true}  value={this.state.data.noUseCourseHour}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>家长姓名
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control-plaintext" name="parentName"
                                                       readOnly={true}  value={this.state.data.parentName}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>与学员关系
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control-plaintext" name="relation"
                                                       readOnly={true}  value={this.state.data.relation}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">联系方式</label>
                                            <div className="col-7">
                                                <input type="text" className="form-control-plaintext" name="cellphone"  value={this.state.data.cellphone} readOnly/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col">

                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>申报人
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control-plaintext" name="applyPerson"
                                                       readOnly={true}  value={this.state.data.applyPerson}/>
                                            </div>
                                        </div>
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                <em className="text-danger">*</em>申报时间
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control-plaintext" name="applyTime"
                                                       readOnly={true}  value={this.state.data.applyTime}/>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default StudentSituation;