import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'
import {$} from "../../vendor";

import DialogTips from "../Dialog/DialogTips";
import Commands from "../Commands/Commands";
import Progress from "../Progress/Progress"

import mainSize from "../../utils/mainSize";
import fmtDate, {formatWithTime} from '../../utils/fmtDate';
import fmtTitle from '../../utils/fmtTitle';
import ajax, {AJAX_PATH} from "../../utils/ajax";
import {Button, Table, Pagination, Upload, Input, Tooltip, Select, Message, Checkbox} from 'element-react';
import '../Mkt/Leads/Leads.css'
import ajaxFile from "../../utils/ajaxFile";
import DialogUser from "../Dialog/DialogUser";
import {changeArrayItemToString} from "../../utils/objectToArray";

class List extends React.Component {
    constructor(props) {
        super(props);
        let storage = window.sessionStorage;

        this.title = fmtTitle(this.props.pathName);
        this.state = {
            group: this.props.group,
            list: [],
            ids: [],
            chooseRows: [],
            isAnimating: true,
            redirectToReferrer: false,
            columns: [
                {
                    type: 'selection',
                    width: 20,
                },
                {
                    // label: "序号",
                    type: 'index',
                    fixed: 'left',
                },
                {
                    label: "学员姓名",
                    prop: "student.name",
                    sortable: true,
                    width: 100,
                    fixed: 'left',
                    render: (row, column, data)=>{
                        if(row.student){
                            return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this,row.student.id)}>{row.student.name}</Button></span>
                        }else{
                            return <span></span>
                        }
                    }
                },
                {
                    label: "性别",
                    prop: "student.genderText",
                    sortable: true
                },
                {
                    label: "年龄",
                    prop: "student.age",
                    sortable: true
                },
                {
                    label: "在读年级",
                    prop: "student.classGrade",
                    sortable: true,
                    width: 100
                },
                {
                    label: "所在学校",
                    prop: "student.schoolName",
                    sortable: true,
                    width: 120
                },
                {
                    label: "家长姓名",
                    prop: "parent.name",
                    sortable: true,
                    width: 100,
                    render: (row, column, data)=>{
                        if(row.student){
                            return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this,row.student.id)}>{row.parent ? row.parent.name : null}</Button></span>
                        }else{
                            return <span></span>
                        }
                    }
                },
                {
                    label: "与学员关系",
                    prop: "parent.relation",
                    sortable: true,
                    width: 120
                },
                {
                    label: "电话号码",
                    prop: "parent.cellphone",
                    sortable: true,
                    width: 130,
                },
                {
                    label: "微信号",
                    prop: "parent.weichat",
                    sortable: true,
                    width: 100,
                },
                {
                    label: "家庭住址",
                    prop: "parent.address",
                    sortable: true,
                    width: 120,
                    className:'tabletd',
                    render: function (data) {
                        return <Tooltip effect="dark" content={data.parent ? data.parent.address : null}
                                        placement="top-start">
                            {data.parent ? data.parent.address : null}
                        </Tooltip>
                    }
                },
                {
                    label: "课程类别",
                    prop: "courseType",
                    sortable: true,
                    width: 100,
                },
                {
                    label: "课程阶段",
                    prop: "courseName",
                    sortable: true,
                    width: 100,
                    className:'tabletd',
                    render: function (data) {
                        return <Tooltip effect="dark" content={data.courseName}
                                        placement="top-start">
                            {data.courseName}
                        </Tooltip>
                    }
                },
                {
                    label: "所属组织",
                    prop: "organizationName",
                    sortable: true,
                    width: 175,
                },
                {
                    label: "所属用户",
                    prop: "executiveName",
                    sortable: true,
                    width: 100,
                },
                {
                    label: "创建人",
                    prop: "creatorName",
                    sortable: true,
                    width: 100,
                },
                {
                    label: "创建时间",
                    prop: "createTime",
                    sortable: true,
                    width: 150,
                },
                {
                    label: "转移时间",
                    prop: "transTime",
                    sortable: true,
                    width: 150,
                },
                {
                    label: "转化时间",
                    prop: "assignTime",
                    sortable: true,
                    width: 150,
                },

            ],
            columnsShort: [
                {
                    type: 'selection',
                    width: 20,
                },
                {
                    // label: "序号",
                    type: 'index',
                    fixed: 'left',
                },
                {
                    label: "学员姓名",
                    prop: "student.name",
                    sortable: true,
                    width: 130,
                    fixed: 'left',
                    render: (row, column, data)=>{
                        if(row.student){
                            return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this,row.student.id)}>{row.student.name}</Button></span>
                        }else{
                            return <span></span>
                        }
                    }
                },
                {
                    label: "性别",
                    prop: "student.genderText",
                    sortable: true
                },
                {
                    label: "年龄",
                    prop: "student.age",
                    sortable: true
                },
                {
                    label: "在读年级",
                    prop: "student.classGrade",
                    sortable: true,
                    width: 100
                },
                {
                    label: "所在学校",
                    prop: "student.schoolName",
                    sortable: true,
                    width: 120
                },
                {
                    label: "家长姓名",
                    prop: "parent.name",
                    sortable: true,
                    width: 100,
                    render: (row, column, data)=>{
                        if(row.student){
                            return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this,row.student.id)}>{row.parent ? row.parent.name : null}</Button></span>
                        }else{
                            return <span></span>
                        }
                    }
                },
                {
                    label: "与学员关系",
                    prop: "parent.relation",
                    sortable: true,
                    width: 120
                },
                {
                    label: "电话号码",
                    prop: "parent.cellphone",
                    sortable: true,
                    width: 130,
                },
                {
                    label: "微信号",
                    prop: "parent.weichat",
                    sortable: true,
                    width: 100,
                },
                {
                    label: "家庭住址",
                    prop: "parent.address",
                    sortable: true,
                    width: 120,
                    className:'tabletd',
                    render: function (data) {
                        return <Tooltip effect="dark" content={data.parent ? data.parent.address : null}
                                        placement="top-start">
                            {data.parent ? data.parent.address : null}
                        </Tooltip>
                    }
                },
                {
                    label: "课程类别",
                    prop: "courseType",
                    sortable: true,
                    width: 100,
                },
                {
                    label: "创建人",
                    prop: "creatorName",
                    sortable: true,
                    width: 100,
                },
                {
                    label: "创建时间",
                    prop: "createTime",
                    sortable: true,
                    width: 150,
                },

            ],
            totalPage:0,
            currentPage:storage.getItem("opporCurrentPage") ? Number(storage.getItem("opporCurrentPage")) : 1,
            pageSize:storage.getItem("pageSize") ? Number(storage.getItem("pageSize")) : 10,
            totalCount:0,
            stageName:[],
            chooseStageName:storage.getItem("chooseStageName") ? storage.getItem("chooseStageName") : '',
            statusName:[],
            chooseStatusName:storage.getItem("chooseStatusName") ? Number(storage.getItem("chooseStatusName")) : '',
            cellphone:storage.getItem("cellphone") ? storage.getItem("cellphone") : '',
            advisorList:[],
            chooseAdvisorName:storage.getItem("chooseOpporAdvisorName") ? storage.getItem("chooseOpporAdvisorName") : '',
            showType: 1, //1显示所有信息   2是显示汇总分组信息
            typeId: this.props.typeId, //机会2
            fromWay: this.props.fromWay, //机会3
            courseTypeList:[],
            courseTypeId: null, //课程类别筛选条件
            isIn: this.props.isIn
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.chooseStageSearch = this.chooseStageSearch.bind(this);
        this.chooseStatusSearch = this.chooseStatusSearch.bind(this);
        this.chooseAdvisorSearch = this.chooseAdvisorSearch.bind(this);
        this.goToDetails = this.goToDetails.bind(this);

    }

    componentDidMount() {
        this.changeShowType(2);
        // this.loadData();
        this.loadFilter();
        mainSize()
    }
    //加载列表数据
    loadData(){
        const request = async () => {
            try {
                if(this.state.showType == 1){
                    //不分组  显示线索信息
                    let list = await ajax('/sales/oppor/list.do', {orgId: this.state.group.id, typeId: this.state.typeId,fromWay: this.state.fromWay,
                        pageNum:this.state.currentPage,pageSize:this.state.pageSize,cellphone:this.state.cellphone,
                        isIn: this.state.isIn,
                        stageId:this.state.chooseStageName,statusId:this.state.chooseStatusName,
                        chooseAdvisorName:this.state.chooseAdvisorName,courseTypeId:this.state.courseTypeId});
                    const ids = list.data.map((leads) => (leads.id));
                    list.data.map(item => {
                        if(item.createTime != null){
                            item.createTime = formatWithTime(item.createTime);
                        }
                        if(item.transTime != null){
                            item.transTime = formatWithTime(item.transTime);
                        }
                        if(item.assignTime != null){
                            item.assignTime = formatWithTime(item.assignTime);
                        }
                    });
                    this.setState({list: list.data, ids: ids,totalPage: list.totalPage,
                        totalCount: list.count});
                }else{
                    //分组  显示学员信息
                    let list = await ajax('/service/visitor/commonList.do', {orgId: this.state.group.id, typeId: this.state.typeId,fromWay: this.state.fromWay,
                        pageNum:this.state.currentPage,pageSize:this.state.pageSize,cellphone:this.state.cellphone,
                        isIn: this.state.isIn,
                        stageId:this.state.chooseStageName,statusId:this.state.chooseStatusName,
                        chooseAdvisorName:this.state.chooseAdvisorName,courseTypeId:this.state.courseTypeId});
                    const ids = list.data.map((leads) => (leads.id));
                    list.data.map(item => {
                        if(item.createTime != null){
                            item.createTime = formatWithTime(item.createTime);
                        }
                        if(item.transTime != null){
                            item.transTime = formatWithTime(item.transTime);
                        }
                        if(item.assignTime != null){
                            item.assignTime = formatWithTime(item.assignTime);
                        }
                    });
                    this.setState({list: list.data, ids: ids,totalPage: list.totalPage,
                        totalCount: list.count});
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
    //改变状态
    chooseStatusSearch(chooseStatusName){
        // debugger;
        this.state.chooseStatusName = chooseStatusName;
        window.sessionStorage.setItem("chooseStatusName",chooseStatusName);
        this.state.currentPage = 1;
        this.loadData();
    }
    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.group.id != this.props.group.id){
            this.state.group = nextProps.group;
            this.loadData();
        }
        return true;
    }
    //加载下拉列表
    loadFilter(){
        const request = async () => {
            try {
                let status = await ajax('/mkt/leads/status/list.do', {typeId: this.state.typeId});
                let stage = await ajax('/mkt/leads/stage/list.do', {typeId: this.state.typeId});
                let advisorList = await ajax('/user/listUserByRole.do',{orgId:this.state.group.id,type:1});
                let courseTypeList = await ajax('/course/type/courseTypeList.do');
                this.setState({stageName:stage,
                    statusName:status,advisorList:advisorList,courseTypeList:courseTypeList}); //,courseTypeId:courseTypeList[0].id
                if(courseTypeList && courseTypeList.length > 0){
                    // this.state.courseTypeId=courseTypeList[0].id;
                    this.loadData();
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

    goToDetails(data){
        if (this.props.accept) {
            this.props.accept(data);
        }
    }

    pageChange(currentPage){
        console.log(currentPage);
        this.state.currentPage = currentPage;
        window.sessionStorage.setItem("opporCurrentPage",currentPage);
        // this.setState({currentPage:currentPage});
        this.loadData();
    }

    sizeChange(pageSize){
        console.log(pageSize);
        this.state.pageSize = pageSize;
        window.sessionStorage.setItem("pageSize",pageSize);
        this.loadData();
    }

    onChange(key, value) {
        this.setState({
            cellphone: value
        });
        window.sessionStorage.setItem("cellphone",value);
    }

    chooseStageSearch(chooseStageName){
        this.state.chooseStageName = chooseStageName;
        window.sessionStorage.setItem("chooseStageName",chooseStageName);
        this.state.currentPage = 1;
        this.loadData();
    }
    chooseStatusSearch(chooseStatusName){
        // debugger;
        this.state.chooseStatusName = chooseStatusName;
        window.sessionStorage.setItem("chooseStatusName",chooseStatusName);
        this.state.currentPage = 1;
        this.loadData();
    }
    chooseAdvisorSearch(chooseAdvisorName){
        // debugger;
        this.state.chooseAdvisorName = chooseAdvisorName;
        window.sessionStorage.setItem("chooseOpporAdvisorName",chooseAdvisorName);
        this.state.currentPage = 1;
        this.loadData();
    }
    /**
     * 列表选择
     * @param value
     */
    selectRow(value) {
        this.props.selectRow(value);
    }

    //选择显示那个
    changeShowType(type){
        this.setState({showType:type});
        if(type == 1){
            $("#shortTwo1").show();
            $("#shortOne1").show();

            $("#shortTwo2").hide();
            $("#shortOne2").hide();
        }else{
            $("#shortTwo1").hide();
            $("#shortOne1").hide();

            $("#shortTwo2").show();
            $("#shortOne2").show();
        }
    }
    //处理课程类别
    handleType(value){
        // if(value && value.length > 1){
        //     this.state.showType = 2;
        //     this.changeShowType(2,value);
        // }else{
        //     let courseTypeId=null;
        //     this.state.showType = 1;
        //     if(value.length == 1){
        //         this.state.courseTypeList.map(item => {
        //             if(item.name == value[0]){
        //                 courseTypeId = item.id;
        //             }
        //         });
        //     }
        //     this.state.courseTypeId = courseTypeId;
        //     this.state.currentPage = 1;
        //     this.changeShowType(1);
        //     this.loadData();
        // }
        if(value && value.length >= 1){
            let ids = [];
            this.state.courseTypeList.map(item => {
                value.map(name => {
                    if(item.name == name){
                        ids.push(item.id);
                    }
                });
            });
            this.state.courseTypeId = changeArrayItemToString(ids);
            this.loadData();
        }
    }

    render() {
        return (
            <div id="main" className="main p-3">
                <Progress isAnimating={this.state.isAnimating}/>
                <div className="row">
                    <Checkbox.Group value={this.state.checkList} onChange={this.handleType.bind(this)}>
                        {
                            this.state.courseTypeList.map(function(item){
                                return  <Checkbox label={item.name}></Checkbox>
                            })
                        }
                    </Checkbox.Group>
                </div>
                <div className="row" id="shortOne1">
                    <Input placeholder="请输入手机号/学员姓名"
                           className={"leadlist_search"}
                           value={this.state.cellphone}
                           style={{width: '20%'}}
                           onChange={this.onChange.bind(this, 'cellphone')}
                           append={<Button type="primary" icon="search" onClick={this.loadData.bind(this)}>搜索</Button>}
                    />
                    <Select value={this.state.chooseStageName} placeholder="请选择阶段" clearable={true} onChange={this.chooseStageSearch} className={"leftMargin"}>
                        {
                            this.state.stageName.map(el => {
                                return <Select.Option key={el.id} label={el.name} value={el.id} />
                            })
                        }
                    </Select>
                    <Select value={this.state.chooseStatusName} placeholder="请选择状态" clearable={true} onChange={this.chooseStatusSearch} className={"leftMargin"}>
                        {
                            this.state.statusName.map(el => {
                                return <Select.Option key={el.id} label={el.name} value={el.id} />
                            })
                        }
                    </Select>
                    <Select value={this.state.chooseAdvisorName} placeholder="请选择所属用户" clearable={true} onChange={this.chooseAdvisorSearch} className={"leftMargin"}>
                        {
                            this.state.advisorList ? this.state.advisorList.map(el => {
                                return <Select.Option key={el.cId} label={el.cRealName} value={el.cId} />
                            }) : null
                        }
                    </Select>
                </div>
                <div className="row" id="shortTwo1">
                    {/*<Table list={this.state.list} goto={this.goToDetails}/>*/}
                    <Table
                        style={{width: '100%',height:'500px',"margin-bottom":"30px"}}
                        columns={this.state.columns}
                        data={this.state.list}
                        border={true}
                        fit={true}
                        emptyText={"--"}
                        height='80%'
                        onSelectChange={(selection) => this.selectRow(selection) }
                    />
                    <Pagination layout="total, sizes, prev, pager, next, jumper"
                                total={this.state.totalCount}
                                pageSizes={[10, 50, 100]}
                                pageSize={this.state.pageSize}
                                currentPage={this.state.currentPage}
                                pageCount={this.state.totalPage}
                                className={"leadlist_page page_bottom"}
                                onCurrentChange={(currentPage) => this.pageChange(currentPage)}
                                onSizeChange={(pageSize) => this.sizeChange(pageSize)}/>
                </div>

                <div className="row" id="shortOne2">
                    <Input placeholder="请输入手机号/学员姓名"
                           className={"leadlist_search"}
                           value={this.state.cellphone}
                           style={{width: '20%'}}
                           onChange={this.onChange.bind(this, 'cellphone')}
                           append={<Button type="primary" icon="search" onClick={this.loadData.bind(this)}>搜索</Button>}
                    />
                    <div className="col-2">
                        <Select value={this.state.chooseStatusName} placeholder="请选择状态" clearable={true} onChange={this.chooseStatusSearch}>
                            {
                                this.state.statusName.map(el => {
                                    return <Select.Option key={el.id} label={el.name} value={el.id}/>
                                })
                            }
                        </Select>
                    </div>
                </div>
                <div className="row" id="shortTwo2">
                    <Table
                        style={{width: '100%',height:'500px',"margin-bottom":"30px"}}
                        columns={this.state.columnsShort}
                        data={this.state.list}
                        border={true}
                        fit={true}
                        emptyText={"--"}
                        height='80%'
                        onSelectChange={(selection) => this.selectRow(selection) }
                    />
                    <Pagination layout="total, sizes, prev, pager, next, jumper"
                                total={this.state.totalCount}
                                pageSizes={[10, 50, 100]}
                                pageSize={this.state.pageSize}
                                currentPage={this.state.currentPage}
                                pageCount={this.state.totalPage}
                                className={"leadlist_page page_bottom"}
                                onCurrentChange={(currentPage) => this.pageChange(currentPage)}
                                onSizeChange={(pageSize) => this.sizeChange(pageSize)}/>
                </div>
            </div>
        )
    }
}

export default List;