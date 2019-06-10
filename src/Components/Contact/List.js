import React from 'react'
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'
import {$} from '../../vendor';

import DialogTips from "../Dialog/DialogTips";
import Approach from '../Dic/Approach';
import ajax from "../../utils/ajax";
import fmtDate from '../../utils/fmtDate';

const TableTitle = ({canEdit}) => {
  const base = [
    {key: 'index', name: '序号'},
    {key: 'approachName', name: '沟通方式'},
    {key: 'datetime', name: '咨询时间'},
    {key: 'orgName', name: '所属组织'},
    {key: 'executiveName', name: '所属用户'},
    {key: 'summary', name: '备注'}
  ];

  if (canEdit === true) {
    base.push({
      key: 'action',
      name: '操作'
    })
  }

  return (
    <tr>{base.map(item => (<th key={item.key}>{item.name}</th>))}</tr>
  )
};

const TableControl = ({canEdit, groupName, userName, action}) => {
  if (!canEdit) {
    return null;
  }

  return (
    <tr>
      <td>--</td>
      <td>
        <Approach/>
      </td>
      <td>--</td>
      <td>{groupName}</td>
      <td>{userName}</td>
      <td>
        <input type="text" className="form-control" name="summary"/>
      </td>
      <td>
        <button
          type="button"
          className="btn btn-primary"
          onClick={action}
        >保存
        </button>
      </td>
    </tr>
  )
};

const TableItems = ({list, canEdit, action}) => {
  if (!list.length) {
    return null;
  }

  return (
    list.map((item, index) => (
      <tr cid={item.id}>
        <td>{index + 1}</td>
        <td>
          <div className="view">{item.approachName}</div>
          <div className="edit" style={{display: 'none'}}>
            <Approach/>
          </div>
        </td>
        <td>{fmtDate(item.datetime)}</td>
        <td>{item.orgName}</td>
        <td>{item.executiveName}</td>
        <td>
          <div className="view">{item.summary}</div>
          <div className="edit" style={{display: 'none'}}>
            <input type="text" className="form-control" name="summary"/>
          </div>
        </td>
        {
          canEdit ? <td>
            <button
              type="button"
              className="btn btn-primary"
              aid={item.approachId}
              summary={item.summary}
              onClick={toggleEditor}
            >编辑
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={action}
              style={{display: 'none'}}
            >保存
            </button>
          </td> : null
        }
      </tr>
    ))
  )
};

const toggleEditor = (evt) => {
  const elem = $(evt.target).parents('tr');
  const aid = $(evt.target).attr('aid');
  const summary = $(evt.target).attr('summary');

  $(evt.target).toggle();
  $(evt.target).siblings().toggle();
  elem.find('.view').toggle();
  elem.find('.edit').toggle();
  elem.find('select').val(aid);
  elem.find('input').val(summary);
};

class List extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToReferrer: false,
      id: this.props.id,
      groupName: this.props.groupName,
      userName: this.props.userName,
      canEdit: this.props.canEdit,
      list: []
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.addContact = this.addContact.bind(this);
    this.modContact = this.modContact.bind(this);
  }

  componentDidMount() {
    const request = async () => {
      try {
        let list = await ajax('/contact/list.do', {leadsId: this.state.id});

        this.setState({list})
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

    request()
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

  addContact(evt) {
    const elem = $(evt.target).parents('tr');
    let query = {};

    query.leadsId = this.state.id;
    query.approachId = elem.find('select').val();
    query.summary = elem.find('input').val();

    const request = async () => {
      try {
        await ajax('/contact/add.do', query);
        let list = await ajax('/contact/list.do', {leadsId: this.state.id});

        this.setState({list});
        elem.find('input').val('');
      } catch (err) {
        if (err.errCode === 401) {
          this.setState({redirectToReferrer: true})
        } else {
          this.createDialogTips(`${err.errCode}: ${err.errText}`);
        }
      }
    };

    request()
  }

  modContact(evt) {
    const elem = $(evt.target).parents('tr');
    const approachName = elem.find('select')[0].options[elem.find('select')[0].selectedIndex].text;
    let query = {};

    query.leadsId = this.state.id;
    query.approachId = elem.find('select').val();
    query.summary = elem.find('input').val();
    query.id = elem.attr('cid');

    const request = async () => {
      try {
        await ajax('/contact/mod.do', query);
        const list = this.state.list.map(item => {
          if (item.id === query.id) {
            item.approachId = query.approachId;
            item.approachName = approachName;
            item.summary = query.summary;
          }

          return item;
        });

        this.setState({list}, () => {
          $(evt.target).toggle();
          $(evt.target).siblings().toggle();
          elem.find('.view').toggle();
          elem.find('.edit').toggle();
        });
      } catch (err) {
        if (err.errCode === 401) {
          this.setState({redirectToReferrer: true})
        } else {
          this.createDialogTips(`${err.errCode}: ${err.errText}`);
        }
      }
    };

    request()
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

    if (!this.state.canEdit && !this.state.list.length) {
      return null;
    }

    return (
      <div>
        <p className="ht pt-3 pb-3 b-t b-b">沟通记录</p>
        <table className="table table-bordered table-sm">
          <thead>
          <TableTitle canEdit={this.state.canEdit}/>
          </thead>
          <tbody>
          <TableControl
            canEdit={this.state.canEdit}
            groupName={this.state.groupName}
            userName={this.state.userName}
            action={this.addContact}
          />
          <TableItems
            list={this.state.list}
            canEdit={this.state.canEdit}
            action={this.modContact}
          />
          </tbody>
        </table>
      </div>
    )
  }
}

export default List;