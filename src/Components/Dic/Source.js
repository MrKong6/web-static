import React from 'react'
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../Dialog/DialogTips";
import ajax from "../../utils/ajax";

class Source extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      redirectToReferrer: false,
      list: this.props.data || []
    }
  }

  componentDidMount() {
    if (this.state.list.length) {
      return;
    }

    const request = async () => {
      try {
        let list = await ajax('/mkt/leads/source/list.do', {typeId: this.props.typeId});

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
      <select className="form-control" name="sourceId">
        {
          this.state.list.map(item => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))
        }
      </select>
    )
  }
}

export default Source;