import ReactDOM from "react-dom";
import React from "react";
import permissionsProcess from "../../../utils/permissionsProcess";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import {Redirect} from "react-router-dom";
import Progress from "../../Progress/Progress";
import DialogTips from "../../Dialog/DialogTips";
import CONFIG from "../../../utils/config";
import fmtDate from "../../../utils/fmtDate";
import {Table, Button, MessageBox, Message, Tabs, Input, DatePicker, Select} from "element-react";
import DialogCourse from "../../Dialog/DialogCourse";
import historyBack from "../../../utils/historyBack";

class CustomerService extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isAnimating: false,

            groupId: this.props.changedCrmGroup.groupId,
            groupName: this.props.changedCrmGroup.groupName,
            courseTypes: [],
            courseList: [],
            selectedCou: null,
            selectedCouText: null,
            selectedCourse: null,
            moneyList: [],
            oneAmount: null,
            oneDate : null,
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.refreshCourse = this.refreshCourse.bind(this);
        // this.addCourseType = this.addCourseType.bind(this);
        // this.addCourseTypeReq = this.addCourseTypeReq.bind(this);
        this.changeCourse = this.changeCourse.bind(this);
        this.changeCourseType = this.changeCourseType.bind(this);
        this.changeInput = this.changeInput.bind(this);
        this.addPayItem = this.addPayItem.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/course/type/courseTypeList.do');
                let selectedCou = null, selectedCouText = null;
                if(list && list.length > 0) {
                    selectedCou = list[0].id;
                    selectedCouText = list[0].name;
                }
                if (this.props.isEditor) {
                    //修改
                    let data = await ajax('/course/type/query.do', {id: this.props.editorId});
                    data = data.data;
                    this.setState({courseTypes: list, selectedCou:data.courseTypeId, selectedCouText:data.courseType});
                    this.refreshCourse(data.courseTypeId,data.id);
                }else{
                    //新增
                    this.setState({courseTypes: list, selectedCou, selectedCouText});
                    this.refreshCourse(selectedCou);
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
        request();
        mainSize()
    }

    componentWillUnmount() {
        if (this.tipsContainer) {
            document.body.removeChild(this.tipsContainer);
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


    refreshCourse(selectedCou,chooseCourseId){
        const request = async () => {
            try {
                let list = await ajax('/course/type/listAll.do', {orgId: this.state.groupId,courseType: selectedCou});
                if(list.data && list.data.items){
                    const ids = list.data.items.map((contract) => (contract.id));
                    this.setState({courseList: list.data && list.data.items ? list.data.items : null,
                        ids: ids,totalPage: list.data.totalPage,totalCount: list.data.count,selectedCourse:chooseCourseId});
                    if(chooseCourseId){
                        this.changeCourse(chooseCourseId);
                    }
                }else{
                    this.setState({courseList: []});
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
        request();
    }

    changeCourseType(evt){
        this.state.courseTypes.map(item =>{
            if(item.id == evt){
                this.refreshCourse(evt);
                this.setState({selectedCou:Number(evt),selectedCouText:item.name});
                return ;
            }
        })

    }

    changeCourse(chooseCourseId){
        this.state.courseList.map(item => {
            if(item.id == chooseCourseId){
                let data = item;
                let moneyList = [];
                if(data.fields){
                    data.fields.map(item => {
                        item.clsName = "cls"+item.periodNum;
                    })
                    moneyList = data.fields;
                }

                this.setState({
                    data: data,
                    classHour: data.classHour,
                    classTime: data.classTime,
                    time: data.time,
                    price: data.price,
                    amount: data.amount,
                    moneyList: moneyList
                }, () => {
                    moneyList.map(item =>{
                        // item.clsName = "cls"+((!moneyList && moneyList.length == 0) ? 2 : (moneyList.length + 1) + 1);
                        this.form[item.clsName].value = item.amount ? item.amount : 0;
                    })
                });
            }
        });
    }

    changeInput(key, evt) {
        this.setState({
            [key] : evt.target.value}
        )
    }

    //添加付费信息Item
    addPayItem(){
        let moneyList = this.state.moneyList;
        let size = (!moneyList && moneyList.length == 0) ? 2 : (moneyList.length + 1) + 1;
        moneyList.push({"contractTime":size,"time":null,"amount":null,"clsName":"cls"+size});
        this.setState({moneyList:moneyList});
    }

    getFormValue() {
        let query = {};
        query.id = this.state.data.id;
        this.state.moneyList.map(item => {
            item.amount = this.form[item.clsName].value;
        });
        query.fields = this.state.moneyList;
        query.price = this.form["price"].value;
        query.amount = this.form["amount"].value;

        return query;
    }

    render() {
        if (this.state.redirectToReferrer) {
            return (
                <Redirect to={{
                    pathname: '/login',
                    state: {from: this.props.location}
                }}/>
            )
        }
        
        return (
            <form ref={(dom) => {
                this.form = dom
            }}>
                <div className="row">
                    <div className="col">
                        <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">
                                <em className="text-danger">*</em>课程类别
                            </label>
                            <div className="col-7">
                                <Select value={this.state.selectedCou} placeholder="请选择"  disabled={this.props.isEditor} onChange={this.changeCourseType.bind(this)}>
                                    {
                                        this.state.courseTypes.map(el => {
                                            return <Select.Option key={el.id} label={el.name} value={el.id} />
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">
                                <em className="text-danger">*</em>课程阶段
                            </label>
                            <div className="col-7">
                                <Select value={this.state.selectedCourse} placeholder="请选择" onChange={this.changeCourse} disabled={this.props.isEditor}>
                                    {
                                        this.state.courseList.map(el => {
                                            return <Select.Option key={el.id} label={el.name} value={el.id} />
                                        })
                                    }
                                </Select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">
                                <em className="text-danger">*</em>总课时
                            </label>
                            <div className="col-7">
                                <input type="text" className="form-control" name="classHour" value={this.state.classHour}
                                       readOnly={true}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">
                                <em className="text-danger">*</em>总课次
                            </label>
                            <div className="col-7">
                                <input type="text" className="form-control" name="classTime" value={this.state.classTime}
                                       readOnly={true}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">
                                <em className="text-danger">*</em>时长(min)
                            </label>
                            <div className="col-7">
                                <input type="number" className="form-control" name="time" value={this.state.time}
                                       readOnly={true}/>
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">
                                <em className="text-danger">*</em>单课时费
                            </label>
                            <div className="col-7">
                                <input type="text" className="form-control" name="price"  value={this.state.price} onChange={this.changeInput.bind(this, "price")}
                                       required={true}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">
                                <em className="text-danger">*</em>总课时费
                            </label>
                            <div className="col-7">
                                <input type="text" className="form-control" name="amount"  value={this.state.amount} onChange={this.changeInput.bind(this, "amount")}
                                       required={true}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <div className="col-2">
                                <label className="col-form-label font-weight-bold">
                                    期数
                                </label>
                            </div>
                            <div className="col-3 col-offset-2">
                                <label className="col-form-label font-weight-bold">
                                    课时数
                                </label>
                            </div>
                            <div className="col-3">
                                <label className="col-form-label font-weight-bold">
                                    金额
                                </label>
                            </div>
                        </div>
                        {this.state.moneyList ? this.state.moneyList.map(function (evt) {
                            return <div className="form-group row">
                                <div className="col-2">
                                    <label className="col-form-label font-weight-bold">
                                        <em className="text-danger">*</em>{evt.periodNum}期：
                                    </label>
                                </div>
                                <div className="col-3 col-offset-2">
                                    <div className="form-group">
                                        <div className="form-group row">
                                            <input type="text" className="form-control" name="oneClassHour"
                                                   placeholder="请输入金额" readOnly={true} value={evt.classHour}/>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className="form-group row">
                                        <input type="text" className="form-control" name={evt.clsName}
                                               placeholder="请输入金额" required={true} />
                                    </div>
                                </div>
                            </div>
                        }) : null
                        }
                    </div>
                </div>
            </form>
        )
    }
}

export default CustomerService;