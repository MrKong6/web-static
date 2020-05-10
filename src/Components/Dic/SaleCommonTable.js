import React from 'react'
import ReactDOM from "react-dom";

import DialogTips from "../Dialog/DialogTips";
import {Table, Tree} from "element-react";
import ajax from "../../utils/ajax";
import fmtDate from "../../utils/fmtDate";

class ActHouver extends React.Component {
    constructor(props) {
        super(props);

        let storage = window.sessionStorage;
        this.state = {
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
                        return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this, row.id)}>{row.student.name}</Button></span>
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
                        return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this, row.id)}>{row.parent ? row.parent.name : null}</Button></span>
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
                    label: "课程产品",
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
            list: [],
            totalPage:0,
            currentPage:storage.getItem("opporCurrentPage") ? Number(storage.getItem("opporCurrentPage")) : 1,
            pageSize:storage.getItem("pageSize") ? Number(storage.getItem("pageSize")) : 10,
            totalCount:0,
        }
    }

    componentDidMount() {
        this.refreshMarketType();
    }

    //刷新表格数据
    refreshMarketType(parentId){
        const request = async () => {
            try {
                let list = await ajax('/mkt/activity/getMarketType.do', {orgId: this.props.parent.state.group.id, parentId:parentId});
                this.setState({marketTypes: list})
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
    //加载活动数据
    loadActivity() {
        const request = async () => {
            try {
                let list = await ajax('/mkt/activity/list.do', {
                    organizationId: this.props.parent.state.group.id,
                    typeId: this.state.checkId ? this.state.checkId : 0
                });
                const ids = list.map((act) => (act.id));
                list.map(item => {
                    if (item.createTime != null) {
                        item.createTime = fmtDate(item.createTime);
                    }
                    if (item.startDate != null) {
                        item.startDate = fmtDate(item.startDate);
                    }
                    if (item.endDate != null) {
                        item.endDate = fmtDate(item.endDate);
                    }
                });
                this.setState({list: list, ids: ids});
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
    //加载节点下的数据
    loadNode(node, resolve) {
        this.setState({checkId: node.id, checkName: node.name});
        //第一级
        if (node.level === 0) {
            if(this.state.marketTypes.length > 0){
                return resolve(this.state.marketTypes);
            }else{
                return ;
            }
        }
        //超过5级返空
        if (node.level > 5) return resolve([]);

        const request = async () => {
            try {
                let list = await ajax('/mkt/activity/getMarketType.do', {
                    orgId: this.props.parent.state.group.id,
                    parentId: node.data.id
                });
                return resolve(list);
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
    //刷新活动数据
    handleCheckChange(data, node) {
        console.log(data, node);
        this.setState({checkId: data.id, checkName: data.name, checkRootId: data.rootId ? data.rootId : data.id});
        this.state.checkId = data.id;
        this.loadActivity();
        // if(checked){
        //     this.setState({checkId: data.id,checkName: data.name,checkRootId:data.rootId ? data.rootId : data.id});
        // }else{
        //     this.setState({checkId: null,checkName: null,checkRootId:null});
        // }
    }

    //选中活动
    checkAct(item) {
        this.props.parent.checkAct(item);
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


    render() {

        return (
            <div>
                <p>请选择具体渠道：</p>
                <div className="row">
                    <Table
                        style={{width: '100%',"margin-bottom":"30px"}}
                        columns={this.state.columns}
                        data={this.state.list}
                        border={true}
                        fit={true}
                        emptyText={"--"}
                        height='80%'
                    />
                </div>
            </div>
        )
    }
}

export default ActHouver;