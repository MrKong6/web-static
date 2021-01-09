import React from 'react'
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../Dialog/DialogTips";
import ajax from "../../utils/ajax";

class Org extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      redirectToReferrer: false,
        orgList: []
    }
  }

  componentDidMount() {
    if (this.state.orgList.length) {
      return;
    }

    const request = async () => {
      try {
          let orgList = await ajax('/user/listOrgs.do');

        this.setState({orgList})
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
        <div className="form-group row">
            <label className="col-5 col-form-label font-weight-bold">所属组织</label>
            <div className="col-7">
                <select className="form-control"
                        name="orgId">
                    <option value="">请选择</option>
                    {
                        this.state.orgList ? this.state.orgList.map(item => (
                            <option key={item.cId}
                                    value={item.cId}>{item.cName}({item.cName})</option>
                        )) : null
                    }
                </select>
            </div>
        </div>
    )
  }
}

export default Org;