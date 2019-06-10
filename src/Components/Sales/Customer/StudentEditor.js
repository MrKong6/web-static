import React from "react";
import ReactDOM from "react-dom";
import {Redirect} from 'react-router-dom'

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import Gender from '../../Dic/Gender';
import Grade from '../../Dic/Grade';
import Document from '../../Dic/Document';
import DialogTips from "../../Dialog/DialogTips";
import Progress from "../../Progress/Progress"

import historyBack from "../../../utils/historyBack";
import mainSize from "../../../utils/mainSize";
import ajax from "../../../utils/ajax";
import fmtTitle from "../../../utils/fmtTitle";
import calculateAge from "../../../utils/calculateAge";

class StudentEditor extends React.Component {
  constructor(props) {
    super(props);

    this.title = fmtTitle(this.props.location.pathname);
    this.state = {
      group: this.props.changedCrmGroup,
      redirectToReferrer: false,
      redirectToList: false,
      isAnimating: false,
      isUpdated: false,
      id: this.props.match.params.studentId,
      data: null
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.updated = this.updated.bind(this);
  }

  componentDidMount() {
    const request = async () => {
      try {
        let gender = await ajax('/mkt/gender/list.do');
        let data = await ajax('/sales/customer/student/query.do', {id: this.state.id});

        const birthday = new Date(data.birthday);
        const age = calculateAge(birthday);

        this.setState({
          option: {gender},
          data,
          birthday,
          age
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

    request();
    mainSize();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.changedCrmGroup.id !== nextProps.changedCrmGroup.id) {
      this.setState({redirectToList: true})
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

  updated() {
    if (!this.form.checkValidity()) {
      return
    }

    let query = {};

    query.id = this.state.id;
    query.stuBirthday = this.state.birthday;

    for (let i = 0; i < this.form.length; i++) {
      if (this.form[i].name) {
        query[this.form[i].name] = this.form[i].value;
      }
    }

    this.setState({isAnimating: true});

    const request = async () => {
      try {
        await ajax('/sales/customer/student/mod.do', query);
        this.setState({isUpdated: true})
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

  render() {
    if (this.state.redirectToReferrer) {
      return (
        <Redirect to={{
          pathname: '/login',
          state: {from: this.props.location}
        }}/>
      )
    }

    if (this.state.redirectToList) {
      return (
        <Redirect to="/sales/customer"/>
      )
    }

    if (this.state.isUpdated) {
      return (
        <Redirect to={{
          pathname: `/sales/customer/student/${this.state.id}`,
        }}/>
      )
    }

    if (!this.state.option || (!this.state.data)) {
      return (
        <div>
          <h5 id="subNav">
            <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
            &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
            <p className="d-inline text-muted">{this.title.text}编辑</p>
            <div className="btn-group float-right" role="group">
              <button onClick={() => {
                historyBack(this.props.history)
              }} type="button" className="btn btn-light">取消
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                onClick={this.updated}
                disabled={this.state.isAnimating}
              >
                保存
              </button>
            </div>
          </h5>

          <div id="main" className="main p-3">
            <div className="row justify-content-md-center">
              <div className="col col-12">
                <div className="card">
                  <div className="card-body">数据加载中...</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div>
        <h5 id="subNav">
          <i className={`fa ${this.title.icon}`} aria-hidden="true"/>
          &nbsp;{this.title.text}&nbsp;&nbsp;|&nbsp;&nbsp;
          <p className="d-inline text-muted">{this.title.text}编辑</p>
          <div className="btn-group float-right" role="group">
            <button onClick={() => {
              historyBack(this.props.history)
            }} type="button" className="btn btn-light">取消
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              onClick={this.updated}
              disabled={this.state.isAnimating}
            >
              保存
            </button>
          </div>
        </h5>

        <div id="main" className="main p-3">
          <Progress isAnimating={this.state.isAnimating}/>

          <form ref={(dom) => {
            this.form = dom
          }}>
            <div className="row justify-content-md-center">
              <div className="col col-12">
                <div className="card">
                  <div className="card-body">
                    <p className="ht pb-3 b-b">学员信息</p>
                    <div className="row">
                      <div className="col">
                        <div className="form-group row">
                          <label className="col-5 col-form-label font-weight-bold">
                            <em className="text-danger">*</em>学员姓名
                          </label>
                          <div className="col-7">
                            <input type="text" className="form-control" name="name" required={true}/>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-5 col-form-label font-weight-bold">学员姓别</label>
                          <div className="col-7">
                            <Gender data={this.state.option.gender} name="genderId"/>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-5 col-form-label font-weight-bold">
                            <em className="text-danger">*</em>出生年月
                          </label>
                          <div className="col-7">
                            <DayPickerInput
                              value={this.state.birthday}
                              dayPickerProps={{
                                initialMonth: this.state.birthday
                              }}
                              onDayChange={day => {
                                this.changeBirthday(day)
                              }}
                            />
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-5 col-form-label font-weight-bold">
                            <em className="text-danger">*</em>学员年龄
                          </label>
                          <div className="col-7">
                            <input type="text" className="form-control" name="stuAge"
                                   value={this.state.age ? this.state.age : ''} readOnly={true}/>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-5 col-form-label font-weight-bold">
                            <em className="text-danger">*</em>在读年级
                          </label>
                          <div className="col-7">
                            <Grade name="classGrade"/>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-5 col-form-label font-weight-bold">
                            <em className="text-danger">*</em>所在学校
                          </label>
                          <div className="col-7">
                            <input type="text" className="form-control" name="schoolName" required={true}/>
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div className="form-group row">
                          <label className="col-5 col-form-label font-weight-bold">证件类型</label>
                          <div className="col-7">
                            <Document name="idType"/>
                          </div>
                        </div>
                        <div className="form-group row">
                          <label className="col-5 col-form-label font-weight-bold">证件号码</label>
                          <div className="col-7">
                            <input type="text" className="form-control" name="idCode"/>
                          </div>
                        </div>
                      </div>
                      <div className="col">
                      </div>
                      <div className="col"/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

export default StudentEditor;
