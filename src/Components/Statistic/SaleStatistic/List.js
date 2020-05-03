import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'
import {$} from "../../../vendor";
import DialogTips from "../../Dialog/DialogTips";
import actProcess from "../../../utils/actProcess";
import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import {Button, Table, Pagination, Upload, Input, Tooltip, Tabs, Card, Menu} from 'element-react';
import ReactEcharts from 'echarts-for-react';
import Commands from "../../Commands/Commands";
import {getBarOption, getChartOption, getFuuelChartOption, getPieOption, getMulYOption, getGanteType} from "../../../utils/const";
import fmtDate from "../../../utils/fmtDate";
import SaleManageReport from "./SaleManageReport";
import CustomerServiceReport from "./CustomerServiceReport";
import AcademyManageReport from "./AcademyManageReport";

class List extends React.Component {
    constructor(props) {
        super(props);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.changeIndex = this.changeIndex.bind(this);
        this.first = !(this.props.commands.filter(view => (view.id == '8-1-1')) == false) ? 'normal' : 'none';
        this.second = !(this.props.commands.filter(view => (view.id == '8-1-2')) == false) ? 'normal' : 'none';
        this.third = !(this.props.commands.filter(view => (view.id == '8-1-3')) == false) ? 'normal' : 'none';
        this.fourth = !(this.props.commands.filter(view => (view.id == '8-1-4')) == false) ? 'normal' : 'none';
        // this.fifth = !(this.props.sonView.filter(view => (view.id == '5-4-5')) == false) ? 'normal' : 'none';
        // this.sixth = !(this.props.sonView.filter(view => (view.id == '5-4-6')) == false) ? 'normal' : 'none';

        this.commands = this.props.commands.filter(command => (command.name === 'Show'));
        this.title = fmtTitle(this.props.location.pathname);
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            type : 2,
            typeId : 0,
            fromWay : 0,
            isAnimating: true,
            redirectToReferrer: false,
            reportType:1,
            indexNum:"1-1",
            option: getChartOption(),
        };
    }

    componentDidMount() {
        if(this.first && this.first == 'normal'){
            this.changeIndex("1-1");
        }else if(this.second && this.second == 'normal'){
            this.changeIndex("2-1");
        }else if(this.third && this.third == 'normal'){
            this.changeIndex("3-1");
        }else if(this.fourth && this.fourth == 'normal'){
            this.changeIndex("4");
        }
        mainSize()
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

    goToDetails(data) {
        const url = `${this.props.match.url}/${data}`;

        this.props.history.push(url, {ids: this.state.ids});
    }

    changeIndex(evt){
        this.state.indexNum = evt;
        switch (evt){
            case("1-1"):{
                // this.setState({"typeId":1,"fromWay":2});
                this.state.typeId = 1;
                this.state.fromWay = 2;
                break;
            }
            case("1-2"):{
                // this.setState({"typeId":2,"fromWay":3});
                this.state.typeId = 2;
                this.state.fromWay = 3;
                break;
            }
            case("2-1"):{
                this.state.typeId = 4;
                this.state.fromWay = 0;
                break;
            }
            case("2-2"):{
                this.state.typeId = 0;
                this.state.fromWay = 0;
                break;
            }
            case("2-3"):{
                this.state.typeId = 0;
                this.state.fromWay = 0;
                break;
            }
            case("3-1"):{
                this.state.typeId = 0;
                this.state.fromWay = 0;
                break;
            }
            case("4"):{
                this.state.typeId = 0;
                this.state.fromWay = 0;
                break;
            }
            default:{
                break;
            }
        }
        this.setState({"indexNum":evt,"typeId":this.state.typeId,"fromWay":this.state.fromWay});
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
                    <Menu defaultActive="1-1" className="el-menu-demo" mode="horizontal" onSelect={this.changeIndex.bind(this)} style={{"border-bottom":"1px solid"}}>
                        <Menu.SubMenu index="1" title="销售管理" style={{"display":this.first}}>
                            <Menu.Item index="1-1">线索</Menu.Item>
                            <Menu.Item index="1-2">机会</Menu.Item>
                        </Menu.SubMenu>
                        <Menu.SubMenu index="2" title="客户服务" style={{"display":this.second}}>
                            <Menu.Item index="2-1">访客</Menu.Item>
                            <Menu.Item index="2-2">合同</Menu.Item>
                            <Menu.Item index="2-3">学员</Menu.Item>
                        </Menu.SubMenu>
                        <Menu.SubMenu index="3" title="市场管理" style={{"display":this.third}}>
                            <Menu.Item index="3-1">营销活动</Menu.Item>
                        </Menu.SubMenu>
                        <Menu.Item index="4" style={{"display":this.fourth}}>教务管理</Menu.Item>
                    </Menu>
                    <div id="saleView">
                        <SaleManageReport changedCrmGroup={this.state.group} fromWay={this.state.fromWay} typeId={this.state.typeId} />
                    </div>
                    <div id="serviceView">
                        <CustomerServiceReport changedCrmGroup={this.state.group} indexNum={this.state.indexNum} />
                    </div>
                    <div id="academyView">
                        <AcademyManageReport changedCrmGroup={this.state.group} indexNum={this.state.indexNum} />
                    </div>
                </div>
            </div>
        )
    }
}

export default List;