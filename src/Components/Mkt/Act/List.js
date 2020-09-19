import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtDate from '../../../utils/fmtDate';
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";
import {Button, Table, Tree, MessageBox, Message} from 'element-react';
import DialogMarketType from "../../Dialog/DialogMarketType";

class List extends React.Component {
    constructor(props) {
        super(props);
        this.createDialogTips = this.createDialogTips.bind(this);
        this.goToDetails = this.goToDetails.bind(this);
        this.addAction = this.addAction.bind(this);
        this.commands = this.props.commands.filter(command => (command.name === 'Add'));
        this.title = fmtTitle(this.props.location.pathname);
        this.options = {
            label: 'name',
            children: 'name'
        }
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            isAnimating: true,
            redirectToReferrer: false,
            columns:[
                {
                    label: "#",
                    type: 'index'
                },
                {
                    label: "创建人",
                    prop: "creatorName",
                    sortable: true
                },
                {
                    label: "创建时间",
                    prop: "createTime",
                    sortable: true
                },
                {
                    label: "活动名称",
                    prop: "name",
                    sortable: true,
                    width: 150,
                    render: (row, column, data)=>{
                        return <span><Button type="text" size="small" onClick={this.goToDetails.bind(this, row.id)}>{row.name}</Button></span>
                    }
                },
                {
                    label: "开始时间",
                    prop: "startDate",
                    sortable: true
                },
                {
                    label: "结束时间",
                    prop: "endDate",
                    sortable: true
                },
                {
                    label: "预计花费",
                    prop: "budget",
                    sortable: true
                },
                {
                    label: "实际花费",
                    prop: "cost",
                    sortable: true
                },
                {
                    label: "获取线索量",
                    prop: "leads",
                    sortable: true
                },
                {
                    label: "转化机会量",
                    prop: "opportunities",
                    sortable: true
                },
                {
                    label: "签约客户量",
                    prop: "contracts",
                    sortable: true
                },
                {
                    label: "签约客户金额",
                    prop: "totalAmount",
                    sortable: true
                },
                {
                    label: "ROI",
                    prop: "roi",
                    sortable: true
                },

            ],
            marketTypes: [],
            checkId: null, //选中的节点id
            checkName: null, //选中的节点名称
            checkRootId: null,//选中的rootId
        };

