import React from 'react'
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'
import {$} from "../../vendor";

import DialogGroup from './DialogGroup';
import ajax from "../../utils/ajax";
import {Input, Select} from "element-react";

class DialogMarketType extends React.Component {
    constructor(props) {
        super(props);
        this.dialogId = `d-${new Date().getTime()}`;
        console.log(this.props.selectedName);
        this.state = {
            groupId: this.props.groupId,
            groupName: this.props.groupName,
            typeName: this.props.typeName,
            list: [],
            marketTypeName: this.props.selectedName ? this.props.selectedName : null,
            selectedId: this.props.selectedId,
            selectedName: this.props.selectedName,
        };
        this.createGroupsDialog = this.createGroupsDialog.bind(this);
        this.acceptGroupDialog = this.acceptGroupDialog.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.accept = this.accept.bind(this);
        this.cancel = this.cancel.bind(this);
        this.closed = this.closed.bind(this);
        this.changedLead = this.changedLead.bind(this);
        this.changedOppor = this.changedOppor.bind(this);
        this.changeInput = this.changeInput.bind(this);
    }

    componentDidMount() {
        this.dialog = $(`#${this.dialogId}`);
        this.dialog.on('hidden.bs.modal', () => {
            this.closed();
        });

        const request = async () => {
            try {

            } catch (err) {
                if (err.errCode === 401) {
                    this.dialog.modal('hide');
                    this.props.replace('/login', {from: this.props.from})
                } else {
                    this.setState({errText: `${err.errCode}: ${err.errText}`});
                }
            }
        };

        request();
    }

    createGroupsDialog() {
        if (this.group === undefined) {
            this.groupContainer = document.createElement('div');
            ReactDOM.render(
                <DialogGroup
                    accept={this.acceptGroupDialog}
                    defaults={this.state.groupId}
                    replace={this.props.replace}
                    from={this.props.from}
                    ref={(dom) => {
                        this.group = dom
                    }}
                />,
                document.body.appendChild(this.groupContainer)
            );
        }

        this.group.dialog.modal('show');
    }

    acceptGroupDialog(selected) {
        this.setState({
            groupId: selected.id,
            groupName: selected.name,
            userId: '',
            userName: ''
        });

        const request = async () => {
            try {
                let list = await ajax('/org/listUsers.do', {id: selected.id});

                this.setState({list: list});
            } catch (err) {
                if (err.errCode === 401) {
                    this.setState({redirectToReferrer: true})
                } else {
                    this.setState({errText: `${err.errCode}: ${err.errText}`});
                }
            }
        };

        request();
    }

    handleSelect(evt) {
        this.setState({
            userId: evt.target.value,
            userName: evt.target.options[evt.target.selectedIndex].text
        })
    }

    accept() {
        if(this.state.typeName == 1){
            this.props.accept({
                group: {
                    id: this.state.groupId,
                    name: this.state.groupName
                },
                marketTypeName: this.state.marketTypeName,
                editId: this.state.selectedId,
            });
            this.dialog.modal('hide');
        }

    }

    cancel() {
        this.dialog.modal('hide');
    }

    closed() {
        if (this.groupContainer) {
            document.body.removeChild(this.groupContainer);
        }

        document.body.removeChild(this.props.container);
    }

    changedLead(evt) {
        this.state.typeId = evt.target.value;
    }

    changedOppor() {
        this.state.typeId = '2';
        let checkO = this.state.checkOppor;
        this.setState({
            checkOppor: !checkO,
        })

    }

    changeInput(key, value) {
        this.setState({
            [key] : value}
        )
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
        if (this.state.typeName && this.state.typeName == 1) {
            // 课程类别
            return (
                <div id={this.dialogId} className="modal fade" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{this.props.title}</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label" style={{"width":"250px"}}>
                                        上级营销活动类别名称：
                                    </label>
                                    <Input value={this.props.parentName} disabled />
                                </div>
                                <div className="form-check form-check-inline">
                                    <label className="form-check-label" style={{"width":"250px"}}>
                                        营销活动类别名称：
                                    </label>
                                    <Input placeholder="请输入内容" value={this.state.marketTypeName} onChange={this.changeInput.bind(this,'marketTypeName')} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button onClick={this.cancel} type="button" className="btn btn-secondary"
                                        data-dismiss="modal">取消
                                </button>
                                <button onClick={this.accept} type="button" className="btn btn-primary">确认</button>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    }
}

export default DialogMarketType;