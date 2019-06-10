import React from 'react'
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'
import {$} from "../../vendor";

import DialogGroup from './DialogGroup';
import ajax from "../../utils/ajax";

class DialogUser extends React.Component {
  constructor(props) {
    super(props);

    this.dialogId = `d-${new Date().getTime()}`;
    this.state = {
      groupId: this.props.defaults.groupId,
      groupName: this.props.defaults.groupName,
      list: [],
      userId: '',
      userName: '',
      redirectToReferrer: false,
    };
    this.createGroupsDialog = this.createGroupsDialog.bind(this);
    this.acceptGroupDialog = this.acceptGroupDialog.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.accept = this.accept.bind(this);
    this.cancel = this.cancel.bind(this);
    this.closed = this.closed.bind(this);
  }

  componentDidMount() {
    this.dialog = $(`#${this.dialogId}`);
    this.dialog.on('hidden.bs.modal', () => {
      this.closed();
    });

    const request = async () => {
      try {
        let list = await ajax(this.props.path, {orgId: this.state.groupId});

        this.setState({
          list: list,
          userId: this.props.defaults.userId,
          userName: this.props.defaults.userName
        });
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
    this.props.accept({
      group: {
        id: this.state.groupId,
        name: this.state.groupName
      },
      user: {
        id: this.state.userId,
        name: this.state.userName
      }
    });
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
              {
                this.state.errText ? <div className="alert alert-danger" role="alert">{this.state.errText}</div> : null
              }
              <div className="form-group">
                <label>所属组织</label>
                <div className="input-group">
                  <input type="text" className="form-control" value={this.state.groupName} readOnly={true}/>
                  <span className="input-group-btn">
                    <button onClick={this.createGroupsDialog} className="btn btn-secondary" type="button">
                      <i className="fa fa-pencil-square-o fa-lg" aria-hidden="true"/>
                    </button>
                  </span>
                </div>
              </div>
              <div className="form-group">
                <label>所属用户</label>
                <select className="form-control" onChange={this.handleSelect} value={this.state.userId}>
                  <option value="">请选择</option>
                  {
                    this.state.list.map((user) => (
                      <option value={user.cId}>{user.cRealName}</option>
                    ))
                  }
                </select>
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

export default DialogUser;