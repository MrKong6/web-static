import React from "react";
import ReactDOM from "react-dom";
import {Link, Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtDate from '../../../utils/fmtDate';
import calculateAge from '../../../utils/calculateAge';
import fmtTitle from '../../../utils/fmtTitle';
import CONFIG from '../../../utils/config';
import ajax from "../../../utils/ajax";

const Table = ({list, path}) => {
  return (
    <table className="table table-bordered table-sm">
      <thead>
      <tr>
        <th>序号</th>
        <th>学员姓名</th>
        <th>学员编号</th>
        <th>性别</th>
        <th>出生年月</th>
        <th>年龄</th>
        <th>证件类型</th>
        <th>证件号码</th>
        <th>在读年级</th>
        <th>所在学校</th>
      </tr>
      </thead>
      <tbody>{TableItem(list, path)}</tbody>
    </table>
  );
};

const TableItem = (data, path) => {
  let table = [];

  if (data.length === 0) {
    return table;
  }

  data.map((item, index) => {
    table.push(
      <tr key={index}>
        <td>{index + 1}</td>
        <td><Link to={`${path}/student/${item.id}`}>{item.name}</Link></td>
        <td>{item.code}</td>
        <td>{item.genderText}</td>
        <td>{fmtDate(item.birthday)}</td>
        <td>{calculateAge(fmtDate(item.birthday))}</td>
        <td>{CONFIG.DOCUMENT[item.idType]}</td>
        <td>{item.idCode}</td>
        <td>{item.schoolGrade}</td>
        <td>{item.schoolName}</td>
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
  }

  componentDidMount() {
    const request = async () => {
      try {
        let list = await ajax('/service/customer/student/list.do', {organizationId: this.state.group.id});

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
    mainSize()
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.changedCrmGroup.id !== nextProps.changedCrmGroup.id) {
      this.setState({isAnimating: true});

      const request = async () => {
        try {
          let list = await ajax('/service/customer/student/list.do', {organizationId: nextProps.changedCrmGroup.id});

          this.setState({
            group: nextProps.changedCrmGroup,
            list: list
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
          <Table list={this.state.list} path={this.props.match.url}/>
        </div>
      </div>
    )
  }
}

export default List;