        this.addMarketType = this.addMarketType.bind(this);
        this.addMarketTypeReq = this.addMarketTypeReq.bind(this);
        this.refreshMarketType = this.refreshMarketType.bind(this);
        this.loadNode = this.loadNode.bind(this);
        // this.handleCheckChange = this.handleCheckChange.bind(this);
    }

    componentDidMount() {
        this.refreshMarketType();
        this.loadActivity();
        mainSize()
    }

    //加载活动数据
    loadActivity() {
        const request = async () => {
            try {
                let list = await ajax('/mkt/activity/list.do', {organizationId: this.state.group.id,typeId:this.state.checkId ? this.state.checkId : 0});
                const ids = list.map((act) => (act.id));
                list.map(item => {
                    if(item.createTime != null){
                        item.createTime = fmtDate(item.createTime);
                    }
                    if(item.startDate != null){
                        item.startDate = fmtDate(item.startDate);
                    }
                    if(item.endDate != null){
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

    goToDetails(data) {
        const url = `${this.props.match.url}/${data}`;

        this.props.history.push(url, {ids: this.state.ids});
    }
    //新建活动
    addAction() {
        if(this.state.checkId && this.state.checkName){
            this.props.history.push(`${this.props.match.url}/create`, {ids: this.state.ids,checkId:this.state.checkId,checkName:this.state.checkName});
        }else{
            Message({
                type: 'warning',
                message: '请先选择市场活动类别!'
            });
        }
    }

    /**
     * 新增市场活动类别
     */
    addMarketType(typeName){
        if(typeName == 2){
            this.props.history.push(`${this.props.match.url}/create`, {selectedCou: this.state.selectedCou,
                selectedCouText: this.state.selectedCouText});
        }else{
            this.userContainer = document.createElement('div');
            ReactDOM.render(
                <DialogMarketType
                    accept={this.addMarketTypeReq}
                    container={this.userContainer}
                    typeName={typeName}
                    parentName={this.state.checkName ? this.state.checkName : '创建首级'}
                    selectedCou={this.state.selectedCou}
                    groupId={this.state.groupId}
                    groupName={this.state.groupName}
                    replace={this.props.history.replace}
                    from={this.props.location}
                    ref={(dom) => {
                        this.user = dom
                    }}
                />,
                document.body.appendChild(this.userContainer)
            );
            this.user.dialog.modal('show');
        }
    }
    addMarketTypeReq(selected){
        const request = async () => {
            try {
                let list = await ajax('/mkt/activity/addMarketType.do', {orgId: this.state.group.id,
                    name:selected.marketTypeName,rootId:this.state.checkRootId,parentId:this.state.checkId,id:selected.editId});
                this.componentDidMount();
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
    //刷新市场活动类别
    refreshMarketType(parentId){
        const request = async () => {
            try {
                let list = await ajax('/mkt/activity/getMarketType.do', {orgId: this.state.group.id, parentId:parentId});

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
    handleCheckChange(data, node) {
        console.log(data, node);
        this.setState({checkId: data.id,checkName: data.name,checkRootId:data.rootId ? data.rootId : data.id});
        this.state.checkId = data.id;
        this.loadActivity();
        // if(checked){
        //     this.setState({checkId: data.id,checkName: data.name,checkRootId:data.rootId ? data.rootId : data.id});
        // }else{
        //     this.setState({checkId: null,checkName: null,checkRootId:null});
        // }
    }
    //加载节点下的数据
    loadNode(node, resolve) {
        this.setState({checkId: node.id,checkName: node.name});
        //第一级
        if (node.level === 0) {
            return resolve(this.state.marketTypes);
        }
        //超过5级返空
        if (node.level > 5) return resolve([]);

        const request = async () => {
            try {
                let list = await ajax('/mkt/activity/getMarketType.do', {orgId: this.state.group.id, parentId:node.data.id});
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
    //编辑市场活动类别
    edit(store, data) {
        this.userContainer = document.createElement('div');
        ReactDOM.render(
            <DialogMarketType
                accept={this.addMarketTypeReq}
                container={this.userContainer}
                typeName={'1'}
                parentName={this.state.checkName ? this.state.checkName : '首级'}
                selectedId={data.id}
                selectedName={data.name}
                groupId={this.state.groupId}
                groupName={this.state.groupName}
                replace={this.props.history.replace}
                from={this.props.location}
                ref={(dom) => {
                    this.user = dom
                }}
            />,
            document.body.appendChild(this.userContainer)
        );
        this.user.dialog.modal('show');
    }
    //删除市场活动类别
    remove(store, data) {
        MessageBox.confirm('此操作将永久删除该类别信息, 是否继续?', '提示', {
            type: 'warning'
        }).then(() => {
            request();
        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消删除'
            });
        });
        const request = async () => {
            try {
                await ajax('/mkt/activity/delMarketType.do', {id: data.id});
                this.setState({redirectToList: true});
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
    }

    renderContent(nodeModel, data, store) {
        return (
            <span>
              <span>
                <span>{data.name}</span>
              </span>
              <span style={{float: 'right', marginRight: '20px'}}>
                <Button size="mini" type='text' onClick={ () => this.edit(store, data) }>编辑</Button>
                <Button size="mini" type='text' onClick={ () => this.remove(store, data) }>删除</Button>
              </span>
            </span>);
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

                    {/*<Commands
                        commands={this.commands}
                        addAction={this.addAction}
                    />*/}
                </h5>
                <div id="main" className="main p-3">
                    <Progress isAnimating={this.state.isAnimating}/>
                    <div className="row">
                        <div className="col-3">
                            <Button type="text" onClick={this.addMarketType.bind(this,1)}>新增营销活动分类</Button>
                        </div>
                        <div className="col-9">
                            <Button type="text" onClick={this.addAction.bind(this,2)}>新增营销活动</Button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-lg-3">
                            {/*<Input placeholder="输入关键字进行过滤" onChange={text=> this.tree.filter(text)} />*/}
                            <Tree
                                ref={e=> this.tree = e}
                                data={this.state.marketTypes}
                                options={this.options}
                                isShowCheckbox={false}
                                highlightCurrent={true}
                                expandOnClickNode={false}
                                defaultExpandAll={true}
                                lazy={true}
                                load={this.loadNode.bind(this)}
                                onNodeClicked={this.handleCheckChange.bind(this)}
                                renderContent={(...args)=>this.renderContent(...args)}
                                /*filterNodeMethod={(value, data)=>{
                                    if (!value) return true;
                                    return data.name.indexOf(value) !== -1;
                                }}*/
                            />
                            {/*{
                                this.state.marketTypes ? this.state.marketTypes.map((cou) => (
                                    <p
                                        key={cou.id}
                                        rid={cou.id}
                                        className={`${this.state.selectedCou === cou.id ? 'text-light bg-primary' : 'text-dark'} m-0 p-1`}
                                        onClick={this.changeCourse}
                                    >
                                        {cou.name}
                                    </p>
                                )) : null
                            }*/}
                        </div>
                        <div className="col-12 col-lg-9">
                            {/*<p className={'h6 pb-3 mb-0'}>{this.state.selectedCouText || ''}</p>*/}
                            <Table
                                style={{width: '100%'}}
                                columns={this.state.columns}
                                data={this.state.list}
                                border={true}
                                fit={true}
                                emptyText={"--"}
                            />
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default List;