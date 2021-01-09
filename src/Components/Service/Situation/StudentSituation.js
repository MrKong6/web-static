import React from 'react'
import {Button, Message, Pagination, Table} from 'element-react';

class StudentSituation extends React.Component {
    constructor(props) {
        super(props);
        this.goToDetails = this.goToDetails.bind(this);
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
                    label: "创建人",
                    prop: "applyPerson",
                    width: 120,
                    sortable: true,
                    fixed: 'left',
                },
                {
                    label: "创建时间",
                    prop: "applyTime",
                    width: 120,
                },
                {
                    label: "异动类型",
                    prop: "typeName",
                    width: 95,

                },
                {
                    label: "异动编号",
                    prop: "code",
                    width: 95,
                    render: (row, column, data) => {
                        return <span><Button type="text" size="small"
                                             onClick={this.goToDetails.bind(this,row.id)}>{row.code}</Button></span>
                    }
                },
                {
                    label: "异动原因",
                    prop: "reason",
                    width: 95
                },
                {
                    label: "学员姓名",
                    prop: "stuName",
                    width: 95
                },
                {
                    label: "学员编号",
                    prop: "stuCode",
                    width: 95
                },
                {
                    label: "合同编号",
                    prop: "contractCode",
                    width: 120
                },
                {
                    label: "合同状态",
                    prop: "contractStatusName",
                    width: 120
                },
                {
                    label: "班级编号",
                    prop: "classCode",
                    width: 120
                },
                {
                    label: "总课时",
                    prop: "classHour",
                    width: 120
                },
                {
                    label: "已消耗课时",
                    prop: "useCourseHour",
                    width: 120
                },
                {
                    label: "剩余课时",
                    prop: "classCode",
                    width: 120
                },
                {
                    label: "异动金额",
                    prop: "amount",
                    width: 120
                },
                {
                    label: "转入班级",
                    prop: "inClassCode",
                    width: 100
                },
                {
                    label: "转入班已消耗课时数",
                    prop: "inUseCourseHour",
                    width: 160
                },
                {
                    label: "转出班级名称",
                    prop: "classCode",
                    width: 120
                },
                {
                    label: "转出班级已消耗课时",
                    prop: "useCourseHour",
                    width: 160,
                },
            ],
        };
    }
    goToDetails(id){
        this.props.goToDetails(id)
    }

    componentDidMount() {
    }

    render() {

        return (
            <div>
                <Table
                    style={{width: '100%'}}
                    columns={this.state.columns}
                    data={this.props.data}
                    border={true}
                    emptyText={"暂无数据"}
                />
            </div>
        )
    }
}

export default StudentSituation;