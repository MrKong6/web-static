import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom';
import {$} from '../../vendor';

import Tree from '../Group/Tree';
import DialogTips from "../Dialog/DialogTips";
import Commands from "../Commands/Commands";
import Progress from "../Progress/Progress"

import mainSize from "../../utils/mainSize";
import ajax from "../../utils/ajax";
import permissionsProcess from "../../utils/permissionsProcess"


const Table = ({list, selectedFunc, changedFunc}) => {
  if (!list.length) {
    return null;
  }

  return (
    <table className="table table-bordered table-sm">
      <thead>
      <tr>
        <th>系统菜单</th>
        <th>选取</th>
        <th>功能权限</th>
      </tr>
      </thead>
      <tbody>{TableItem(list, selectedFunc, changedFunc)}</tbody>
    </table>
  );
};

const TableItem = (data, selectedFunc, changedFunc) => {
  let table = [];

  if (data.length === 0) {
    return table;
  }

  data.map(item => {
    const level = item.cId.split('-').length - 1;
    const spacingStyle = {marginLeft: 26 * level + "px", whiteSpace: 'nowrap'};
    const childrenClass = item.children ? '' : 'not-child';
    let func = [];

    if (item.action) {
      func = item.action.map((func) => (
        <div key={func.cId} className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="checkbox"
            value={func.cId}
            id={func.cId}
            onChange={changedFunc}
            checked={selectedFunc.includes(func.cId)}
          />
          <label className="form-check-label" htmlFor={func.cId}>
            {func.cNameLong}
          </label>
        </div>
      ))
    }

    table.push(
      <tr key={item.cId} gid={item.cId} gname={item.cName} level={level}>
        <td>
          <p onClick={handleNode} className={'tree-node ' + childrenClass} style={spacingStyle}>{item.cNameLong}</p>
        </td>
        <td>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="checkbox"
              id={item.cId}
              value={item.cId}
              onChange={changedFunc}
              checked={selectedFunc.includes(item.cId)}
            />
          </div>
        </td>
        <td>{func}</td>
      </tr>
    );

    if (item.children && item.children.length) {
      let children = [];

      children.push(TableItem(item.children, selectedFunc, changedFunc));
      table.push(children);
    }
  });

  return table;
};

const handleNode = (evt) => {
  if ($(evt.target).hasClass('not-child')) {
    return;
  }

  const tr = $(evt.target).parents("tr");
  const level = parseInt(tr.attr('level'));
  const children = tr.nextAll('tr').filter((i, item) => (
    $(item).attr('level') > level
  ));

  children.map((i, item) => {
    const childrenLevel = parseInt($(item).attr('level'));

    if ($(evt.target).hasClass('closed')) {
      if (childrenLevel === (level + 1)) {
        $(item).show();
      }
    } else {
      $(item)
        .hide()
        .find('.tree-node')
        .addClass('closed');
    }
  });

  $(evt.target).toggleClass('closed');
};

class Permissions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isAnimating: false,

      groupId: this.props.location.state && this.props.location.state.groupId ? this.props.location.state.groupId : this.props.profile.org.cId,
      groupName: this.props.location.state && this.props.location.state.groupId ? null : this.props.profile.org.cName,

      selectedRole: this.props.location.state && this.props.location.state.roleId ? this.props.location.state.roleId : null,
      selectedRoleText: this.props.location.state && this.props.location.state.roleName ? this.props.location.state.roleName : null,
      selectedFunc: [],

      roles: [],
      list: []
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.changedFilter = this.changedFilter.bind(this);
    this.changedGroup = this.changedGroup.bind(this);
    this.changedRole = this.changedRole.bind(this);
    this.changedFunc = this.changedFunc.bind(this);
    this.updated = this.updated.bind(this);
  }

  componentDidMount() {
    mainSize()
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

  changedFilter({groupId, roleId, roleName}) {
    this.setState({
      isAnimating: true
    });

    const request = async () => {
      try {
        let roles = this.state.roles;
        let selectedRole = this.state.selectedRole;
        let selectedRoleText = this.state.selectedRoleText;
        let selectedFunc = [];
        let list = [];

        if (groupId) {
          roles = await ajax('/org/listRoles.do', {id: groupId});

          if (!selectedRole) {
            selectedRole = roles.length ? roles[0].cId : null;
            selectedRoleText = roles.length ? roles[0].cName : null;
          }
        }

        if (roleId) {
          selectedRole = roleId;
          selectedRoleText = roleName;
        }

        if (selectedRole) {
          let selectedRoleDetails = await ajax('/role/query.do', {id: selectedRole});
          selectedFunc = selectedRoleDetails.functions.map(funcs => (funcs.cId));
          const selectedRoleAllFunc = selectedRoleDetails.rootFuncs.map(funcs => (funcs.cId));
          list = await ajax('/func/list.do', {ids: selectedRoleAllFunc.join(',')});
        }

        this.setState({
          selectedRole,
          selectedRoleText,
          selectedFunc,
          roles,
          list: list.length ? permissionsProcess(list) : list
        });
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

  changedGroup(groupId, groupName) {
    if (this.state.groupId !== groupId) {
      this.setState({
        groupId: groupId,
        groupName: groupName,
        selectedRole: null,
        selectedRoleText: null,
        selectedFunc: [],

        roles: [],
        list: []
      }, () => {
        this.changedFilter({groupId})
      });

      return;
    }

    this.changedFilter({groupId})
  }

  changedRole(evt) {
    this.setState({
      selectedRole: evt.target.getAttribute("rid"),
      selectedRoleText: evt.target.textContent
    });

    this.changedFilter({
      roleId: evt.target.getAttribute("rid"),
      roleName: evt.target.textContent
    })
  }

  changedFunc(evt) {
    let tempFunc = [];

    if (this.state.selectedFunc.includes(evt.target.value)) {
      tempFunc = this.state.selectedFunc.filter((func) => (func !== evt.target.value));
    } else {
      tempFunc = tempFunc.concat(this.state.selectedFunc);
      tempFunc.push(evt.target.value);
    }

    this.setState({selectedFunc: tempFunc})
  }

  updated() {
    if (this.state.isAnimating || !this.state.selectedRole || !this.state.selectedFunc.length) {
      return;
    }

    this.setState({isAnimating: true});
    const request = async () => {
      try {
        await ajax('/sys/role/auth.do', {
          id: this.state.selectedRole,
          funcIds: this.state.selectedFunc.join(',')
        });
        this.createDialogTips('更新成功，权限修改成功后，用户需要重新登陆才能生效。');
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

    const groupCommands = this.props.commands.find(item => (item.rule.test(this.props.location.pathname) === true));

    return (
      <div>
        <h5 id="subNav">
          <i className="fa fa-shield" aria-hidden="true"/>&nbsp;权限管理

          <Commands
            commands={groupCommands.commands}
            authAction={this.updated}
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
            <div className="col-12 col-lg-2">
              {
                this.state.roles.map((role) => (
                  <p
                    key={role.cId}
                    rid={role.cId}
                    className={`${this.state.selectedRole === role.cId ? 'text-light bg-primary' : 'text-dark'} m-0 p-1`}
                    onClick={this.changedRole}
                  >
                    {role.cName}
                  </p>
                ))
              }
            </div>
            <div className="col-12 col-lg-5 col-xl-6">
              <p className={'h6 pb-3 mb-0'}>{this.state.selectedRoleText || ''}</p>

              <Table
                list={this.state.list}
                selectedFunc={this.state.selectedFunc}
                changedFunc={this.changedFunc}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Permissions;