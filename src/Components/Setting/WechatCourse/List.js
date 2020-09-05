import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax, {ajaxGet, IMG_URL} from "../../../utils/ajax";
import '../../Mkt/Leads/Leads.css'
import {Button, Table, Pagination, Upload, Input, Tooltip, Tabs} from 'element-react';
import CONFIG from "../../../utils/config";
import fmtDate, {formatWithTime} from "../../../utils/fmtDate";
import Commands from "../../Commands/Commands";
import DialogCourse from "../../Dialog/DialogCourse";
import DialogWechatCourse from "../../Dialog/DialogWechatCourse";

class List extends React.Component {
    constructor(props) {
        super(props);
        this.commands = this.props.commands.filter((command) => (command.name === 'Add' || command.name === 'ShowNormal'));
        this.title = fmtTitle(this.props.location.pathname);
        this.goToDetails = this.goToDetails.bind(this);
        this.addAction = this.addAction.bind(this);
        this.changeCourse = this.changeCourse.bind(this);
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            isAnimating: true,
            redirectToReferrer: false,
            columns: [
                {
                    type: 'index'
                },
                {
                    label: "课程类别",
                    prop: "name",
                    showOverflowTooltip: true,
                    render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this, row.id)}>{row.name}</Button></span>
                    }
                },
                {
                    label: "目录缩略图",
                    prop: "logoUrl",
                    sortable: true,
                    render: (row, column, data) => {
                        return <img src={row.logoUrl} alt="" width="80px" height="80px" style={{"marginLeft":"10px"}} />
                    }
                },
                {
                    label: "列表头图",
                    prop: "listUrl",
                    sortable: true,
                    render: (row, column, data) => {
                        return  <img src={row.listUrl} alt="" width="80px" height="80px" style={{"marginLeft":"10px"}} />
                    }
                },
            ],
            columnStages: [
                {
                    type: 'index'
                },

                {
                    label: "课程类别",
                    prop: "parentName",
                    showOverflowTooltip: true,
                },
                {
                    label: "课程阶段",
                    prop: "name",
                    sortable: true,
                    render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this, row.id)}>{row.name}</Button></span>
                    }
                },
                {
                    label: "阶段图标",
                    prop: "logoUrl",
                    sortable: true,
                    render: (row, column, data) => {
                        return  <img src={row.logoUrl} alt="" width="80px" height="80px" style={{"marginLeft":"10px"}} />
                    }
                },
                {
                    label: "年级",
                    prop: "typeName",
                    sortable: true,
                },
            ],
            totalPage:0,
            currentPage:1,
            pageSize:10,
            totalCount:0,
            courseTypes: [],
            courseList: [],
            defaultNum:1
        };
    }

    componentDidMount() {
        if(this.state.defaultNum== 1){
            this.refreashCourseType();
        }else{
            this.refreashCourseStage();
        }
        mainSize()
    }
    //刷新课程类别列表
    refreashCourseType() {
        const request = async () => {
            try {
                let listTwo = await ajaxGet('/wechat/getCouerseList.do', {orgId: this.state.group.id,pageNum:this.state.currentPage,pageSize:this.state.pageSize,type:1});
                let datas = [];
                if(listTwo.data && listTwo.data.items){
                    datas = listTwo.data.items;
                    datas.map(item => {
                        item.logoUrl = IMG_URL + item.logoUrl;
                        item.listUrl = IMG_URL + item.listUrl;
                    });
                }
                this.setState({courseList: datas, totalPage: listTwo.data.totalPage,totalCount: listTwo.data.count});

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

    //刷新课程阶段
    refreashCourseStage(){
        const request = async () => {
            try {
                let list = await ajaxGet('/wechat/getCouerseList.do', {orgId: this.state.group.id,pageNum:this.state.currentPage,pageSize:this.state.pageSize,type:1});
                if(list.data && list.data.items){
                    list = list.data.items;
                }
                let listTwo = await ajaxGet('/wechat/getCouerseList.do', {orgId: this.state.group.id,pageNum:this.state.currentPage,
                    pageSize:this.state.pageSize,type:2,parentId: this.state.selectedCou});
                let datas = [];
                if(listTwo.data && listTwo.data.items){
                    datas = listTwo.data.items;
                    datas.map(item => {
                        item.logoUrl = IMG_URL + item.logoUrl;
                        item.listUrl = IMG_URL + item.listUrl;
                    });
                }
                this.setState({courseTypes: list,courseList: datas, totalPage: listTwo.data.totalPage,totalCount: listTwo.data.count});
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

    goToDetails(evt) {
        let url = `${this.props.match.url}/type/${evt}`;
        if(this.state.defaultNum== 2){
            url = `${this.props.match.url}/stage/${evt}`;
        }
        this.props.history.push(url);
    }

    pageChange(currentPage){
        console.log(currentPage);
        this.state.currentPage = currentPage;
        // this.setState({currentPage:currentPage});
        this.componentDidMount();
    }

    sizeChange(pageSize){
        console.log(pageSize);
        this.state.pageSize = pageSize;
        this.componentDidMount();
    }

    addAction(){
        let url = `${this.props.match.url}/type/create`;
        if(this.state.defaultNum== 2){
            url = `${this.props.match.url}/stage/create`;
        }
        this.props.history.push(url);
    }

    //改变tabs
    changeTab(type){
        this.state.defaultNum = type.props.name;
        this.setState({defaultNum:type.props.name});
        this.componentDidMount();
    }

    //改变课程类别
    changeCourse(evt){
        this.state.selectedCou = evt.target.getAttribute("rid");
        this.componentDidMount();
        this.setState({selectedCou:Number(evt.target.getAttribute("rid")),selectedCouText:evt.target.textContent});
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
            <div>
                <h5 id="subNav">
                    <i className="fa fa-shield" aria-hidden="true"/>&nbsp;课程管理
                    <Commands
                        commands={this.commands}
                        addAction={this.addAction}
                    />
                </h5>
                <div id="main" className="main p-3">
                    <Progress isAnimating={this.state.isAnimating}/>
                    <Tabs type="card" value="1" onTabClick={this.changeTab.bind(this)}>
                        <Tabs.Pane label="课程类别" name="1">
                            <Table
                                style={{width: '100%'}}
                                columns={this.state.columns}
                                data={this.state.courseList}
                                border={true}
                                fit={true}
                                emptyText={"--"}
                            />
                            <Pagination layout="total, sizes, prev, pager, next, jumper"
                                        total={this.state.totalCount}
                                        pageSizes={[10, 50, 100]}
                                        pageSize={this.state.pageSize}
                                        currentPage={this.state.currentPage}
                                        pageCount={this.state.totalPage}
                                        className={"leadlist_page"}
                                        onCurrentChange={(currentPage) => this.pageChange(currentPage)}
                                        onSizeChange={(pageSize) => this.sizeChange(pageSize)}/>
                        </Tabs.Pane>
                        <Tabs.Pane label="课程阶段" name="2">
                            {/*<Table
                                style={{width: '100%'}}
                                columns={this.state.columns}
                                data={this.state.courseList}
                                border={true}
                                fit={true}
                                emptyText={"--"}
                            />
                            <Pagination layout="total, sizes, prev, pager, next, jumper"
                                        total={this.state.totalCount}
                                        pageSizes={[10, 50, 100]}
                                        pageSize={this.state.pageSize}
                                        currentPage={this.state.currentPage}
                                        pageCount={this.state.totalPage}
                                        className={"leadlist_page"}
                                        onCurrentChange={(currentPage) => this.pageChange(currentPage)}
                                        onSizeChange={(pageSize) => this.sizeChange(pageSize)}/>*/}
                            <div className="row">
                                <div className="col-12 col-lg-2">
                                    {
                                        this.state.courseTypes ? this.state.courseTypes.map((cou) => (
                                            <p
                                                key={cou.id}
                                                rid={cou.id}
                                                className={`${this.state.selectedCou === cou.id ? 'text-light bg-primary' : 'text-dark'} m-0 p-1`}
                                                onClick={this.changeCourse}
                                            >
                                                {cou.name}
                                            </p>
                                        )) : null
                                    }
                                </div>
                                <div className="col-12 col-lg-10 col-xl-10">
                                    <p className={'h6 pb-3 mb-0'}>{this.state.selectedCouText || ''}</p>
                                    <Table
                                        style={{width: '100%'}}
                                        columns={this.state.columnStages}
                                        data={this.state.courseList}
                                        border={true}
                                        fit={true}
                                        emptyText={"--"}
                                    />
                                </div>
                            </div>
                        </Tabs.Pane>
                    </Tabs>

                    {/*<div className="row">
                        <p className={'h6 pb-3 mb-0'}>{this.state.selectedCouText || ''}</p>
                        <Table
                            style={{width: '100%'}}
                            columns={this.state.columns}
                            data={this.state.courseList}
                            border={true}
                            fit={true}
                            emptyText={"--"}
                        />
                        <Pagination layout="total, sizes, prev, pager, next, jumper"
                                    total={this.state.totalCount}
                                    pageSizes={[10, 50, 100]}
                                    pageSize={this.state.pageSize}
                                    currentPage={this.state.currentPage}
                                    pageCount={this.state.totalPage}
                                    className={"leadlist_page"}
                                    onCurrentChange={(currentPage) => this.pageChange(currentPage)}
                                    onSizeChange={(pageSize) => this.sizeChange(pageSize)}/>
                    </div>*/}
                </div>
            </div>
        )
    }
}

export default List;