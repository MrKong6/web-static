import React from 'react'
import historyBack from "../../../utils/historyBack";
import fmtTitle from "../../../utils/fmtTitle";
import CONFIG from "../../../utils/config";
import fmtDate from "../../../utils/fmtDate";
import ajax from "../../../utils/ajax";
import calculateAge from "../../../utils/calculateAge";


class StudentSituationChangeClassAdd extends React.Component {
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
            classList:[]
        };
        this.changeStu = this.changeStu.bind(this);
        this.changeClass = this.changeClass.bind(this);

    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/service/customer/student/classStuList.do', {
                    orgId: this.state.group.id, pageNum: this.state.currentPage,
                    pageSize: this.state.pageSize, id: this.state.id, needParent: 1,needStuBalance:1
                });
                let classList = await ajax('/academy/class/getClassShortList.do', {
                    orgId: this.state.group.id
                });
                let classData = await ajax('/academy/class/query.do', {id: this.state.id});
                list.data.map(item => {
                    if (item.idType != null) {
                        item.idType = CONFIG.DOCUMENT[item.idType];
                    }
                    if (item.birthday != null) {
                        item.age = calculateAge(fmtDate(item.birthday));
                        item.birthday = fmtDate(item.birthday);
                    }
                });
                debugger
                console.log(list.data);
                this.setState({list: list.data, totalPage: list.totalPage, totalCount: list.count,classList:classList.data},()=>{
                    //学生信息
                    if(list.data != null && list.data.length > 0){
                        let dataOne = list.data[0];
                        this.form["id"].value = dataOne.id;
                        this.form["code"].value = dataOne.code;
                        this.form["classStatusName"].value = dataOne.classStatusName;
                        this.form["amount"].value = dataOne.accountBalance ? dataOne.accountBalance : 0;
                        if(dataOne.parent){
                            this.form["parentName"].value = dataOne.parent.name;
                            this.form["relation"].value = dataOne.parent.relation;
                            this.form["cellphone"].value = dataOne.parent.cellphone;
                        }
                        this.form["createBy"].value = this.props.profile.cRealname;
                        this.form["createOn"].value = fmtDate(new Date());
                    }
                    //班级信息
                    if(classData != null && classData.data != null){
                        classData = classData.data;
                        this.form["noUseCourseHour"].value = classData.noUseCourseHour ? classData.noUseCourseHour : "";
                        this.form["useCourseHour"].value = classData.useCourseHour ? classData.useCourseHour : "";
                        this.form["classCode"].value = classData.code;
                        this.form["mainTeacherName"].value = classData.mainTeacherName;
                    }
                    //转入班级下拉列表
                    if(classList && classList.data && classList.data.length > 0){
                        let classData = classList.data[0];
                        this.form["inUseCourseHour"].value = classData.useCourseHour ? classData.useCourseHour : "";
                        this.form["inId"].value = classData.id ? classData.id :"";
                        this.form["inMainTeacherName"].value = classData.mainTeacherName;
                    }
                });
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    this.createDialogTips(`${err.errCode}: ${err.errText}`);
                }
            }
        };
        request();
    }
    //切换班级
    changeClass(evt){

        if(evt.target.value && this.state.classList){
            this.state.classList.map(item => {
                if(item.id == evt.target.value){
                    let classData = item;
                    this.form["inUseCourseHour"].value = classData.useCourseHour ? classData.useCourseHour : "";
                    this.form["inId"].value = classData.id ? classData.id :"";
                    this.form["inMainTeacherName"].value = classData.mainTeacherName;
                    return ;
                }
            });
        }
    }
//切换学生
    changeStu(evt){
        if(evt.target.value && this.state.list){
            this.state.list.map(item => {
                if(item.id == evt.target.value){
                    let dataOne = item;
                    this.form["id"].value = dataOne.id;
                    this.form["code"].value = dataOne.code;
                    this.form["classStatusName"].value = dataOne.classStatusName;
                    this.form["amount"].value = dataOne.accountBalance ? dataOne.accountBalance : 0;
                    if(dataOne.parent){
                        this.form["parentName"].value = dataOne.parent.name;
                        this.form["relation"].value = dataOne.parent.relation;
                        this.form["cellphone"].value = dataOne.parent.cellphone;
                    }
                    this.form["createBy"].value = this.props.profile.cRealname;
                    this.form["createOn"].value = fmtDate(new Date());
                    return ;
                }
            });
        }
    }

    render() {
        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                    &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
                    <p className="d-inline text-muted">转班信息创建</p>
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
                                                <label className="col-5 col-form-label font-weight-bold">请选择学生</label>
                                                <div className="col-7">
                                                    <select className="form-control"
                                                            name={this.props.id || "id"} onChange={this.changeStu}>
                                                        {
                                                            this.state.list ? this.state.list.map(item => (
                                                                <option key={item.id}
                                                                        value={item.id}>{item.name}</option>
                                                            )) : null
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>学员编号
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="code"
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
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>转入班级名称
                                                </label>
                                                <div className="col-7">
                                                    <select className="form-control"
                                                            name={this.props.inId || "inId"} onChange={this.changeClass}>
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
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>转入时间
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="inMainTeacherName"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>转入班级教师
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="inMainTeacherName"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>转入班级已消耗课时
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="inUseCourseHour"
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">转班原因</label>
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
                                                    <input type="text" className="form-control" name="classCode"
                                                           readOnly={true}/>
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
                                                    <input type="text" className="form-control" name="createBy"
                                                           readOnly={true}/>
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <label className="col-5 col-form-label font-weight-bold">
                                                    <em className="text-danger">*</em>申报时间
                                                </label>
                                                <div className="col-7">
                                                    <input type="text" className="form-control" name="createOn"
                                                           readOnly={true}/>
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

export default StudentSituationChangeClassAdd;