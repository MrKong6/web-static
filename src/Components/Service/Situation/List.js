import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax, {AJAX_PATH} from "../../../utils/ajax";
import '../../Mkt/Leads/Leads.css'
import {Button, Table, Pagination, Tabs} from 'element-react';
import {formatWithTime} from "../../../utils/fmtDate";
import Commands from "../../Commands/Commands";
import StudentSituationBackMoney from "../../Academy/Class/StudentSituationBackMoney";
import StudentSituationPauseClass from "../../Academy/Class/StudentSituationPauseClass";
import StudentSituationChangeClass from "../../Academy/Class/StudentSituationChangeClass";
import fmtDate from "../../../utils/fmtDate";
import ajaxFile from "../../../utils/ajaxFile";

class List extends React.Component {
    constructor(props) {
        super(props);

        this.commands = this.props.commands.filter((command) => (command.name === 'Export' || command.name === 'Import'));//
        this.title = fmtTitle(this.props.location.pathname);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.exportAction = this.exportAction.bind(this);
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            isAnimating: true,
            redirectToReferrer: false,
            totalPage:0,
            currentPage:1,
            pageSize:10,
            totalCount:0,
        };
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/student/situation/list.do', {
                    orgId: this.state.group.id, pageNum: this.state.currentPage,
                    pageSize: this.state.pageSize, situationType:this.state.situationView,stuId:this.state.id
                });
                if(list && list.items){
                    list.items.map(item => {
                        if (item.applyTime != null) {
                            item.applyTime = fmtDate(item.applyTime);
                        }
                    });
                }
                this.setState({list: list.items});
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    this.createDialogTips(`${err.errCode}: ${err.errText}`);
                }
            }
        };

        request();
        mainSize();
    }

    componentWillUnmount() {
        if (this.tipsContainer) {
            document.body.removeChild(this.tipsContainer);
        }
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

    exportAction(){
        ajaxFile('/student/situation/export.do',{orgId: this.state.group.id})
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
        const uploadConfig = {
            className:"upload-demo",
            showFileList:false,
            withCredentials:true,
            data:{'type':4,'orgId':this.state.group.id,"userId":this.state.userId,"importType":2},
            action: AJAX_PATH + '/student/situation/import.do',
            onSuccess: (response, file, fileList) => {
                if(response.code && response.code == 200){
                    this.successMsg("导入成功");
                    this.componentDidMount();
                }else{
                    this.errorMsg(response.detail);
                }
            }
        };
        return (
            <div>
                <h5 id="subNav">
                    <i className={`fa ${this.title.icon}`} aria-hidden="true"/>&nbsp;{this.title.text}
                    <Commands
                        commands={this.commands}
                        importAction={uploadConfig}
                        exportAction={this.exportAction}
                    />
                </h5>
                <div id="main" className="main p-3">
                    {/*<Progress isAnimating={this.state.isAnimating}/>*/}
                    <div className="row" style={{"height": '80%'}}>
                        <Tabs activeName="1" onTabClick={ this.changePanel }>
                            <Tabs.Pane label="退费" name="1">
                                <StudentSituationBackMoney type={"class"} id={this.state.id} data={this.state.list} />
                            </Tabs.Pane>
                            <Tabs.Pane label="休学" name="2">
                                <StudentSituationPauseClass type={"class"} id={this.state.id} data={this.state.list} />
                            </Tabs.Pane>
                            <Tabs.Pane label="转班" name="3">
                                <StudentSituationChangeClass type={"class"} id={this.state.id} data={this.state.list} />
                            </Tabs.Pane>
                        </Tabs>
                    </div>
                </div>
            </div>
        )
    }
}

export default List;