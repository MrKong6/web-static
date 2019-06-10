import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import Tree from '../Group/Tree';
import DialogTips from "../Dialog/DialogTips";
import Commands from "../Commands/Commands";
import Progress from "../Progress/Progress"

import mainSize from "../../utils/mainSize";
import ajax from "../../utils/ajax";
import {$} from "../../vendor";

const Table = ({list}) => {
  if (list.length) {
    return (
      <table className="table table-bordered table-sm">
        <thead>
        <tr>
          <th>&nbsp;</th>
          <th>角色职能</th>
          <th>角色职级</th>
          <th>角色名称</th>
          <th>角色描述</th>
        </tr>
        </thead>
        <tbody>
        {
          list.map((role) => (
            <tr key={role.cId} rid={role.cId}>
              <th scope="row">
                <div className="form-check">
                  <label className="form-check-label">
                    <input
                      className="form-check-input position-static"
                      type="radio"
                      name="role"
                      value={role.cId}
                    />
                  </label>
                </div>
              </th>
              <td>
                {
                  role.rootFuncs.map(func => (func.cNameShort)).join(", ")
                }
              </td>
              <td>{role.cRankName}</td>
              <td>{role.cName}</td>
              <td>{role.cDesc ? role.cDesc : "--"}</td>
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
        <th>角色职能</th>
        <th>角色职级</th>
        <th>角色名称</th>
        <th>角色描述</th>
      </tr>
      </thead>
      <tbody></tbody>
    </table>
  )
};

class List extends React.Component {
  constructor(props) {
    super(props);

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
        let list = await ajax('/sys/role/list.do', {id: groupId});
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
    const selectedId = $('table [name=role]:checked').val();

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
    const selectedId = $('table [name=role]:checked').val();

    if (!selectedId || this.state.isAnimating) {
      return;
    }

    this.setState({isAnimating: true});

    const request = async () => {
      try {
        await ajax('/sys/role/del.do', {id: selectedId});
        let list = this.state.list.filter((role) => (role.cId !== selectedId));
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
          <i className="fa fa-sitemap" aria-hidden="true"/>&nbsp;角色管理

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

              <Table list={this.state.list}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default List