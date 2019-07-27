import React from 'react'
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'
import {$} from "../../vendor";

import DialogGroup from './DialogGroup';
import ajax from "../../utils/ajax";
import Age from "../Dic/Age";
import {DatePicker} from "element-react";

class DialogForEvent extends React.Component {
  constructor(props) {
    super(props);
      this.createGroupsDialog = this.createGroupsDialog.bind(this);
      this.acceptGroupDialog = this.acceptGroupDialog.bind(this);
      this.handleSelect = this.handleSelect.bind(this);
      this.accept = this.accept.bind(this);
      this.cancel = this.cancel.bind(this);
      this.closed = this.closed.bind(this);
      this.changedLead = this.changedLead.bind(this);
      this.changedOppor = this.changedOppor.bind(this);
      this.state={
          classMap:[],
      }
  }

  componentDidMount() {
    this.dialog = $(`#123456`);
    this.dialog.on('hidden.bs.modal', () => {
      this.closed();
    });
    this.setState({
        classMap:['K1','K2','K3','K4']
    });
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
  }

  handleSelect(evt) {
    this.setState({
      userId: evt.target.value,
      userName: evt.target.options[evt.target.selectedIndex].text
    })
  }

  accept() {
    console.log("确认");
    this.dialog.modal('hide');
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
  changedLead(evt){
      this.state.typeId = evt.target.value;
  }
  changedOppor(){
      this.state.typeId = '2';
      let checkO = this.state.checkOppor;
      this.setState({
          checkOppor: !checkO,
      })

  }

  render() {
      return (
          <div id="123456" className="modal fade" tabIndex="-1" role="dialog">
              <div className="modal-dialog" role="document">
                  <div className="modal-content">
                      <div className="modal-header">
                          <h5 className="modal-title">添加事件</h5>
                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                          </button>
                      </div>
                      <div className="modal-body">
                          <div className="form-group row">
                              <div className="col-10 input-group">
                                  <select className="form-control" name={this.props.name || "studentAgeMonth"}>
                                      <option value="">班级</option>
                                      {
                                          this.state.classMap.map(item => (
                                              <option key={item} value={item}>{item}</option>
                                          ))
                                      }
                                  </select>
                              </div>
                          </div>
                          <div className="form-check form-check-inline">
                              <div className="form-group row">
                                  <label className="col-5 col-form-label">开始时间</label>
                                  <div className="col-7">
                                      {/*<input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data ? formatWithTime(this.state.data.createTime) : ''}
                                                    />*/}
                                      <DatePicker
                                          name="createTime"
                                          value={this.state.createTime}
                                          isShowTime={true}
                                          placeholder="选择日期"
                                          format="yyyy-MM-dd HH:mm"
                                          onChange={date=>{
                                              console.debug('DatePicker1 changed: ', date)
                                              this.setState({createTime: date})
                                          }}
                                      />
                                  </div>
                              </div>
                          </div>
                          <div className="form-check form-check-inline">
                              <div className="form-group row">
                                  <label className="col-5 col-form-label">结束时间</label>
                                  <div className="col-7">
                                      {/*<input
                                                        type="text"
                                                        readOnly={true}
                                                        className="form-control-plaintext"
                                                        value={this.state.data ? formatWithTime(this.state.data.createTime) : ''}
                                                    />*/}
                                      <DatePicker
                                          name="createTime"
                                          value={this.state.createTime}
                                          isShowTime={true}
                                          placeholder="选择日期"
                                          format="yyyy-MM-dd HH:mm"
                                          onChange={date=>{
                                              console.debug('DatePicker1 changed: ', date)
                                              this.setState({createTime: date})
                                          }}
                                      />
                                  </div>
                              </div>
                          </div>
                          <div className="form-check form-check-inline">
                              <div className="form-group row">
                                  <label className="col-5 col-form-label">事件备注</label>
                                  <div className="col-7">
                                      <input className="form-control"
                                             type="text"
                                          value={this.state.data ? this.state.data.creatorName : ""}
                                      />
                                  </div>
                              </div>
                          </div>
                      </div>
                      <div className="modal-footer">
                          <button onClick={this.cancel} type="button" className="btn btn-secondary" data-dismiss="modal">取消</button>
                          <button onClick={this.accept} type="button" className="btn btn-primary">确认</button>
                      </div>
                  </div>
              </div>
          </div>
      )
  }
}

export default DialogForEvent;