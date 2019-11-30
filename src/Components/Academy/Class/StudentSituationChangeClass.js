import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'
import {Button, Pagination, Table} from 'element-react';

import DialogTips from "../../Dialog/DialogTips";
import Commands from "../../Commands/Commands";

import fmtTitle from "../../../utils/fmtTitle";
import ajax from "../../../utils/ajax";
import mainSize from "../../../utils/mainSize";
import CONFIG from "../../../utils/config";
import calculateAge from "../../../utils/calculateAge";
import fmtDate from "../../../utils/fmtDate";

class StudentSituationChangeClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            id: this.props.id,
            type: this.props.type,
            data: null,
            ids: [],
            columns: [
                {
                    width: 100,
                    sortable: true,
                    type: 'index',
                    fixed: 'left',
                },
                {
                    label: "申报人",
                    prop: "code",
                    width: 120,
                    sortable: true,
                    fixed: 'left',
                },
                {
                    label: "申报时间",
                    prop: "schoolArea",
                    width: 120,
                },
                {
                    label: "异动状态",
                    prop: "classStatusName",
                    width: 95,
                    /*render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this, row.id)}>{row.code}</Button></span>
                    }*/
                },
                {
                    label: "转班原因",
                    prop: "typeName",
                    width: 95
                },
                {
                    label: "学员编号",
                    prop: "rangeName",
                    width: 95
                },
                {
                    label: "学员姓名",
                    prop: "startDate",
                    width: 120
                },
                {
                    label: "学员状态",
                    prop: "endDate",
                    width: 120
                },
                {
                    label: "原班级名称",
                    prop: "planNum",
                    width: 95
                },
                {
                    label: "原班级教师",
                    prop: "factNum",
                    width: 95
                },
                {
                    label: "总课时",
                    prop: "mainTeacherName",
                    width: 95,
                },
                {
                    label: "已消耗课时",
                    prop: "registrar",
                    width: 95,
                },
                {
                    label: "剩余课时",
                    prop: "courseType",
                    width: 95
                },
                {
                    label: "转入时间",
                    prop: "courseRange",
                    width: 100
                },
                {
                    label: "转入班级",
                    prop: "course",
                    width: 100
                },
                {
                    label: "转入教师",
                    prop: "courseStartDate",
                    width: 120
                },
                {
                    label: "转入班消耗课时数",
                    prop: "courseStartDate",
                    width: 120
                },
            ],
        };
    }

    /*componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/service/customer/student/classStuList.do', {
                    orgId: this.state.group.id, pageNum: this.state.currentPage,
                    pageSize: this.state.pageSize, id: this.state.id, needParent: 1
                });
                list.data.map(item => {
                    if (item.idType != null) {
                        item.idType = CONFIG.DOCUMENT[item.idType];
                    }
                    if (item.birthday != null) {
                        item.age = calculateAge(fmtDate(item.birthday));
                        item.birthday = fmtDate(item.birthday);
                    }
                });
                console.log(list.data);
                this.setState({list: list.data, totalPage: list.totalPage, totalCount: list.count});
            } catch (err) {
                // if (err.errCode === 401) {
                //     this.setState({redirectToReferrer: true})
                // } else {
                //     this.createDialogTips(`${err.errCode}: ${err.errText}`);
                // }
            }
        };
        // request();
        // mainSize();
    }*/

    render() {

        return (
            <div>
                <Table
                    style={{width: '100%'}}
                    className="leadlist_search"
                    columns={this.state.columns}
                    data={this.state.list}
                    border={true}
                    emptyText={"暂无数据"}
                />
            </div>
        )
    }
}

export default StudentSituationChangeClass;