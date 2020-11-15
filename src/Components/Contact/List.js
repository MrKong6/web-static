import React from 'react'
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'
import {$} from '../../vendor';

import DialogTips from "../Dialog/DialogTips";
import Approach from '../Dic/Approach';
import ajax from "../../utils/ajax";
import {Button, DatePicker, Dialog, Form, Input, Message, MessageBox} from "element-react";
import {formatWithTime} from '../../utils/fmtDate';
import fmtDate from "../../utils/fmtDate";
import {VerticalTimeline, VerticalTimelineElement} from "react-vertical-timeline-component";
import 'react-vertical-timeline-component/style.min.css';
import {BsBook} from "react-icons/bs/index";

class List extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            redirectToReferrer: false,
            id: this.props.id,
            groupName: this.props.groupName,
            userName: this.props.userName,
            canEdit: this.props.canEdit,
            list: [],
            form: {
                "summary":"",
                "datetime": new Date()
            }
        };
        this.createDialogTips = this.createDialogTips.bind(this);
        this.addContact = this.addContact.bind(this);
        this.modContact = this.modContact.bind(this);
    }

    componentDidMount() {
        const request = async () => {
            try {
                let list = await ajax('/contact/list.do', {leadsId: this.state.id});

                this.setState({list})
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

    addContact(evt) {
        if(this.state.contactId){
            this.modContact();
            return;
        }
        let query = {};

        query.leadsId = this.state.id;
        query.summary = this.state.summary;
        query.datetime = this.state.datetime;
        if(query.datetime){
            query.datetime = new Date(query.datetime).getTime();
        }

        const request = async () => {
            try {
                await ajax('/contact/add.do', query);
                let list = await ajax('/contact/list.do', {leadsId: this.state.id});
                this.setState({list,dialogVisible3:false,summary:""});
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    this.createDialogTips(`${err.errCode}: ${err.errText}`);
                }
            }
        };

        request()
    }

    modContact(evt) {
        let query = {};

        query.leadsId = this.state.id;
        query.summary = this.state.summary;
        query.id = this.state.contactId;
        query.datetime = this.state.datetime;
        if(query.datetime){
          query.datetime = new Date(query.datetime).getTime();
        }
        const request = async () => {
            try {
                await ajax('/contact/mod.do', query);
                const list = this.state.list.map(item => {
                    if (item.id === query.id) {
                        item.approachId = query.approachId;
                        item.summary = query.summary;
                    }
                    return item;
                });
                this.setState({list,dialogVisible3:false,summary:"",contactId:null});
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    this.createDialogTips(`${err.errCode}: ${err.errText}`);
                }
            }
        };
        request()
    }

    delContact(id){

    }
    //展示和关闭弹框框
    showDialog(){
        let dialogVisible3 = this.state.dialogVisible3;
        this.setState({dialogVisible3:!dialogVisible3});
    }
    //编辑沟通记录
    editDialog(item){
        if(item){
            this.setState({datetime:new Date(item.datetime),summary:item.summary,contactId:item.id});
            this.showDialog();
        }
    }

    //删除沟通记录
    delDialog(item){
        MessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
            type: 'warning'
        }).then(() => {

        }).catch(() => {
            Message({
                type: 'info',
                message: '已取消删除'
            });
        });
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

        /*if (!this.state.canEdit && !this.state.list.length) {
          return null;
        }*/
        let that = this;
        return (
            <div style={{"padding":"20px"}}>
                <div>
                    <label className="fontTitle">沟通记录</label>
                    <Button type="text" style={{"marginLeft":"50%"}} onClick={this.showDialog.bind(this)}><i className="el-icon-plus el-icon-right"></i> &nbsp;&nbsp;新增沟通记录</Button>
                </div>
                <VerticalTimeline  layout='1-column'>
                    {
                        this.state.list.map(item => {
                            return <VerticalTimelineElement
                                className="vertical-timeline-element--work"
                                contentStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                                contentArrowStyle={{ borderRight: '7px solid  rgb(33, 150, 243)' }}
                                date={formatWithTime(item.datetime) + '  ' + item.executiveName}
                                iconStyle={{ background: 'rgb(33, 150, 243)', color: '#fff' }}
                                icon={<BsBook />}
                            >
                                <div style={{"position": "absolute","right": "0px","top": "0px","display":item.executiveName == that.state.userName ? "normal" : "none"}}>

                                    <Button type="text" style={{"marginLeft":"26px"}} onClick={that.editDialog.bind(this,item)}><i className="el-icon-edit el-icon-right"></i> &nbsp;&nbsp;编辑</Button>
                                </div>
                                <p>
                                    {item.summary}
                                </p>
                            </VerticalTimelineElement>
                        })
                    }
                </VerticalTimeline>
                <Dialog
                    title="沟通记录"
                    size="tiny"
                    visible={ this.state.dialogVisible3 }
                    onCancel={ () => this.setState({ dialogVisible3: false }) }
                >
                    <Dialog.Body>
                        <div className="form-group row contact">
                            <Form model={this.state.form}  labelWidth="120" style={{"width":"80%"}}>
                                <Form.Item label="沟通时间">
                                    <DatePicker
                                        value={this.state.datetime}
                                        isShowTime={true}
                                        placeholder="选择沟通时间"
                                        format="yyyy-MM-dd HH:mm"
                                        onChange={date=>{
                                            console.debug('DatePicker1 changed: ', date)
                                            this.setState({datetime: date})
                                        }}
                                    />
                                </Form.Item>
                                <Form.Item label="沟通内容">
                                    <Input type="textarea" value={this.state.summary}
                                           onChange={date=>{
                                               this.setState({summary: date})
                                           }}></Input>
                                </Form.Item>
                            </Form>
                        </div>
                    </Dialog.Body>

                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={ () => this.setState({ dialogVisible3: false }) }>取 消</Button>
                        <Button type="primary" onClick={this.addContact.bind(this)}>确 定</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>

        )
    }
}

export default List;