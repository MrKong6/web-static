import React from "react";
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'

import Tree from '../Group/Tree';
import DialogTips from "../Dialog/DialogTips";
import Commands from "../Commands/Commands";
import Progress from "../Progress/Progress"

import mainSize from "../../utils/mainSize";
import ajax from "../../utils/ajax";
import {$} from "../../vendor";

const Table = ({list, changedState, groupId}) => {
  if (list.length) {
    return (
      <table className="table table-bordered table-sm">
        <thead>
        <tr>
          <th>&nbsp;</th>
          <th>状态</th>
          <th>用户名</th>
          <th>姓名</th>
          <th>昵称</th>
          <th>电话号码</th>
          <th>电子邮件</th>
          <th>IM(QQ)</th>
          <th>用户角色</th>
        </tr>
        </thead>
        <tbody>
        {
          list.map((user) => (
            <tr key={user.cId} uid={user.cId}>
              <th scope="row">
                <div className="form-check">
                  <label className="form-check-label">
                    <input
                      className="form-check-input position-static"
                      type="radio"
                      name="user"
                      value={user.cId}
                    />
                  </label>
                </div>
              </th>
              <td>
                <div className="switch">
                  <input
                    type="checkbox"
                    id={`switch-${user.cId}`}
                    name={`switch-${user.cId}`}
                    value={user.cId}
                    onChange={changedState}
                    checked={user.cAvailable}
                  />
                  <label htmlFor={`switch-${user.cId}`}/>
                </div>
              </td>
              < td> {user.cLoginName}</td>
              <td>{user.cRealName}</td>
              <td>{user.cNickName}</td>
              <td>{user.cPhone}</td>
              <td>{user.cEmail}</td>
              <td>{user.cQq}</td>
              <td>
                {
                  user.roles.map((role) => {
                    return (
                      <Link
                        className="btn btn-link"
                        to={{
                          pathname: `/permissions`,
                          state: {
                            groupId: groupId,
                            roleId: role.cId,
                            roleName: role.cName
                          }
                        }}
                      >
                        {role.cName}
                      </Link>
                    )
                  })
                }
              </td>
            </tr>
          ))
        }
        </tbody>
      </table>
    );
  }

  return (
    <table className="table table-bordered table-sm">
      <thead>
      <tr>
        <th>&nbsp;</th>
        <th>状态</th>
        <th>用户名</th>
        <th>姓名</th>
        <th>昵称</th>
        <th>电话号码</th>
        <th>电子邮件</th>
        <th>IM(QQ)</th>
        <th>用户角色</th>
      </tr>
      </thead>
      <tbody></tbody>
    </table>
  )
};

class List extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isAnimating: true,
      redirectToReferrer: false,
      groupId: this.props.location.state && this.props.location.state.groupId ? this.props.location.state.groupId : this.props.profile.org.cId,
      groupName: this.props.location.state && this.props.location.state.groupId ? this.props.location.state.groupId : this.props.profile.org.cName,

      list: []
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.changedGroup = this.changedGroup.bind(this);
    this.addAction = this.addAction.bind(this);
    this.modAction = this.modAction.bind(this);
    this.delAction = this.delAction.bind(this);
    this.changedState = this.changedState.bind(this);
  }

  componentDidMount() {
    mainSize()
  }

  componentWillUnmount() {
    if (this.tipsContainer) {
      document.body.removeChild(this.tipsContainer);
    }
  }

  changedGroup(groupId, groupName) {
    this.setState({
      isAnimating: true,
      groupId: groupId,
      groupName: groupName
    });

    const request = async () => {
      try {
        let list = await ajax('/org/listUsers.do', {id: groupId});
        this.setState({list: list});
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

  addAction() {
    const location = {
      pathname: `${this.props.match.url}/create`,
      state: {
        groupId: this.state.groupId,
        groupName: this.state.groupName
      }
    };

    this.props.history.push(location);
  }

  modAction() {
    const selectedId = $('table [name=user]:checked').val();

    if (!selectedId || this.state.isAnimating) {
      return;
    }

    const location = {
      pathname: `${this.props.match.url}/${selectedId}`,
      state: {
        groupId: this.state.groupId,
        groupName: this.state.groupName
      }
    };

    this.props.history.push(location);
  }

  delAction() {
    const selectedId = $('table [name=user]:checked').val();

    if (!selectedId || this.state.isAnimating) {
      return;
    }

    this.setState({isAnimating: true});

    const request = async () => {
      try {
        await ajax('/sys/user/del.do', {id: selectedId});
        let list = this.state.list.filter((user) => (user.cId !== selectedId));
        this.setState({list: list});
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

  changedState(evt) {
    let enabled;
    const id = evt.target.id.split("-")[1];
    const oldList = this.state.list.map((item) => (item));
    const updateList = oldList.map((item) => {
      if (item.cId === id) {
        item.cAvailable = !item.cAvailable;
        enabled = item.cAvailable;
      }

      return item;
    });

    this.setState({isAnimating: true, list: updateList});

    const request = async () => {
      try {
        await ajax('/sys/user/enable.do', {id, enabled});
      } catch (err) {
        if (err.errCode === 401) {
          this.setState({redirectToReferrer: true})
        } else {
          this.createDialogTips(`${err.errCode}: ${err.errText}`);
          this.setState({list: oldList});
        }
      } finally {
        this.setState({isAnimating: false});
      }
    };

    request();
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
          <i className="fa fa-sitemap" aria-hidden="true"/>&nbsp;用户管理

          <Commands
            commands={this.props.commands}
            addAction={this.addAction}
            modAction={this.modAction}
            delAction={this.delAction}
          />
        </h5>
        <div id="main" className="main p-3">
          <Progress isAnimating={this.state.isAnimating}/>

          <div className="row">
            <div className="col-12 col-lg-5 col-xl-4">
              <Tree
                defaults={this.state.groupId}
                loadingText={false}
                changed={this.changedGroup}
              />
            </div>
            <div className="col-12 col-lg-7 col-xl-8">
              <p className={'h6 pb-3 mb-0'}>{this.state.groupName}</p>

              <Table
                list={this.state.list}
                changedState={this.changedState}
                groupId={this.state.groupId}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default List