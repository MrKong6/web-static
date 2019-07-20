import React from 'react'
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DialogTips from "../Dialog/DialogTips";
import ajax from "../../utils/ajax";
import objectToArray from "../../utils/objectToArray";

class Age extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToReferrer: false,
      list: objectToArray(this.props.data) || [],
      ageYear : [],
      ageMonth : [],
      type : this.props.data,
    }
  }

  componentDidMount() {
    var ageYear = [];
    for(let i=0;i<19;i++){
        ageYear.push(i);
    }
    var ageMonth = [];
    for(let i=0;i<13;i++){
        ageMonth.push(i);
    }
    this.state.ageYear = ageYear;
    this.state.ageMonth = ageMonth;
    /*if (this.state.list.length) {
      return;
    }

    const request = async () => {
      try {
        let list = await ajax('/mkt/gender/list.do');

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
    };*/

    /*request()*/
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
    this.componentDidMount();
    if (this.state.redirectToReferrer) {
      return (
        <Redirect to={{
          pathname: '/login',
          state: {from: this.props.location}
        }}/>
      )
    }
    if(this.state.type == 1){
        return (
            <select className="form-control" name={this.props.name || "studentAgeYear"}>
                <option value="">年龄</option>
                {
                    this.state.ageYear.map(item => (
                        <option key={item} value={item}>{item}</option>
                    ))
                }
            </select>
        )
    }
      if(this.state.type == 2){
          return (
              <select className="form-control" name={this.props.name || "studentAgeMonth"}>
                  <option value="">月龄</option>
                  {
                      this.state.ageMonth.map(item => (
                          <option key={item} value={item}>{item}</option>
                      ))
                  }
              </select>
          )
      }

  }
}

export default Age;