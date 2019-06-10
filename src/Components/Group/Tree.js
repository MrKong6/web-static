import React from 'react'
import {$} from "../../vendor";

import groupProcess from "../../utils/groupProcess";
import ajax from "../../utils/ajax";

const Group = ({list, selected, loadingText}) => {
  if (list.length) {
    return (
      <ul>
        {GroupItem(list, selected)}
      </ul>
    );
  } else {
    if (loadingText) {
      return (
        <p>数据加载中...</p>
      );
    }

    return <div/>;
  }
};

const GroupItem = (data, selected) => {
  let tree = [];

  data.map(item => {
    if (item.children && item.children.length) {
      let children = [];

      children.push(GroupItem(item.children, selected));

      if (item.cName) {
        tree.push(
          <li key={item.cId}>
            {GroupItemContent(item, selected)}
            <ul>{children}</ul>
          </li>
        );
      } else {
        tree.push(children);
      }
    } else {
      tree.push(
        <li key={item.cId}>{GroupItemContent(item, selected)}</li>
      )
    }
  });

  return tree;
};

const GroupItemContent = (data, selected) => {
  const nodeClass = 'tree-node ' + ((data.children && data.children.length) ? '' : 'not-child');

  return (
    <div className="hd">
      <i onClick={handleNode} data-node className={nodeClass}/>
      <p onClick={selected} data-o={data.cId} className="select"><span>{data.cName}</span></p>
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

class Tree extends React.Component {
  constructor(props) {
    super(props);

    this.state = {list: [], errText: null};
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    this.tree = $("#tree");

    const request = async () => {
      try {
        let list = await ajax('/user/listOrgs.do');

        this.setState({list: groupProcess(list)}, () => {
          if (this.props.defaults) {
            this.tree.find(`[data-o=${this.props.defaults}]`).trigger('click');
          }
        });
      } catch (err) {
        if (err.errCode === 401) {
          this.setState({redirectToReferrer: true})
        } else {
          this.setState({errText: `${err.errCode}: ${err.errText}`});
        }
      }
    };

    request();
  }

  handleSelect(evt) {
    const elem = $(evt.target).data('o') ? $(evt.target) : $(evt.target).parent();

    if (elem.hasClass('selected')) {
      return;
    }

    this.tree.find('[data-o]').removeClass('selected');
    elem.addClass('selected');
    this.props.changed(elem.data('o').toString(), elem.children('span').text());
  }

  render() {
    return (
      <div id="tree" className="tree">
        {
          this.state.errText ? <p>{this.state.errText}</p> :
            <Group
              list={this.state.list}
              selected={this.handleSelect}
              loadingText={this.props.loadingText}
            />
        }
      </div>
    )
  }
}

export default Tree;