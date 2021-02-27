import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'

import fmtTitle from "../../../utils/fmtTitle";
import fmtDate from "../../../utils/fmtDate";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import DialogAccount from "../../Dialog/DialogAccount";
import {Button, DatePicker, Dialog, Form, Input, Message, Select, Table} from "element-react";
import DialogAccountRelateClass from "../../Dialog/DialogAccountRelateClass";
import DialogAccountTwo from "../../Dialog/DialogAccountTwo";
import {$} from "../../../vendor";

const NextBtn = ({id, ids}) => {
    const curIndex = ids.indexOf(id);

    if ((curIndex + 1) === ids.length) {
        return <button type="button" className="btn btn-light" disabled={true}>下一条</button>
    }

    return (
        <Link
            className="btn btn-light"
            to={{
                pathname: `/home/service/customer/contract/${ids[curIndex + 1]}`,
                state: {ids: ids}
            }}
        >
            下一条
        </Link>
    )
};

const PrevBtn = ({id, ids}) => {
    const curIndex = ids.indexOf(id);

    if (curIndex === 0) {
        return <button type="button" className="btn btn-light" disabled={true}>上一条</button>
    }

    return (
        <Link
            className="btn btn-light"
            to={{
                pathname: `/home/service/customer/contract/${ids[curIndex - 1]}`,
                state: {ids: ids}
            }}
        >
            上一条
        </Link>
    )
};

const INCOME="充值";

