import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../../Dialog/DialogTips";
import Commands from "../../Commands/Commands";
import Progress from "../../Progress/Progress"

import mainSize from "../../../utils/mainSize";
import fmtDate from '../../../utils/fmtDate';
import fmtTitle from '../../../utils/fmtTitle';
import ajax from "../../../utils/ajax";

const Table = ({list, goto}) => {
  return (
    <table className="table table-bordered table-sm">
      <thead>
      <tr>
        <th>创建人</th>
        <th>创建时间</th>
        <th>所属组织</th>
        <th>所属用户</th>
        <th>来源</th>
        <th>渠道</th>
        <th>阶段</th>
        <th>状态</th>
        <th>学员姓名</th>
        <th>性别</th>
        <th>年龄</th>
        <th>在读年级</th>
        <th>所在学校</th>
        <th>家长姓名</th>
        <th>与学员关系</th>
        <th>电话号码</th>
        <th>微信号</th>
        <th>家庭住址</th>
        <th>课程类别</th>
        <th>课程产品</th>
        <th>备注</th>
        <th>沟通记录</th>
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
    table.push(
      <tr key={item.id}>
        <td>{item.creatorName}</td>
        <td>{fmtDate(item.createTime)}</td>
        <td>{item.organizationName}</td>
        <td>{item.executiveName}</td>
        <td>{item.sourceName}</td>
        <td>{item.channelName}</td>
        <td>{item.stageName}</td>
        <td>{item.statusName}</td>
        <td>
          <a onClick={goto} lid={item.id} href="javascript:;">{item.student.name}</a>
        </td>
        <td>{item.student.genderText !== 'null' ? item.student.genderText : '--'}</td>
        <td>{item.student.age !== 'null' ? item.student.age : '--'}</td>
        <td>{item.student.classGrade !== 'null' ? item.student.classGrade : '--'}</td>
        <td>{item.student.schoolName ? item.student.schoolName : '--'}</td>
        <td>
          <a onClick={goto} lid={item.id} href="javascript:;">{item.parent.name}</a>
        </td>
        <td>{item.parent.relation ? item.parent.relation : '--'}</td>
        <td>{item.parent.cellphone ? item.parent.cellphone : '--'}</td>
        <td>{item.parent.weichat ? item.parent.weichat : '--'}</td>
        <td>{item.parent.address ? item.parent.address : '--'}</td>
        <td>{item.courseType !== 'null' ? item.courseType : '--'}</td>
        <td>{item.courseName !== 'null' ? item.courseName : '--'}</td>
        <td>{item.note ? item.note : '--'}</td>
        <td>--</td>
      </tr>
    );
  });

  return table;
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
        let list = await ajax('/sales/oppor/list.do', {orgId: this.state.group.id, typeId: 2});
        const ids = list.map((leads) => (leads.id));

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
          let list = await ajax('/sales/oppor/list.do', {orgId: nextProps.changedCrmGroup.id, typeId: 2});
          const ids = list.map((leads) => (leads.id));

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
    const url = `${this.props.match.url}/${evt.target.getAttribute('lid')}`;

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