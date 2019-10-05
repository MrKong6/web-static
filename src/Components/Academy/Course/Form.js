import React from 'react'
import ReactDOM from 'react-dom'

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import DialogTips from "../../Dialog/DialogTips";
import Gender from '../../Dic/Gender';
import Relation from '../../Dic/Relation';
import Grade from '../../Dic/Grade';
import CourseType from '../../Dic/CourseType';
import CourseName from '../../Dic/CourseName';
import Document from '../../Dic/Document';

import ajax from "../../../utils/ajax";
import fmtDate from "../../../utils/fmtDate";
import calculateAge from "../../../utils/calculateAge";

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      group: this.props.changedCrmGroup,
      birthday: null,
      age: 0,
      option: null,
      data: null
    };
    this.changeBirthday = this.changeBirthday.bind(this);
    this.createDialogTips = this.createDialogTips.bind(this);
    this.getFormValue = this.getFormValue.bind(this);
  }

  componentDidMount() {
    const request = async () => {
      try {
        let data = null;

        if (this.props.isEditor) {
          data = await ajax('/course/type/query.do', {id: this.props.editorId});
        } else {
        }

        this.setState({
          data
        }, () => {
          const keys = Object.keys(data);

          keys.map(key => {
            if (this.form[key]) {
                this.form[key].value = data[key];
            }
          })
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

    request()
  }

  componentWillUnmount() {
    if (this.tipsContainer) {
      document.body.removeChild(this.tipsContainer);
    }

    if (this.actContainer) {
      document.body.removeChild(this.actContainer);
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

  changeBirthday(day) {
    const birthday = day;
    const age = calculateAge(birthday);

    this.setState({birthday, age});
  }

  getFormValue() {
    if (!this.form.checkValidity()) {
      return
    }

    let query = {};

    for (let i = 0; i < this.form.length; i++) {
      if (this.form[i].name) {
        if (this.form[i].name === 'startDate' || this.form[i].name === 'endDate') {
          query[this.form[i].name] = new Date(this.form[i].value);
        } else {
          query[this.form[i].name] = this.form[i].value;
        }
      }
    }

    return query;
  }

  render() {

      return (
        <form ref={(dom) => {
          this.form = dom
        }}>
          <div className="row justify-content-md-center">
            <div className="col col-12">
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>课程类别
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="courseType" required={true}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>课程阶段
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="name" required={true}/>
                        </div>
                      </div>
                        <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">
                                <em className="text-danger">*</em>总课时
                            </label>
                            <div className="col-7">
                                <input type="text" className="form-control" name="classHour" required={true}/>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-5 col-form-label font-weight-bold">
                                <em className="text-danger">*</em>总课次
                            </label>
                            <div className="col-7">
                                <input type="text" className="form-control" name="classTime" required={true}/>
                            </div>
                        </div>
                    </div>
                    <div className="col"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      )
    }
}

export default Form;