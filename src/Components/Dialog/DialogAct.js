import React from 'react'
import {$} from "../../vendor";

import actProcess from "../../utils/actAndGroupProcess";
import ajax from "../../utils/ajax";

const Act = ({list, notRoot}) => {
  if (list === null) {
    return (
      <div className="dialog__body">数据加载中...</div>
    );
  }

  return (
    <div className="tree">
      <ul>
        {
          notRoot ? '' : (
            <li>
              <div className="hd">
                <p data-o="root" className="select"><span>作为一级活动</span></p>
              </div>
            </li>
          )
        }
        {ActItem(list)}
      </ul>
    </div>
  );
};

const ActItem = data => {
  let tree = [];

  if (!data.length) {
    return tree;
  }

  data.map(item => {
    if (item.children && item.children.length) {
      let children = [];

      children.push(ActItem(item.children));
      tree.push(
        <li key={item.id}>
          {ActItemContent(item)}
          <ul>{children}</ul>
        </li>
      );
    } else {
      tree.push(
        <li key={item.id}>{ActItemContent(item)}</li>
      )
    }
  });

  return tree;
};

const ActItemContent = data => {
  const nodeClass = 'tree-node ' + ((data.children && data.children.length) ? '' : 'not-child');

  if (data.type === 'act') {
    return (
      <div className="hd">
        <i data-node className={nodeClass}/>
        <p data-o={data.id} className="select"><span>{data.name}</span></p>
      </div>
    )
  }

  return (
    <div className="hd">
      <i data-node className={nodeClass}/>
      <p className="d-inline-block">{data.name}</p>
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

class DialogAct extends React.Component {
  constructor(props) {
    super(props);

    this.dialogId = `d-${new Date().getTime()}`;
    this.state = {
      group: this.props.changedCrmGroup,
      list: null,
      selected: null,
      errText: null,
      redirectToReferrer: false,
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
        let list = await ajax('/mkt/activity/listTree.do', {orgId: this.state.group.id});

        this.setState({list: actProcess(list, this.props.notRoot)}, () => {
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

  componentWillReceiveProps(nextProps) {
    if (this.props.changedCrmGroup !== nextProps.changedCrmGroup) {
      this.setState({
        group: nextProps.changedCrmGroup,
        selected: null,
      })
    }
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
              <h5 className="modal-title">请选择一个活动</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              {
                this.state.errText ? <p>{this.state.errText}</p> :
                  <Act list={this.state.list} notRoot={this.props.notRoot}/>
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

export default DialogAct;