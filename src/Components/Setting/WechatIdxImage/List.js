import React from "react";
import {Redirect} from 'react-router-dom'
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtTitle from '../../../utils/fmtTitle';
import ajax, {AJAX_PATH, ajaxGet, IMG_URL} from "../../../utils/ajax";
import '../../Mkt/Leads/Leads.css'
import {Button, Pagination, Table, Upload} from 'element-react';
import Commands from "../../Commands/Commands";
import historyBack from "../../../utils/historyBack";

class List extends React.Component {
    constructor(props) {
        super(props);
        this.commands = this.props.commands.filter((command) => (command.name == 'Add' || command.name == 'ShowNormal'));
        this.title = fmtTitle(this.props.location.pathname);
        this.goToDetails = this.goToDetails.bind(this);
        this.addAction = this.addAction.bind(this);
        this.state = {
            group: this.props.changedCrmGroup,
            list: [],
            ids: [],
            isAnimating: true,
            redirectToReferrer: false,
            columns: [
                {
                    type: 'index'
                },
                {
                    label: "文件名称",
                    prop: "name",
                    sortable: true,
                },
                {
                    label: "轮播图片",
                    prop: "url",
                    sortable: true,
                    render: (row, column, data) => {
                        return  <img src={row.url} alt="" width="80px" height="80px" style={{"marginLeft":"10px"}} />
                    }
                },
                {
                    label: "操作",
                    width: 120,
                    fixed: 'right',
                    render: (row, column, index)=>{
                        return <span><Button type="text" size="small" onClick={this.handleRemove.bind(this, row)}>移除</Button></span>
                    }
                }
            ]
        };
    }

    componentDidMount() {
        const request = async () => {
            try {
                let data = await ajaxGet('/wechat/getIndexImageList.do', {orgId: this.state.group.id,type:1});
                let imgList = [];
                if(data && data.length > 0){
                    data.map(item => {
                        item.url = IMG_URL + item.url;
                        imgList.push({name: item.name,url:item.url,id:item.id});
                    });
                }
                this.setState({imgList:imgList});
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
        mainSize()
    }

    componentWillUnmount() {
        if (this.tipsContainer) {
            document.body.removeChild(this.tipsContainer);
        }
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

    addAction(){
        this.props.history.push(`${this.props.match.url}/create`, {ids: this.state.ids});
    }
    //删除图片记录
    handleRemove(data) {
        const request = async () => {
            try {
                await ajaxGet('/wechat/removeImage.do', {id:data.id});
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

        request()
    }

    handlePreview(file) {
        console.log(file);
    }

    //上传成功时绑定方法
    upLoadSuccess(response, file, fileList){
        this.state.imgList.push({name:response.data.filename,url:response.data.url,id:response.data.id});
        this.componentDidMount();
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
                    <i className="fa fa-shield" aria-hidden="true"/>&nbsp;课程管理
                    <div className="an">
                    <Commands
                        commands={this.commands}
                        addAction={this.addAction}
                    />
                    </div>
                    <div className="btn-group float-right" role="group">
                        <Upload
                            className="upload-demo"
                            action={AJAX_PATH + '/file/fileupload.do'}
                            data={{"result":"3","orgId":this.state.group.id}}
                            onPreview={file => this.handlePreview(file)}
                            onRemove={(file, fileList) => this.handleRemove(file, fileList)}
                            listType="picture"
                            showFileList={false}
                            // tip={<div className="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>}
                            onSuccess={this.upLoadSuccess.bind(this)}
                        >
                            <Button type="primary">上传首页轮播图</Button>
                        </Upload>
                    </div>
                </h5>

                <div id="main" className="main p-3">
                    <Progress isAnimating={this.state.isAnimating}/>
                    <div className="row" style={{"marginTop":"20px"}}>
                        <Table
                            style={{width: '100%'}}
                            columns={this.state.columns}
                            data={this.state.imgList}
                            border={true}
                            fit={true}
                            emptyText={"--"}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default List;