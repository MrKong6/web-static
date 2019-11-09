import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'
import {Button, Tooltip} from "element-react";

export function getContractColumns() {
    const OPTION_BAR = [
        {
            // label: "序号",
            width: 100,
            sortable: true,
            type: 'index',
            fix: true,
        },
        {
            label: "创建人",
            prop: "creatorName",
            width: 100,
            sortable: true,
            fix: true,
        },
        {
            label: "创建时间",
            prop: "createTime",
            width: 120,
            sortable: true,
            fix: true,
        },
        {
            label: "所属组织",
            prop: "orgName",
            width: 175,
            showOverflowTooltip: true,
            fix: true,
        },
        {
            label: "所属用户",
            prop: "executiveName",
            width: 95,
            fix: true,
        },
        {
            label: "合同编号",
            prop: "code",
            width: 130,
            fix: true,
            render: (row, column, data) => {
                return <span><Button type="text" size="small"
                             onClick={this.goToDetails.bind(this, row.id)}>{row.code}</Button></span>
            }
        },
        {
            label: "合同类型",
            prop: "typeName",
            width: 100,
            fix: true,
        },
        {
            label: "学员姓名",
            prop: "stuName",
            width: 95,
        },
        {
            label: "家长姓名",
            prop: "parName",
            width: 95,
        },
        {
            label: "联系电话",
            prop: "parCellphone",
            width: 150,
            className: 'tabletd',
            render: function (data) {
                return <Tooltip effect="dark" content={data.parCellphone}
                                placement="top-start">
                    {data.parCellphone}
                </Tooltip>
            }

        },
        {
            label: "课程类别",
            prop: "courseType",
            width: 95
        },
        {
            label: "课程",
            prop: "courseName",
            width: 95,
            className: 'tabletd',
            render: function (data) {

                return <Tooltip effect="dark" content={data.courseName}
                                placement="top-start">
                    {data.courseName}
                </Tooltip>
            }
        },
        {
            label: "合同金额(元)",
            prop: "contractPrice",
            width: 100
        },
        {
            label: "折扣金额(元)",
            prop: "countPrice",
            width: 100,
            sortable: true
        },
        {
            label: "应付金额(元)",
            prop: "finalPrice",
            width: 95
        },
        {
            label: "已付金额(元)",
            prop: "paid",
            width: 120
        },
        {
            label: "课时费(元)",
            prop: "oriPrice",
            width: 100,
            sortable: true
        },
        {
            label: "培训资料费(元)",
            prop: "discPrice",
            width: 95
        },
        {
            label: "其他费用(元)",
            prop: "otherPrice",
            width: 120
        },
        {
            label: "总课时",
            prop: "courseHours",
            width: 95
        },
        {
            label: "总课次",
            prop: "courseTimes",
            width: 120
        }
    ];
    return OPTION_BAR;
}





