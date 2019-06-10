import React from 'react'
import {$} from "../../vendor";

import groupProcess from "../../utils/groupProcess";
import ajax from "../../utils/ajax";

const Group = ({list}) => {
  if (list.length) {
    return (
      <div className="tree">
        <ul>
          {GroupItem(list)}
        </ul>
      </div>
    );
  } else {
    return (
      <div className="dialog__body">数据加载中...</div>
    );
  }
};

const GroupItem = data => {
  let tree = [];

  data.map(item => {
    if (item.children && item.children.length) {
      let children = [];

      children.push(GroupItem(item.children));

      if (item.cName) {
        tree.push(
          <li key={item.cId}>
            {GroupItemContent(item)}
            <ul>{children}</ul>
          </li>
        );
      } else {
        tree.push(children);
      }
    } else {
      tree.push(
        <li key={item.cId}>{GroupItemContent(item)}</li>
      )
    }
  });

  return tree;
};

const GroupItemContent = data => {
  const nodeClass = 'tree-node ' + ((data.children && data.children.length) ? '' : 'not-child');

  return (
    <div className="hd">
      <i data-node className={nodeClass}/>
      <p data-o={data.cId} className="select"><span>{data.cName}</span></p>
    </div>
  )
};

const handleNode = (evt) => {
  if ($(evt.target).hasClass('not-child')) {
    return;
  }

  if ($(evt.target).hasClass('closed')) {
    $(evt.target)
      .removeClass('closed')
      .closest('li')
      .children('ul')
      .show();
  } else {
    $(evt.target)
      .closest('li')
      .find('[data-node]')
      .addClass('closed')
      .end()
      .closest('li')
      .find('ul')
      .hide();
  }
};

class DialogGroup extends React.Component {
  constructor(props) {
    super(props);

    this.dialogId = `d-${new Date().getTime()}`;
    this.state = {
      list: [],
      selected: null,
      errText: null
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.accept = this.accept.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  componentDidMount() {
    this.dialog = $(`#${this.dialogId}`);
    this.dialog
      .on('click', '[data-node]', handleNode)
      .on('click', '[data-o]', this.handleSelect);

    const request = async () => {
      try {
        let list = await ajax('/user/listOrgs.do');

        this.setState({list: groupProcess(list)}, () => {
          if (this.props.defaults) {
            this.dialog.find(`[data-o=${this.props.defaults}]`).trigger('click');
          }
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

  handleSelect(evt) {
    const elem = $(evt.target).data('o') ? $(evt.target) : $(evt.target).parent();
    let selected = null;

    if (elem.hasClass('selected')) {
      return;
    }

    this.dialog.find('[data-o]').removeClass('selected');
    elem.addClass('selected');

    selected = {
      id: elem.data('o').toString(),
      name: elem.children('span').text()
    };

    this.setState({selected})
  }

  accept() {
    if (this.state.selected === null) {
      return;
    }

    this.props.accept(this.state.selected);
    this.dialog.modal('hide');
  }

  cancel() {
    this.dialog.modal('hide');
  }

  render() {
    return (
      <div id={this.dialogId} className="modal fade" tabIndex="-1" role="dialog">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">请选择一个组织</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {
                this.state.errText ? <p>{this.state.errText}</p> : <Group list={this.state.list}/>
              }
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

export default DialogGroup;