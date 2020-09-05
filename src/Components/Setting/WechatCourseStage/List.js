import React from "react";
import {Redirect} from 'react-router-dom'
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax, {ajaxGet, IMG_URL} from "../../../utils/ajax";
import '../../Mkt/Leads/Leads.css'
import {Button, Pagination, Table} from 'element-react';
import Commands from "../../Commands/Commands";

class List extends React.Component {
    constructor(props) {
        super(props);
        this.commands = this.props.commands.filter((command) => (command.name == 'Add' || command.name == 'ShowNormal'));
        this.title = fmtTitle(this.props.location.pathname);
        this.goToDetails = this.goToDetails.bind(this);
        this.addAction = this.addAction.bind(this);
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
                {
                    label: "阶段图标",
                    prop: "logoUrl",
                    sortable: true,
                    render: (row, column, data) => {
                        return  <img src={row.logoUrl} alt="" width="80px" height="80px" style={{"marginLeft":"10px"}} />
                    }
                },
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
                let listTwo = await ajaxGet('/wechat/getCouerseList.do', {orgId: this.state.group.id,pageNum:this.state.currentPage,
                    pageSize:this.state.pageSize,type:2,parentId: this.state.selectedCou});
                let datas = [];
                if(listTwo.data && listTwo.data.items){
                    datas = listTwo.data.items;
                    datas.map(item => {
                        item.logoUrl = IMG_URL + item.logoUrl;
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
                    </div>
                </div>
            </div>
        )
    }
}

export default List;