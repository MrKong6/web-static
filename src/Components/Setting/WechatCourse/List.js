import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax, {ajaxGet} from "../../../utils/ajax";
import '../../Mkt/Leads/Leads.css'
import { Button,Table,Pagination,Upload,Input,Tooltip } from 'element-react';
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
        this.refreshCourse = this.refreshCourse.bind(this);
        this.addCourseTypeReq = this.addCourseTypeReq.bind(this);
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
                    label: "年级",
                    prop: "typeName",
                    sortable: true,
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
                /*{
                    label: "来源",
                    prop: "sourceActivityName",
                    sortable: true
                },
                {
                    label: "码类别",
                    prop: "sourceActivityType",
                },
                {
                    label: "访问IP",
                    prop: "visitIp",
                },
                {
                    label: "访客标识码",
                    prop: "visitCert",
                },
                {
                    label: "注册手机号",
                    prop: "visitPhone",
                }*/
            ],
            totalPage:0,
            currentPage:1,
            pageSize:10,
            totalCount:0,
            courseTypes: [],
            courseList: [],
        };
    }

    componentDidMount() {
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
                }
                debugger
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
        mainSize()
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
        this.props.history.push(`${this.props.match.url}/create`, {ids: this.state.ids});
    }

    /**
     * 新增客户类别
     */
    addCourseType(typeName){
        if(typeName == 2){
            this.props.history.push(`${this.props.match.url}/create`, {selectedCou: this.state.selectedCou,
                selectedCouText: this.state.selectedCouText});
        }else{
            this.userContainer = document.createElement('div');
            ReactDOM.render(
                <DialogWechatCourse
                    accept={this.addCourseTypeReq}
                    container={this.userContainer}
                    typeName={typeName}
                    selectedCou={this.state.selectedCou}
                    groupId={this.state.groupId}
                    groupName={this.state.groupName}
                    replace={this.props.history.replace}
                    from={this.props.location}
                    ref={(dom) => {
                        this.user = dom
                    }}
                />,
                document.body.appendChild(this.userContainer)
            );
            this.user.dialog.modal('show');
        }
    }
    addCourseTypeReq(selected){
        const request = async () => {
            try {
                await ajax('/wechat/addCourse.do', {orgId: this.state ? this.state.groupId : null, name:selected.courseTypeName,
                    typeId:selected.typeId,logoUrl: selected.logoUrl,listUrl: selected.listUrl});
                this.componentDidMount();
            } catch (err) {
            }
        };
        request();
    }

    //改变课程类别
    changeCourse(evt){
        this.state.selectedCou = evt.target.getAttribute("rid");
        this.refreshCourse(evt.target.getAttribute("rid"));
        this.setState({selectedCou:Number(evt.target.getAttribute("rid")),selectedCouText:evt.target.textContent});
    }

    //刷新课程列表
    refreshCourse(selectedCou){
        const request = async (selectedCou) => {
            try {
                let list = await ajaxGet('/wechat/getCouerseList.do', {orgId: this.state.group.id,pageNum:this.state.currentPage,
                    pageSize:this.state.pageSize,type:2,parentId: selectedCou ? selectedCou : this.state.selectedCou});

                if(list.data && list.data.items){
                    const ids = list.data.items.map((contract) => (contract.id));
                    this.setState({list: list.data && list.data.items ? list.data.items : null,
                        ids: ids,totalPage: list.data.totalPage,totalCount: list.data.count});
                }else{
                    this.setState({list: []});
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
                    <div className="row">
                        <div className="col-7">
                            <Button type="text" onClick={this.addCourseType.bind(this,1)}>新增课程类别</Button>
                        </div>
                        <div className="col-5">
                            <Button type="text" onClick={this.addCourseType.bind(this,2)}>新增课程</Button>
                        </div>
                    </div>
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
                        <div className="col-12 col-lg-5 col-xl-6">
                            <p className={'h6 pb-3 mb-0'}>{this.state.selectedCouText || ''}</p>
                            <Table
                                style={{width: '100%'}}
                                columns={this.state.columns}
                                data={this.state.list}
                                border={true}
                                fit={true}
                                emptyText={"--"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default List;