import React from 'react'
import ReactDOM from "react-dom";

import DialogTips from "../Dialog/DialogTips";
import {Table, Tree, Tooltip, Button} from "element-react";
import ajax from "../../utils/ajax";
import fmtDate from "../../utils/fmtDate";

class CourseTypeHover extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirectToReferrer: false,
            data: [],
            options: {
                children: 'name',
                label: 'name'
            },
            typeId: null,
            checkNames: [],

        }
    }

    componentDidMount() {
        this.refreshMarketType();
    }

    //刷新表格数据
    refreshMarketType(){
        const request = async () => {
            try {
                let list = await ajax('/course/type/courseTypeList.do');
                this.setState({data: list});
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
                let list = await ajax('/course/type/listAll.do',{courseType:this.state.typeId ? this.state.typeId : 0});
                this.state.list = list.data.items ? list.data.items : [];
                this.setState({list : list.data.items});
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
        this.setState({checkId: node.data.id, checkName: node.name});
        //第一级
        if (node.level === 0) {
            if(this.state.data.length > 0){
                return resolve(this.state.data);
            }else{
                return ;
            }
        }

        //第二级
        if(node.level == 2){
            console.log(node);
        }

        //超过5级返空
        if (node.level > 1) return resolve([]);

        const request = async () => {
            try {
                let list = await ajax('/course/type/listAll.do',{courseType:node.data.id ? node.data.id : 0});
                if(list.data && list.data.items){
                    return resolve(list.data.items);
                }else{
                    return resolve([]);
                }
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
        if(node.props.nodeModel.level == 2){
            let checkNames = this.state.checkNames;
            if(node.oldChecked){
                //上一个状态是选中状态
                checkNames = checkNames.filter(item => item.id != data.id)
                this.props.parent.changeClsName(checkNames);
                this.setState({checkNames});
                // this.parent.setState({courseTypeName: });
            }else{
                //上一个状态是未选中状态
                let exist = checkNames.filter(item => item.id == data.id)
                if(exist && exist.length > 0){

                }else{
                    checkNames.push(data);
                    this.props.parent.changeClsName(checkNames);
                    this.setState({checkNames});
                }
            }
        }
        this.setState({typeId: data.id, checkName: data.name, checkRootId: data.rootId ? data.rootId : data.id});
        this.state.typeId = data.id;
        this.loadActivity();
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
                <Tree
                    ref={e=>this.tree = e}
                    data={this.state.data}
                    options={this.state.options}
                    isShowCheckbox={true}
                    highlightCurrent={true}
                    lazy={true}
                    load={this.loadNode.bind(this)}
                    onNodeClicked={this.handleCheckChange.bind(this)}
                />
            </div>
        )
    }
}

export default CourseTypeHover;