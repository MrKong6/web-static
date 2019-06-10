import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtDate from '../../../utils/fmtDate';
import fmtTitle from '../../../utils/fmtTitle';
import CONFIG from '../../../utils/config';
import ajax from "../../../utils/ajax";

const Table = ({list, goto}) => {
  return (
    <table className="table table-bordered table-sm">
      <thead>
      <tr>
        <th>序号</th>
        <th>创建人</th>
        <th>创建时间</th>
        <th>所属组织</th>
        <th>所属用户</th>
        <th>合同类型</th>
        <th>合同编号</th>
        <th>签约时间</th>
        <th>到期时间</th>
        <th>学员姓名</th>
        <th>家长姓名</th>
        <th>联系电话</th>
        <th>课程类别</th>
        <th>课程</th>
        <th>合同金额</th>
        <th>折扣金额</th>
        <th>应付金额</th>
        <th>已付金额</th>
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

  data.map((item, index) => {
    table.push(
      <tr key={index}>
        <td>{index + 1}</td>
        <td>{item.creatorName}</td>
        <td>{fmtDate(item.createTime)}</td>
        <td>{item.orgName}</td>
        <td>{item.executiveName}</td>
        <td>{CONFIG.TYPE_ID[item.typeId]}</td>
        <td>
          <a onClick={goto} cid={item.id} href="javascript:;">{item.code}</a>
        </td>
        <td>{fmtDate(item.startDate)}</td>
        <td>{fmtDate(item.endDate)}</td>
        <td>{item.stuName}</td>
        <td>{item.parName}</td>
        <td>{item.parCellphone}</td>
        <td>{item.courseType}</td>
        <td>{item.courseName}</td>
        <td>{item.oriPrice}</td>
        <td>{item.discPrice}</td>
        <td>{item.finalPrice}</td>
        <td>{item.paid}</td>
      </tr>
    );
  });

  return table;
};

class List extends React.Component {
  constructor(props) {
    super(props);

    this.commands = this.props.commands.filter((command) => (command === 'Add'));
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
  }

  componentDidMount() {
    const request = async () => {
      try {
        let list = await ajax('/service/contract/list.do', {orgId: this.state.group.id});
        const ids = list.map((contract) => (contract.id));

        this.setState({list: list, ids: ids});
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
          let list = await ajax('/service/contract/list.do', {orgId: nextProps.changedCrmGroup.id});
          const ids = list.map((contract) => (contract.id));

          this.setState({
            group: nextProps.changedCrmGroup,
            list: list,
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
    const url = `${this.props.match.url}/${evt.target.getAttribute('cid')}`;

    this.props.history.push(url);
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