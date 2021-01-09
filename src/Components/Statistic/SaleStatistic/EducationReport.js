import React from 'react'

import mainSize from "../../../utils/mainSize";
import ajax from "../../../utils/ajax";
import {Button, DateRangePicker, Select} from "element-react";
import ReactEcharts from 'echarts-for-react';
import {getYOption} from "../../../utils/const";
import {changeArrayItemToString} from "../../../utils/objectToArray";

class EducationReport extends React.Component {
    constructor(props) {
        super(props);
        // this.title = fmtTitle(this.props.location.pathname);
        // this.ids = this.props.location.state.ids;
        this.state = {
            group: this.props.changedCrmGroup,
            redirectToReferrer: false,
            redirectToList: false,
            isAnimating: false,
            isCreated: false,
            createdId: null,
            typeId : this.props.typeId,
            fromWay : this.props.fromWay,
            reportType: 1,
            dateRange: [],
            dateRangeCls: [],
            teacherId:[],
            teacherHour: getYOption(),
            teacherClsHour: getYOption(),
        };
        this.panelLeadReq = this.panelLeadReq.bind(this);
    }

    componentDidMount() {
        if(this.state.typeId == 11){
            this.panelLeadReq();
            this.panelTeacherReq();
        }
        mainSize();
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.typeId && nextProps.typeId != 0){
            this.state.typeId = nextProps.typeId;
            this.state.fromWay = nextProps.fromWay;

            this.setState({
                typeId: nextProps.typeId,
                fromWay: nextProps.fromWay,
                group: nextProps.changedCrmGroup
            })
            this.componentDidMount();
        }else{
            this.state.typeId = nextProps.typeId;
        }
    }

    //教师课时的数据渲染
    panelLeadReq() {
        const request = async () => {
            let list = await ajax('/statistic/getTeacherUseStatistic.do', {
                orgId: this.state.group.id,
                startDate: (this.state.dateRange && this.state.dateRange.length > 0) ? this.state.dateRange[0].getTime() : null,
                endDate: (this.state.dateRange && this.state.dateRange.length > 0) > 0 ? this.state.dateRange[1].getTime() : null
            });
            if (list &&list.data) {
                list = list.data;
                let legendText = [],value=[];
                if (list && list.length > 0) {
                    list.map(item => {
                        legendText.push(item.name);
                        value.push(Number(item.value));
                    })
                }
                this.setState({
                    teacherHour: {
                        title : {
                            text: '教师课时统计',
                        },
                        tooltip: {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'shadow'
                            }
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '3%',
                            containLabel: true
                        },
                        xAxis: {
                            type: 'value',
                        },
                        yAxis: {
                            type: 'category',
                            data: legendText
                        },
                        series: [
                            {
                                type: 'bar',
                                data: value
                            }
                        ]
                    }
                });
            }
        };
        request();
    }

    //教师班级课时数据渲染
    panelTeacherReq(){
        const request = async () => {
            let teacherList = await ajax('/academy/teacher/list.do', {orgId: this.state.group.id});
            let list = await ajax('/statistic/getTeacherClsUseStatistic.do', {
                orgId: this.state.group.id,
                startDate: (this.state.dateRangeCls && this.state.dateRangeCls.length > 0) ? this.state.dateRangeCls[0].getTime() : null,
                endDate: (this.state.dateRangeCls && this.state.dateRangeCls.length > 0) > 0 ? this.state.dateRangeCls[1].getTime() : null,
                teacherIds: changeArrayItemToString(this.state.teacherId)
            });
            let legendText = [],value=[];
            if (list &&list.data) {
                list = list.data;
                if (list && list.length > 0) {
                    list.map(item => {
                        legendText.push(item.name);
                        value.push(Number(item.value));
                    })
                }
            }
            this.setState({
                teacherList: teacherList.data.items,
                teacherClsHour: {
                    title : {
                        text: '教师班级课时统计',
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'value',
                    },
                    yAxis: {
                        type: 'category',
                        data: legendText
                    },
                    series: [
                        {
                            type: 'bar',
                            data: value
                        }
                    ]
                }
            });
        };
        request();
    }

    //近一年  近一月
    changeTeacherDate(type,value){
        if(type == 1){
            this.state.dateRange = value;
            this.setState({dateRange:value});
            this.panelLeadReq();
        }else if (type == 2){
            this.state.dateRangeCls = value;
            this.setState({dateRangeCls:value});
            this.panelTeacherReq();
        }
    }


    // 更新表单值
    handleSelect(type, key, value) {
        if(key == 'teacherId'){
            this.state.teacherId = value;
        }
        this.panelTeacherReq();
    }

    render() {
        if(this.state.typeId == 11){
            //教学
            return (
                <div>
                    <br/><br/>
                    <div className="row" style={{width: '300px'}}>
                        <DateRangePicker
                            value={this.state.dateRange}
                            placeholder="选择日期范围"
                            onChange={this.changeTeacherDate.bind(this,1)}
                        />
                    </div>
                    <div className="row">
                        <ReactEcharts
                            option={this.state.teacherHour}
                            style={{height: '350px', width: '1000px'}}
                            className='react_for_echarts'/>
                    </div>
                    <br/><br/>
                    <div className="row">
                        <div className="col-4">
                            <DateRangePicker
                                value={this.state.dateRangeCls}
                                placeholder="选择日期范围"
                                onChange={this.changeTeacherDate.bind(this,2)}
                            />
                        </div>
                        <div className="col-3">
                            <Select name="teacherId" value={this.state.teacherId} placeholder="请选择教师" multiple={true}
                                    filterable={true} clearable={true} style={{"width":"100%"}}
                                    onChange={this.handleSelect.bind(this, 1, "teacherId")}>
                                {
                                    (this.state.teacherList && this.state.teacherList.length > 0) ? this.state.teacherList.map(el => {
                                        return <Select.Option key={el.id} label={el.name} value={el.id}/>
                                    }) : null
                                }
                            </Select>
                        </div>
                    </div>
                    <div className="row">
                        <ReactEcharts
                            option={this.state.teacherClsHour}
                            style={{height: '350px', width: '1000px'}}
                            className='react_for_echarts'/>
                    </div>
                </div>
            )
        }else {
            return (<div></div>)
        }
    }
}

export default EducationReport;