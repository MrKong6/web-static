import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'
import {$} from "../../../vendor";

import DialogTips from "../../Dialog/DialogTips";
import Commands from "../../Commands/Commands";
import Progress from "../../Progress/Progress"

import actProcess from "../../../utils/actProcess";
import mainSize from "../../../utils/mainSize";
import fmtDate from '../../../utils/fmtDate';
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";


const Table = ({list, goto}) => {
  return (
    <table className="table table-bordered table-sm">
      <thead>
      <tr>
        <th>序号(ID)</th>
        <th>创建人</th>
        <th>创建时间</th>
        <th>活动名称</th>
        <th>开始时间</th>
        <th>结束时间</th>
        <th>预计花费</th>
        <th>实际花费</th>
        <th>获取线索量</th>
        <th>转化机会量</th>
        <th>签约客户量</th>
        <th>签约客户金额</th>
        <th>ROI</th>
      </tr>
      </thead>
      <tbody>{TableItem(list, goto)}</tbody>
    </table>
  );
};

const TableItem = (data, goto) => {
  let table = [];

  if (data.length === 0) {
    return table;
  }

  data.map(item => {
    const spacingStyle = {marginLeft: 26 * item.level + "px"};
    const childrenClass = item.children ? '' : 'not-child';

    table.push(
      <tr key={item.id} level={item.level}>
        <td>{item.id}</td>
        <td>{item.creatorName}</td>
        <td>{fmtDate(item.createTime)}</td>
        <td>
          <p onClick={handleNode} className={'tree-node ' + childrenClass} style={spacingStyle}>
            <a onClick={goto} aid={item.id} href="javascript:;">{item.name}</a>
          </p>
        </td>
        <td>{fmtDate(item.startDate)}</td>
        <td>{fmtDate(item.endDate)}</td>
        <td>{item.budget}</td>
        <td>{item.cost}</td>
        <td>{item.leads}</td>
        <td>{item.opportunities}</td>
        <td>{item.contracts}</td>
        <td>{item.totalAmount}</td>
        <td>{item.roi}</td>
      </tr>
    );

    if (item.children && item.children.length) {
      let children = [];

      children.push(TableItem(item.children, goto));
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

    this.commands = this.props.commands.filter(command => (command.name === 'Add'));
    this.title = fmtTitle(this.props.location.pathname);
    this.state = {
      group: this.props.changedCrmGroup,
      list: [],
      ids: [],
      isAnimating: true,
      redirectToReferrer: false,
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.goToDetails = this.goToDetails.bind(this);
    this.addAction = this.addAction.bind(this);
  }

  componentDidMount() {
    const request = async () => {
      try {
        let list = await ajax('/mkt/activity/list.do', {organizationId: this.state.group.id});
        const ids = list.map((act) => (act.id));

        this.setState({list: actProcess(list), ids: ids});
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

  componentWillReceiveProps(nextProps) {
    if (this.props.changedCrmGroup.id !== nextProps.changedCrmGroup.id) {
      this.setState({isAnimating: true});

      const request = async () => {
        try {
          let list = await ajax('/mkt/activity/list.do', {organizationId: nextProps.changedCrmGroup.id});
          const ids = list.map((act) => (act.id));

          this.setState({
            group: nextProps.changedCrmGroup,
            list: actProcess(list),
            ids: ids
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

  goToDetails(evt) {
    const url = `${this.props.match.url}/${evt.target.getAttribute('aid')}`;

    this.props.history.push(url, {ids: this.state.ids});
  }

  addAction() {
    this.props.history.push(`${this.props.match.url}/create`, {ids: this.state.ids});
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
          <i className={`fa ${this.title.icon}`} aria-hidden="true"/>&nbsp;{this.title.text}

          <Commands
            commands={this.commands}
            addAction={this.addAction}
          />
        </h5>
        <div id="main" className="main p-3">
          <Progress isAnimating={this.state.isAnimating}/>
          <Table list={this.state.list} goto={this.goToDetails}/>
        </div>
      </div>
    )
  }
}

export default List;