import React from 'react'
import ReactDOM from "react-dom";

import DialogTips from "../Dialog/DialogTips";
import {Table, Tree} from "element-react";
import ajax from "../../utils/ajax";
import fmtDate from "../../utils/fmtDate";

class ActHouver extends React.Component {
    constructor(props) {
        super(props);
        this.options = {
            label: 'name',
            children: 'name',
        }
        this.state = {
            redirectToReferrer: false,
            ageYear: [],
            ageMonth: [],
            type: this.props.data,
            marketTypes: [],
            columns:[
                {
                    label: "活动名称",
                    prop: "name",
                }
            ],
            list:[],
        }
    }

    componentDidMount() {
        this.refreshMarketType();
    }

    //刷新市场活动类别
    refreshMarketType(parentId){
        const request = async () => {
            try {
                debugger
                let list = await ajax('/mkt/activity/getMarketType.do', {orgId: this.props.parent.state.group.id, parentId:parentId});
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
    //加载活动数据
    loadActivity() {
        const request = async () => {
            try {
                let list = await ajax('/mkt/activity/list.do', {
                    organizationId: this.props.parent.state.group.id,
                    typeId: this.state.checkId ? this.state.checkId : 0
                });
                const ids = list.map((act) => (act.id));
                list.map(item => {
                    if (item.createTime != null) {
                        item.createTime = fmtDate(item.createTime);
                    }
                    if (item.startDate != null) {
                        item.startDate = fmtDate(item.startDate);
                    }
                    if (item.endDate != null) {
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
    //加载节点下的数据
    loadNode(node, resolve) {
        this.setState({checkId: node.id, checkName: node.name});
        //第一级
        if (node.level === 0) {
            if(this.state.marketTypes.length > 0){
                return resolve(this.state.marketTypes);
            }else{
                return ;
            }
        }
        //超过5级返空
        if (node.level > 5) return resolve([]);

        const request = async () => {
            try {
                let list = await ajax('/mkt/activity/getMarketType.do', {
                    orgId: this.props.parent.state.group.id,
                    parentId: node.data.id
                });
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
    //刷新活动数据
    handleCheckChange(data, node) {
        console.log(data, node);
        this.setState({checkId: data.id, checkName: data.name, checkRootId: data.rootId ? data.rootId : data.id});
        this.state.checkId = data.id;
        this.loadActivity();
        // if(checked){
        //     this.setState({checkId: data.id,checkName: data.name,checkRootId:data.rootId ? data.rootId : data.id});
        // }else{
        //     this.setState({checkId: null,checkName: null,checkRootId:null});
        // }
    }

    //选中活动
    checkAct(item) {
        this.props.parent.checkAct(item);
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


    render() {

        return (
            <div>
                <p>请选择具体渠道：</p>
                <div className="row">
                    <div className="col-6">
                        <Tree
                            ref={e => this.tree = e}
                            data={this.state.marketTypes}
                            options={this.options}
                            isShowCheckbox={false}
                            highlightCurrent={true}
                            expandOnClickNode={false}
                            defaultExpandAll={true}
                            lazy={true}
                            load={this.loadNode.bind(this)}
                            onNodeClicked={this.handleCheckChange.bind(this)}
                            /*filterNodeMethod={(value, data)=>{
                                if (!value) return true;
                                return data.name.indexOf(value) !== -1;
                            }}*/
                        />
                    </div>
                    <div className="col-6">
                        <Table
                            style={{width: '100%'}}
                            columns={this.state.columns}
                            data={this.state.list}
                            border={true}
                            emptyText={"暂无数据"}
                            highlightCurrentRow={true}
                            onCurrentChange={this.checkAct.bind(this)}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default ActHouver;