class AccountView extends React.Component {
    constructor(props) {
        super(props);
        this.title = fmtTitle(this.props.location.pathname);
        let type = 1;
        if(this.props.location.state && this.props.location.state.type && this.props.location.state.type == 2){
            //从教学的我的班级的学员信息页面跳转而来
            type = this.props.location.state.type;
            this.commands = [];
            this.first = 'normal';
            this.second = 'normal';
            this.third = 'normal';
            this.fourth = 'normal';
            this.fifth = 'normal';
            this.sixth = 'normal'
            this.seventh = 'normal';
        }else{
            this.commands = this.props.commands ? this.props.commands.filter(command => (command.id === '3-2-1-2' || command.id === '3-2-1-3')) : [];
            if(this.props.sonView){
                this.first = !(this.props.sonView.filter(view => (view.id == '3-2-1')) == false) ? 'normal' : 'none';
                this.second = !(this.props.sonView.filter(view => (view.id == '3-2-2')) == false) ? 'normal' : 'none';
                this.third = !(this.props.sonView.filter(view => (view.id == '3-2-3')) == false) ? 'normal' : 'none';
                this.fourth = !(this.props.sonView.filter(view => (view.id == '3-2-4')) == false) ? 'normal' : 'none';
                this.fifth = !(this.props.sonView.filter(view => (view.id == '3-2-5')) == false) ? 'normal' : 'none';
                this.sixth = !(this.props.sonView.filter(view => (view.id == '3-2-6')) == false) ? 'normal' : 'none'
                this.seventh = this.props.sonView && !(this.props.sonView.filter(view => (view.id == '3-2-7')) == false) ? 'normal' : 'none';
            }
        }

        this.createAccountDialog = this.createAccountDialog.bind(this);
        let that = this;
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            id: this.props.match.params.studentId ? this.props.match.params.studentId : this.props.match.params.contractId,
            ids: [],
            name: this.props.location.state["stuName"],
            columns: [
                {
                    type: 'expand',
                    expandPannel: function(data){
                        if(data.outCode == 'CLASS_FEE' && data.sonList && data.sonList.length > 0){
                            return (
                                    <table className="table table-bordered table-sm noBorder tableWidth">
                                        <tr>
                                            <th>项目</th>
                                            <th>序号</th>
                                            <th>日期</th>
                                            <th>摘要</th>
                                            <th>收入</th>
                                            <th>支出</th>
                                            <th>余额</th>
                                            <th>操作</th>
                                        </tr>
                                        <tbody>
                                            {
                                                data.sonList.map(function (evt) {
                                                    return <tr key={evt.id}>
                                                                <td style={{"border": 0, "borderTop": "hidden"}}>{evt.proName}</td>
                                                                <td style={{"border": 0, "borderLeft": "1px solid black"}}>{evt.no}</td>
                                                                <td style={{"border": 0}}>{evt.payDate}</td>
                                                                <td style={{"border": 0}}>{evt.remark}</td>
                                                                <td style={{"border": 0}}>{evt.income}</td>
                                                                <td style={{"border": 0}}>{evt.outcome}</td>{/*¥*/}
                                                                <td style={{"border": 0, "borderRight": "1px solid black"}}>{evt.afterBalance}</td>
                                                                <td style={{"border": 0}}>
                                                                    {
                                                                        evt.remark && evt.remark.indexOf('异动') != -1 ? <Button type="primary" size="small" onClick={that.createAccountDialog.bind(this,data,1)}>支出</Button> : ''
                                                                    }
                                                                </td>
                                                            </tr>
                                                })
                                            }
                                        </tbody>
                                    </table>


                            )
                        }else{
                            return (
                                <div>暂无信息</div>
                            )
                        }
                    }
                },
                {
                    label: "项目",
                    prop: "proName",
                    width: 150
                },
                {
                    label: "序号",
                    prop: "no",
                    width: 160
                },
                {
                    label: "日期",
                    prop: "payDate"
                },
                {
                    label: "摘要",
                    prop: "remark"
                },
                {
                    label: "收入",
                    prop: "income"
                },
                {
                    label: "支出",
                    prop: "outcome"
                },
                {
                    label: "余额",
                    prop: "afterBalance"
                },
                {
                    label: "操作",
                    prop: "operate",
                    render: (row, column, data)=>{
                        if(row.outCode == 'CLASS_FEE'){
                            if(row.classId){
                                return <span><Button type="primary" size="small" onClick={this.createCourseHourDialog.bind(this,row)}>关联班级</Button></span>
                            }else{
                                return <span><Button type="danger" size="small" onClick={this.createCourseHourDialog.bind(this,row)}>关联班级</Button></span>
                            }
                        }else if(row.income && row.income > 0){
                            //汇款记录  需要有支出按钮
                            return <span><Button type="primary" size="small" onClick={this.createAccountDialog.bind(this,row,null)}>支出</Button></span>
                        }
                    }
                }
            ],
            data: [],
            type: type,
            payTypes:[], //支出款项类型
            showDialog: false, //显示支出类型
            accountType: 2, //1收入   2支出
            situation: null,//为空表示正常支出   不为空表示异动支出
            contractList: [],
            payDate: null,
            contractId: null,
            contractNumId: null,

        };
        this.createCourseHourDialog= this.createCourseHourDialog.bind(this);
        this.refresh = this.refresh.bind(this);
        this.refreshOutCome = this.refreshOutCome.bind(this);
        this.confirmAdd = this.confirmAdd.bind(this);
        this.cancel = this.cancel.bind(this)
    }

    componentDidMount() {
        this.refresh();
        mainSize();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.changedCrmGroup !== nextProps.changedCrmGroup) {
            this.setState({redirectToList: true})
        }
    }

    componentWillUnmount() {
        if (this.tipsContainer) {
            document.body.removeChild(this.tipsContainer);
        }
    }

    /**
     * 充值和支出弹框
     * @param row  子账户揭露
     * @param situation
     * @param egt
     * @param data
     */
    createAccountDialog(row,situation,egt) {
        debugger
        if(egt.target.innerText == INCOME){
            this.refreshInCome();
            this.setState({showIncomeDialog: true,accountType:1,situation:situation});
        }else{
            //支出款项类型
            this.refreshOutCome();
            this.setState({showDialog: true,outRow: row,accountType:2,situation:situation});
        }
    }

    //支出款项类型
    refreshOutCome() {
        //清空表单数据
        const request = async () => {
            try {
                let data = await ajax('/service/account/getDictionariesByCode.do', {code: 'PAY_OUT_TYPE'});
                // let contractList = await ajax('/service/contract/queryListByStudentId.do', {id: this.state.id,needReciecedAmount:1});
                if(data != null){
                    this.setState({payTypes:data}, () => {
                        for (let i = 0; i < this.form.length; i++) {
                            this.form[i].value = null;
                        }
                        this.form["remark"].value = "";
                        /*if(contractList.length > 0){
                            this.form["income"].value = contractList[0].thisAmount;
                        }*/
                    });
                }
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {

                }
            } finally {
                this.setState({isAnimating: false});
            }
        };
        request();
    }
    //收入款项类型
    refreshInCome(){
        const request = async () => {
            try {
                let data = await ajax('/service/account/getDictionariesByCode.do', {code: 'PAY_OUT_TYPE'});
                let contractList = await ajax('/service/contract/getContractListByStuId.do', {id: this.state.id,needReciecedAmount:1});
                if(data != null){
                    this.setState({payTypes:data,contractList:contractList}, () => {
                        for (let i = 0; i < this.form2.length; i++) {
                            this.form2[i].value = null;
                        }
                        this.form2["remark"].value = "";
                        if(contractList.length > 0){
                            this.form2["income"].value = contractList[0].thisAmount;
                        }
                    });
                }
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {

                }
            } finally {
                this.setState({isAnimating: false});
            }
        };
        request();
    }
    //更改合同期数
    chooseContract(value){
        let conId = null,numId = null;
        if(value){
            this.state.contractList.map(item => {
                if(item.id == value){
                    this.form2["income"].value = item.thisAmount;
                    conId = item.contractId;
                    numId = item.id;
                }
            });
        }else{
            this.form2["income"].value = null;
        }
        this.setState({contractId:conId,contractNumId:numId});
    }

    createCourseHourDialog(data) {
        this.actContainer = document.createElement('div');
        ReactDOM.render(
            <DialogAccountRelateClass
                accept={this.acceptActDialog}
                changedCrmGroup={this.state.group}
                notRoot={true}
                id={this.state.id}
                mainAccountId={data.id}
                row={data}
                totalFee={(data.sonList && data.sonList.length >= 1 ? data.sonList[0].afterBalance : 0)}
                defaults={this.state.channelId}
                replace={this.props.replace}
                from={this.props.from}
                ref={(dom) => {
                    this.act = dom
                }}
            />,
            document.body.appendChild(this.actContainer)
        );
        this.act.dialog.modal('show');
    }

    refresh(){
        const request = async () => {
            try {
                let data = await ajax('/service/account/list.do', {stuId: this.state.id});
                let name = this.state.name;
                if(data && data.data.items){
                    data = data.data.items;
                    let idx = 1;
                    let sonIdx = 1;
                    if(data.length > 0){
                        name = data[0].stuName;
                    }
                    data.map(item => {
                        if(item.payDate){
                            item.no = idx++;
                            item.payDate = new Date(item.payDate).format("yyyy-MM-dd");
                        }
                        sonIdx = 1;
                        if(item.sonList && item.sonList.length > 0){
                            item.sonList.map(son => {
                                son.no = sonIdx++;
                                son.payDate = new Date(son.payDate).format("yyyy-MM-dd");
                            });
                        }
                    });
                    this.setState({data,name});
                }
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    // this.createDialogTips(`${err.errCode}: ${err.errText}`);
                }
            }
        };
        request();
    }

    //更改支出方式
    changeOutType(evt){
        debugger
        let outRow = this.state.outRow;
        if(outRow){
            this.state.payTypes.map(item => {
                if(item.id == evt.target.value){
                    if(item.code == 'CLASS_FEE'){
                        this.form["outcome"].value = outRow.income ? outRow.income : 0 - (outRow.bookFee ? outRow.bookFee : 0) - (outRow.otherFee ? outRow.otherFee : 0);
                    }else if(item.code == 'BOOK_FEE'){
                        this.form["outcome"].value = outRow.bookFee ? outRow.bookFee : 0;
                    }else if(item.code == 'OTHER_FEE'){
                        this.form["outcome"].value = outRow.otherFee ? outRow.otherFee : 0;
                    }
                }
            })
        }
    }

    //保存支出数据  1支出   2充值
    confirmAdd(type){
        if(type == 1){
            const request = async () => {
                try {
                    let query = {};
                    for (let i = 0; i < this.form.length; i++) {
                        if (this.form[i].name) {
                            if (this.form[i].name) {
                                query[this.form[i].name] = this.form[i].value;
                            }
                        }
                    }
                    query.payDate = (this.state.payDate ? this.state.payDate : new Date()).getTime();
                    query.stuId = this.state.id;
                    query.accountType = this.state.accountType;
                    query.contractNumId = this.state.outRow.contractNumId;
                    if(query.accountType == 1){
                        query.outcome = null;
                    }else{
                        query.income = null;
                    }
                    query.contractId = this.state.outRow.contractId;

                    //不为空则表示异动支出  即为主账户充值
                    if(this.state.situation){
                        query.income = query.outcome;
                        query.outcome = null;
                        query.outType = 4;
                        query.accountType = 1;
                    }
                    let resp = await ajax('/service/account/add.do', query);
                    this.setState({}, () => {
                        for (let i = 0; i < this.form.length; i++) {
                            this.form[i].value = null;
                        }
                        this.form["remark"].value = "";
                    });
                    if(resp.code == '200'){
                        this.cancel(1);
                        Message({
                            message: "添加成功",
                            type: 'success'
                        });
                    }else{
                        this.cancel(1);
                        Message({
                            message: resp.detail,
                            type: 'error'
                        });
                    }
                } catch (err) {
                    if (err.errCode === 401) {
                        this.setState({redirectToReferrer: true})
                    } else {

                    }
                } finally {
                    this.setState({isAnimating: false});
                }
            };
            request();
        }else{
            const request = async () => {
                try {
                    let query = {};
                    for (let i = 0; i < this.form2.length; i++) {
                        if (this.form2[i].name) {
                            if (this.form2[i].name) {
                                query[this.form2[i].name] = this.form2[i].value;
                            }
                        }
                    }
                    query.payDate = (this.state.payDate ? this.state.payDate : new Date()).getTime();
                    query.stuId = this.state.id;
                    query.accountType = this.state.accountType;
                    query.contractNumId = this.state.contractNumId;
                    if(query.accountType == 1){
                        query.outcome = null;
                    }else{
                        query.income = null;
                    }
                    query.contractId = this.state.contractId;

                    //不为空则表示异动支出  即为主账户充值
                    if(this.state.situation){
                        query.income = query.outcome;
                        query.outcome = null;
                        query.outType = 4;
                        query.accountType = 1;
                    }
                    let resp = await ajax('/service/account/add.do', query);
                    this.setState({}, () => {
                        for (let i = 0; i < this.form2.length; i++) {
                            this.form2[i].value = null;
                        }
                        this.form2["remark"].value = "";
                    });
                    if(resp.code == '200'){
                        this.cancel(2);
                        Message({
                            message: "添加成功",
                            type: 'success'
                        });
                    }else{
                        this.cancel(2);
                        Message({
                            message: resp.detail,
                            type: 'error'
                        });
                    }
                } catch (err) {
                    if (err.errCode === 401) {
                        this.setState({redirectToReferrer: true})
                    } else {

                    }
                } finally {
                    this.setState({isAnimating: false});
                }
            };
            request();
        }

    }
    //关闭支出弹框
    cancel(type){
        if(type == 1){
            this.setState({showDialog: false});
        }else{
            this.setState({showIncomeDialog: false});
        }
        this.refresh();
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

        if (this.state.redirectToList) {
            return (
                <Redirect to="/home/service/customer"/>
            )
        }

        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
                    &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
                    <p className="d-inline text-muted">{this.state.name}</p>

                    {/*<div className="btn-group float-right ml-4" role="group">
                        <PrevBtn id={this.state.id} ids={this.state.ids}/>
                        <NextBtn id={this.state.id} ids={this.state.ids}/>
                    </div>*/}
                    <div className="btn-group float-right ml-4" role="group" style={{"display":this.fourth}}>
                        {
                            this.state.type == 2 ? null :
                                <button onClick={this.createAccountDialog.bind(this,null,null)} className="btn btn-primary" type="button">
                                    充值
                                </button>
                        }
                        {/*<button onClick={this.createAccountDialog} className="btn btn-primary" type="button">
                            支出
                        </button>*/}
                        <button onClick={() => {
                            this.props.history.goBack();
                        }} type="button" className="btn btn-light">返回
                        </button>
                    </div>

                </h5>

                <div id="main" className="main p-3" style={{"height":"80%"}}>
                    <div className="row justify-content-md-center mb-2">
                        <div className="col col-12">
                            <div className="card border-top-0">
                                <div className="card-body">
                                    <p className="ht pb-3 b-b">账户信息</p>
                                    <Table
                                        style={{width: '80%'}}
                                        columns={this.state.columns}
                                        data={this.state.data}
                                        border={false}
                                        onCurrentChange={item=>{console.log(item)}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb location_bottom">
                            <li className="breadcrumb-item"style={{"display":this.first}}>
                                <Link
                                    to={{pathname: `/home/service/customer/student/${this.state.id}`,
                                        state: {stuName: this.state.name,type: this.state.type}}}>学员信息
                                </Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.second}}>
                                <Link to={{
                                    pathname: `/home/service/customer/parent/${this.state.id}`,
                                    state: {stuName: this.state.name,type: this.state.type}
                                }}>家长信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.third}}>
                                <Link to={{
                                    pathname: `/home/service/customer/contract/${this.state.id}`,
                                    state: {stuName: this.state.name,type: this.state.type}
                                }}>合同信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.fourth}}>
                                账户信息
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.sixth}}>
                                <Link to={{
                                    pathname: `/home/service/customer/class/${this.state.id}`,
                                    state: {stuName: this.state.name,type: this.state.type}
                                }}>班级信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.fifth}}>
                                <Link to={{
                                    pathname: `/home/service/customer/situation/${this.state.id}`,
                                    state: {stuName: this.state.name,type: this.state.type}
                                }}>异动信息</Link>
                            </li>
                            <li className="breadcrumb-item" style={{"display":this.seventh}}>
                                <Link to={{
                                    pathname: `/home/service/customer/charge/${this.state.id}`,
                                    state: {stuName: this.state.name,type: this.state.type}
                                }}>卡券信息</Link>
                            </li>
                        </ol>
                    </nav>
                    {/*支出*/}
                    <Dialog
                        title="支出"
                        size="tiny"
                        closeOnClickModal={false}
                        visible={ this.state.showDialog }
                        onCancel={ this.cancel.bind(this,1) }
                    >
                        <Dialog.Body>
                            <div className="form-group row contact" id="addView">
                                <form ref={(dom) => {
                                    this.form = dom
                                }} labelWidth="120" style={{"width":"80%"}}>
                                    <div className="form-group row">
                                        <label className="col-5 col-form-label">款项操作</label>
                                        <div className="col-7">
                                            <select className="form-control" name={"outType"} onChange={this.changeOutType.bind(this)}>
                                                {/*<option key='1' value='1'>课时费</option>
                                                <option key='2' value='2'>资料费</option>
                                                <option key='3' value='3'>其他费用</option>*/}
                                                {
                                                    this.state.payTypes ? this.state.payTypes.map(item => (
                                                        <option key={item.id}
                                                                value={item.id}>{item.name}</option>
                                                    )) : null
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-5 col-form-label">金额</label>
                                        <div className="col-7">
                                            <Input placeholder="请输入金额" name={"outcome"} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-5 col-form-label font-weight-bold">
                                            <em className="text-danger">*</em>付款日期
                                        </label>
                                        <div className="col-7">
                                            <DatePicker
                                                name="createTime"
                                                value={this.state.payDate}
                                                isShowTime={true}
                                                placeholder="选择日期"
                                                format="yyyy-MM-dd HH:mm"
                                                onChange={date => {
                                                    console.debug('DatePicker1 changed: ', date)
                                                    this.setState({payDate: date})
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-5 col-form-label font-weight-bold">
                                            <em className="text-danger">*</em>摘要
                                        </label>
                                        <div className="input-group col-7">
                                            <Input placeholder="请输入摘要" name={"remark"} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-5 col-form-label font-weight-bold">
                                            <em className="text-danger">*</em>备注
                                        </label>
                                        <div className="col-7">
                                            <Input placeholder="请输入备注" name={"comment"}  />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </Dialog.Body>

                        <Dialog.Footer className="dialog-footer">
                            <Button onClick={ this.cancel.bind(this, 1) }>取 消</Button>
                            <Button type="primary" onClick={this.confirmAdd.bind(this,1)}>确 定</Button>
                        </Dialog.Footer>
                    </Dialog>

                    {/*充值*/}
                    <Dialog
                        title="款项操作"
                        size="tiny"
                        closeOnClickModal={false}
                        visible={ this.state.showIncomeDialog }
                        onCancel={ this.cancel.bind(this) }
                    >
                        <Dialog.Body>
                            <div className="form-group row contact">
                                <form ref={(dom) => {
                                    this.form2 = dom
                                }} encType='multipart/form-data'>
                                    <div className="form-group row">
                                        <label className="col-5 col-form-label">请选择合同编号</label>
                                        <div className="col-7">
                                            <Select name="teacherId" placeholder="请选择"
                                                    filterable={true} clearable={true} style={{"width":"100%"}}
                                                    onChange={this.chooseContract.bind(this)}>
                                                {
                                                    this.state.contractList ? this.state.contractList.map(el => {
                                                        return <Select.Option key={el.id} label={el.contractCode} value={el.id}>
                                                            <span style={{float: 'left'}}>{el.contractCode}</span>
                                                            <span style={{float: 'right', color: '#8492a6', fontSize: 13}}>{el.periodNum + '期'}</span>
                                                        </Select.Option>
                                                    }) : null
                                                }
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-5 col-form-label">金额</label>
                                        <div className="col-7">
                                            <Input placeholder="请输入金额" name={"income"} disabled={true} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-5 col-form-label">付款日期</label>
                                        <div className="col-7">
                                            <DatePicker
                                                name="createTime"
                                                value={this.state.payDate}
                                                isShowTime={true}
                                                placeholder="选择日期"
                                                format="yyyy-MM-dd HH:mm"
                                                onChange={date => {
                                                    console.debug('DatePicker1 changed: ', date)
                                                    this.setState({payDate: date})
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-5 col-form-label">摘要</label>
                                        <div className="col-7">
                                            <Input placeholder="请输入摘要" name={"remark"} />
                                        </div>
                                    </div>
                                    <div className="form-group row">
                                        <label className="col-5 col-form-label">备注</label>
                                        <div className="col-7">
                                            <Input placeholder="请输入备注" name={"comment"}  />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </Dialog.Body>
                        <Dialog.Footer className="dialog-footer">
                            <Button onClick={ this.cancel.bind(this, 2) }>取 消</Button>
                            <Button type="primary" onClick={this.confirmAdd.bind(this,2)}>确 定</Button>
                        </Dialog.Footer>
                    </Dialog>

                </div>
            </div>
        )
    }

}

export default AccountView;