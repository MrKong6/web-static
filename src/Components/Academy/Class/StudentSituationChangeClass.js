import React from 'react'
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'
import {Button, Message, Pagination, Table} from 'element-react';

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
            list: this.props.data,
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
                    prop: "applyPerson",
                    width: 120,
                    sortable: true,
                    fixed: 'left',
                },
                {
                    label: "申报时间",
                    prop: "applyTime",
                    width: 120,
                },
                {
                    label: "异动状态",
                    prop: "situationStatus",
                    width: 95,
                    /*render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this, row.id)}>{row.code}</Button></span>
                    }*/
                },
                {
                    label: "转班原因",
                    prop: "reason",
                    width: 95
                },
                {
                    label: "学员编号",
                    prop: "stuCode",
                    width: 95
                },
                {
                    label: "学员姓名",
                    prop: "stuName",
                    width: 120
                },
                {
                    label: "学员状态",
                    prop: "classStatus",
                    width: 120
                },
                {
                    label: "原班级名称",
                    prop: "classCode",
                    width: 120
                },
                {
                    label: "原班级教师",
                    prop: "mainTeacherName",
                    width: 120
                },
                {
                    label: "总课时",
                    prop: "classHour",
                    width: 95,
                },
                {
                    label: "已消耗课时",
                    prop: "useCourseHour",
                    width: 120,
                },
                {
                    label: "剩余课时",
                    prop: "noUseCourseHour",
                    width: 95
                },
                {
                    label: "转入时间",
                    prop: "inTime",
                    width: 100
                },
                {
                    label: "转入班级",
                    prop: "inClassCode",
                    width: 100
                },
                {
                    label: "转入教师",
                    prop: "inMainTeacherName",
                    width: 120
                },
                {
                    label: "转入班消耗课时数",
                    prop: "inUseCourseHour",
                    width: 120
                },
            ],
        };
    }

    componentDidMount() {
        /*const request = async () => {
            try {
                let list = await ajax('/student/situation/list.do', {
                    orgId: this.state.group.id, pageNum: this.state.currentPage,
                    pageSize: this.state.pageSize, situationType:3,classId:this.state.id
                });
                if(list && list.items){
                    list.items.map(item => {
                        if (item.idType != null) {
                            item.idType = CONFIG.DOCUMENT[item.idType];
                        }
                        if (item.birthday != null) {
                            item.age = calculateAge(fmtDate(item.birthday));
                            item.birthday = fmtDate(item.birthday);
                        }
                    });
                    console.log(list.items);
                }
                this.setState({list: list.items, totalPage: list.totalPage, totalCount: list.count});
            } catch (err) {
                Message({
                    message: err.errText,
                    type: 'error'
                });
            }
        };
        request();*/
        // mainSize();
    }

    render() {

        return (
            <div>
                <Table
                    style={{width: '100%'}}
                    className="leadlist_search"
                    columns={this.state.columns}
                    data={this.props.data}
                    border={true}
                    emptyText={"暂无数据"}
                />
            </div>
        )
    }
}

export default StudentSituationChangeClass;