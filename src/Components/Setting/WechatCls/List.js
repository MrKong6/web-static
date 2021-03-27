import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax, {ajaxGet, IMG_URL} from "../../../utils/ajax";
import '../../Mkt/Leads/Leads.css'
import {Button, Table, Pagination, Upload, Input, Tooltip, Message} from 'element-react';
import CONFIG from "../../../utils/config";
import fmtDate, {formatWithTime} from "../../../utils/fmtDate";
import Commands from "../../Commands/Commands";
import './WechatCls.css'

class List extends React.Component {
    constructor(props) {
        super(props);
        this.commands = this.props.commands.filter((command) => (command.name === 'Add' || command.name === 'ShowNormal'));
        this.title = fmtTitle(this.props.location.pathname);
        this.goToDetails = this.goToDetails.bind(this);
        this.addAction = this.addAction.bind(this);
        this.changeCourse = this.changeCourse.bind(this);
        this.changeCourseTwo = this.changeCourseTwo.bind(this);
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
                    label: "班级名称",
                    prop: "clsname",
                    sortable: true,
                    render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this, row.id)}>{row.clsname}</Button></span>
                    }
                },
                {
                    label: "年级",
                    prop: "typeName",
                    sortable: true,
                },
                {
                    label: "课程类别",
                    prop: "courseTypeName",
                    showOverflowTooltip: true,
                },
                {
                    label: "课程阶段",
                    prop: "courseStageName",
                    sortable: true,
                },
                {
                    label: "详情头图",
                    prop: "indexUrl",
                    sortable: true,
                    render: (row, column, data) => {
                        return  <img src={row.indexUrl} alt="" width="80px" height="80px" style={{"marginLeft":"10px"}} />
                    }
                },
                {
                    label: "详情图片",
                    prop: "imgUrl",
                    sortable: true,
                    render: (row, column, data) => {
                        return  <img src={row.imgUrl} alt="" width="80px" height="80px" style={{"marginLeft":"10px"}} />
                    }
                },
            ],
            totalPage:0,
            currentPage:1,
            pageSize:10,
            totalCount:0,
            chooseObj:{},
        };
    }

    componentDidMount() {
        this.refreashCourseType();
        this.refreashCourseStage();
        this.refreshCls();
        mainSize()
    }

    //刷新班级信息
    refreshCls(){
        const request = async () => {
            try {
                let list = await ajax('/wechat/getClsList.do', {orgId: this.state.group.id,
                    pageNum:this.state.currentPage,pageSize:this.state.pageSize,"courseTypeId":this.state.selectedCou,
                "courseStageId":this.state.selectedCouTwo});
                if(list.data && list.data.items){
                    const ids = list.data.items.map((contract) => (contract.id));
                    list.data.items.map(item => {
                        if(item.time != null){
                            item.time = formatWithTime(item.time);
                        }
                        item.imgUrl = IMG_URL + item.imgUrl;
                        item.indexUrl = IMG_URL + item.indexUrl;
                    });
                    this.setState({list: list.data && list.data.items ? list.data.items : null, ids: ids,totalPage: list.data.totalPage,totalCount: list.data.count});

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

    //刷新课程类别列表
    refreashCourseType() {
        const request = async () => {
            try {
                let listTwo = await ajaxGet('/wechat/getCouerseList.do', {orgId: this.state.group.id,
                    pageNum:1,pageSize:9999,type:1});
                let datas = [];
                if(listTwo.data && listTwo.data.items){
                    datas = listTwo.data.items;
                    datas.map(item => {
                        item.logoUrl = IMG_URL + item.logoUrl;
                        item.listUrl = IMG_URL + item.listUrl;
                    });
                }
                this.setState({courseTypes: datas});

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
                let listTwo = await ajaxGet('/wechat/getCouerseList.do', {orgId: this.state.group.id,pageNum:1,
                    pageSize:9999,type:2,parentId: this.state.selectedCou});
                let datas = [];
                if(listTwo.data && listTwo.data.items){
                    datas = listTwo.data.items;
                    datas.map(item => {
                        item.logoUrl = IMG_URL + item.logoUrl;
                        item.listUrl = IMG_URL + item.listUrl;
                    });
                }
                this.setState({courseList: datas});
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
        const url = `${this.props.match.url}/${evt}`;

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
        if(this.state.chooseObj && this.state.chooseObj.id){
            this.props.history.push(`${this.props.match.url}/create`, {obj: this.state.chooseObj});
        }else{
            Message({
                type: 'warning',
                message: '请先选择课程类别和课程阶段!'
            });
        }
    }

    //改变课程类别
    changeCourse(evt){
        this.state.selectedCou = evt.target.getAttribute("rid");
        this.componentDidMount();
        this.setState({selectedCou:Number(evt.target.getAttribute("rid")),selectedCouText:evt.target.textContent});
    }

    //改变课程阶段
    changeCourseTwo(evt){
        this.state.selectedCouTwo = evt.target.getAttribute("rid");
        let chooseObj = null;
        this.state.courseList.map(item => {
            if(item.id == this.state.selectedCouTwo){
                chooseObj = item;
            }
        });
        this.componentDidMount();
        this.setState({selectedCouTwo:Number(evt.target.getAttribute("rid")),selectedCouTwoText:evt.target.textContent,chooseObj});
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
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>&nbsp;{this.title.text}
                   
                </h5>
                <div id="main" className="main p-3">
                <div className=" ">
                    <Commands
                        commands={this.commands}
                        addAction={this.addAction}
                    />
                    </div>

                    <div className="row">
                        <div className="col-2 col-lg-2 eli ">
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
                        <div className="col-2 col-lg-2 eli">
                            {
                                this.state.courseList ? this.state.courseList.map((cou) => (
                                    <p
                                        key={cou.id}
                                        rid={cou.id}
                                        className={`${this.state.selectedCouTwo === cou.id ? 'text-light bg-primary' : 'text-dark'} m-0 p-1`}
                                        onClick={this.changeCourseTwo}
                                    >
                                        {cou.name}
                                    </p>
                                )) : null
                            }
                        </div>
                        <div className="col-8 col-lg-8 col-xl-8 elick">
                            <Table
                                style={{width: '100%'}}
                                columns={this.state.columns}
                                data={this.state.list}
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
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default List;