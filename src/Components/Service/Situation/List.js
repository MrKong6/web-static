import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";

import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax, {AJAX_PATH} from "../../../utils/ajax";
import '../../Mkt/Leads/Leads.css'
import Commands from "../../Commands/Commands";
import fmtDate from "../../../utils/fmtDate";
import ajaxFile from "../../../utils/ajaxFile";
import StudentSituation from "./StudentSituation";
import {Button, Input, Message, Pagination, Select} from "element-react";

class List extends React.Component {
    constructor(props) {
        super(props);

        this.commands = this.props.commands.filter((command) => (command.name === 'Export' || command.name === 'Import'));//
        this.title = fmtTitle(this.props.location.pathname);
        this.goToDetails = this.goToDetails.bind(this);
        this.createDialogTips = this.createDialogTips.bind(this);
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
            abnormalTypes: [],
            chooseAbnormalType: null
        };
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/student/situation/list.do', {
                    orgId: this.state.group.id, pageNum: this.state.currentPage,
                    pageSize: this.state.pageSize,situationType: this.state.chooseAbnormalType, stuName: this.state.chooseStuName
                });
                let situationTypes = await ajax('/student/situation/situationTypes.do');
                if(list && list.items){
                    list.items.map(item => {
                        if (item.applyTime != null) {
                            item.applyTime = fmtDate(item.applyTime);
                        }
                    });
                }
                this.setState({list: list.items,totalPage: list.totalPage,totalCount: list.count, abnormalTypes:situationTypes});
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

    shouldComponentUpdate(nextProps, nextState) {
        if(nextProps.changedCrmGroup.id != this.props.changedCrmGroup.id){
            this.state.group = nextProps.changedCrmGroup;
            this.setState(nextProps.changedCrmGroup);
            this.componentDidMount();
        }
        return true;
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

    successMsg(msg) {
        Message({
            message: msg,
            type: 'info'
        });
    }
    errorMsg(msg) {
        Message({
            message: msg,
            type: 'error'
        });
    }

    //异动类型筛选
    chooseSearch(value){
        this.state.chooseAbnormalType = value;
        this.setState({chooseAbnormalType : value});
        this.componentDidMount();
    }
    //学员姓名搜索
    onChange(value){
        this.state.chooseStuName = value;
        this.setState({chooseStuName: value});
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
            data:{'orgId':this.state.group.id,"userId":this.state.userId,"importType":1},
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
                    <div className="row">
                        <div className="col-3">
                            <Input placeholder="请输入学员姓名"
                                   className={"leadlist_search"}
                                   value={this.state.chooseStuName}
                                   onChange={this.onChange.bind(this)}
                                   append={<Button type="primary" icon="search" onClick={this.componentDidMount.bind(this)}>搜索</Button>}
                            />
                        </div>
                        <div className="col-3">
                            <Select value={this.state.chooseAbnormalType} placeholder="请选择异动类型" clearable={true}
                                    onChange={this.chooseSearch.bind(this)}>
                                {
                                    this.state.abnormalTypes.map(el => {
                                        return <Select.Option key={el.code} label={el.name} value={el.code}/>
                                    })
                                }
                            </Select>
                        </div>
                    </div>
                    {/*<Progress isAnimating={this.state.isAnimating}/>*/}
                    <div className="row" style={{"height": '80%',"marginTop": '20px'}}>
                        <StudentSituation goToDetails={this.goToDetails} type={"class"} id={this.state.id} data={this.state.list} />
                        <Pagination layout="total, sizes, prev, pager, next, jumper"
                                    total={this.state.totalCount}
                                    pageSizes={[10, 50, 100]}
                                    pageSize={this.state.pageSize}
                                    currentPage={this.state.currentPage}
                                    pageCount={this.state.totalPage}
                                    onCurrentChange={(currentPage) => this.pageChange(currentPage)}
                                    onSizeChange={(pageSize) => this.sizeChange(pageSize)}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default List;