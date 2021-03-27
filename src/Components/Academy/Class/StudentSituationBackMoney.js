import React from 'react'
import {Button, Message, Pagination, Table} from 'element-react';

class StudentSituationBackMoney extends React.Component {
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
                    label: "退费原因",
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
                    label: "班级名称",
                    prop: "classCode",
                    width: 95
                },
                {
                    label: "班级教师",
                    prop: "mainTeacherName",
                    width: 95
                },
                {
                    label: "123132",
                    prop: "classHour",
                    width: 95,
                },
                {
                    label: "已消耗课时",
                    prop: "useCourseHour",
                    width: 95,
                },
                {
                    label: "剩余课时",
                    prop: "noUseCourseHour",
                    width: 95
                },
                {
                    label: "家长姓名",
                    prop: "parentName",
                    width: 100
                },
                {
                    label: "与学员关系",
                    prop: "relation",
                    width: 100
                },
                {
                    label: "联系方式",
                    prop: "cellphone",
                    width: 120
                },
                {
                    label: "退费额度",
                    prop: "amount",
                    width: 120
                },
            ],
        };
    }

    componentDidMount() {

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

export default StudentSituationBackMoney;