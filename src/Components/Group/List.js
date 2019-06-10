import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'
import {$} from '../../vendor';

import DialogTips from "../Dialog/DialogTips";
import Commands from "../Commands/Commands";
import Progress from "../Progress/Progress"
import groupProcess from "../../utils/groupProcess";
import mainSize from "../../utils/mainSize";
import ajax from "../../utils/ajax";

const Table = ({list}) => {
  return (
    <table className="table table-bordered table-sm">
      <thead>
      <tr>
        <th>&nbsp;</th>
        <th>组织名称</th>
        <th>所在地区</th>
        <th>详细地址</th>
        <th>负责人</th>
        <th>联系电话</th>
      </tr>
      </thead>
      <tbody>{TableItem(list)}</tbody>
    </table>
  );
};

const TableItem = data => {
  let table = [];

  if (data.length === 0) {
    return table;
  }

  data.map(item => {
    const spacingStyle = {marginLeft: 26 * item.level + "px"};
    const childrenClass = item.children ? '' : 'not-child';
    const area = item.cState + " " + item.cCity + " " + item.cCounty;
    const addr = area + " " + item.cAddress;

    if (item.cName) {
      table.push(
        <tr key={item.cId} gid={item.cId} gname={item.cName} level={item.level}>
          <th scope="row">
            <div className="form-check">
              <label className="form-check-label">
                <input
                  className="form-check-input position-static"
                  type="radio"
                  name="org"
                  value={item.cId}
                />
              </label>
            </div>
          </th>
          <td>
            <p onClick={handleNode} className={'tree-node ' + childrenClass} style={spacingStyle}>{item.cName}</p>
          </td>
          <td>{area}</td>
          <td>{addr}</td>
          <td>{item.cOwner}</td>
          <td>{item.cOwnerPhone}</td>
        </tr>
      );
    }

    if (item.children && item.children.length) {
      let children = [];

      children.push(TableItem(item.children));
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

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list: [],
      isAnimating: true,
      redirectToReferrer: false,
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.addAction = this.addAction.bind(this);
    this.modAction = this.modAction.bind(this);
    this.delAction = this.delAction.bind(this);
  }

  componentDidMount() {
    const request = async () => {
      try {
        let list = await ajax('/sys/org/list.do');
        this.setState({list: groupProcess(list)});
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
    mainSize();
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

  addAction() {
    const selectedElem = $('table [name=org]:checked');

    if (this.state.isAnimating) {
      return;
    }

    const location = {
      pathname: `${this.props.match.url}/create`,
      state: {
        parentGroup: selectedElem.length ? {
          id: selectedElem.parents('tr').attr("gid"),
          name: selectedElem.parents('tr').attr("gname")
        } : null
      }
    };

    this.props.history.push(location);
  }

  modAction() {
    const selectedId = $('table [name=org]:checked').val();

    if (!selectedId || this.state.isAnimating) {
      return;
    }

    const targetPath = `${this.props.match.url}/${selectedId}`;

    this.props.history.push(targetPath);
  }

  delAction() {
    const selectedId = $('table [name=org]:checked').val();

    if (!selectedId || this.state.isAnimating) {
      return;
    }

    this.setState({isAnimating: true});

    const request = async () => {
      try {
        await ajax('/sys/org/del.do', {id: selectedId});
        let list = await ajax('/sys/org/list.do');
        this.setState({list: groupProcess(list)});
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
          <i className="fa fa-sitemap" aria-hidden="true"/>&nbsp;组织管理

          <Commands
            commands={this.props.commands}
            addAction={this.addAction}
            modAction={this.modAction}
            delAction={this.delAction}
          />
        </h5>
        <div id="main" className="main p-3">
          <Progress isAnimating={this.state.isAnimating}/>
          <Table list={this.state.list}/>
        </div>
      </div>
    );
  }
}

export default List;
