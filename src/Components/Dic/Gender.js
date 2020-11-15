import React from 'react'
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../Dialog/DialogTips";
import ajax from "../../utils/ajax";
import objectToArray from "../../utils/objectToArray";

class Gender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      redirectToReferrer: false,
      list: this.props.data ? objectToArray(this.props.data) : [],
      type: this.props.type ? this.props.type : null,  //有值代表过滤未知性别
    }
  }

  componentDidMount() {
    if (this.state.list.length) {
      return;
    }

    const request = async () => {
      try {
        let list = await ajax('/mkt/gender/list.do',{filterNone:this.state.type});

        this.setState({list: objectToArray(list)});
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

  render() {
    // debugger
    if (this.state.redirectToReferrer) {
      return (
        <Redirect to={{
          pathname: '/login',
          state: {from: this.props.location}
        }}/>
      )
    }

    return (
      <select className="form-control" name={this.props.name || "studentGenderId"}>
        <option value="">请选择</option>
        {
          this.state.list.map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))
        }
      </select>
    )
  }
}

export default Gender;