import React from 'react'
import ReactDOM from 'react-dom'

import 'react-day-picker/lib/style.css';
import DialogTips from "../../Dialog/DialogTips";
import Grade from '../../Dic/Grade';

import ajax from "../../../utils/ajax";
import fmtDate from "../../../utils/fmtDate";
import calculateAge from "../../../utils/calculateAge";
import {DatePicker} from "element-react";
import './Through.css'

class Form extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      group: this.props.changedCrmGroup,
      birthday: null,
      age: 0,
      option: null,
      data: null,
      throughTime:null
    };
    this.changeBirthday = this.changeBirthday.bind(this);
    this.createDialogTips = this.createDialogTips.bind(this);
    this.getFormValue = this.getFormValue.bind(this);
  }

  componentDidMount() {
    const request = async () => {
      try {
        let relation = await ajax('/mkt/relation/list.do');
        let gender = await ajax('/mkt/gender/list.do');
        let data = null;

        if (this.props.isEditor) {
          data = await ajax('/service/contract/query.do', {id: this.props.editorId});
        } else {
          data = {
            stuName: this.props.apporData.student.name,
            stuGrade: this.props.apporData.student.classGrade,
            stuBirthday: new Date(this.props.apporData.student.birthday),
            stuGenderId: this.props.apporData.student.genderId || '',
            stuSchoolName: this.props.apporData.student.schoolName,
            parName: this.props.apporData.parent.name,
            relation: this.props.apporData.parent.relation,
            parCellphone: this.props.apporData.parent.cellphone,
            parWechat: this.props.apporData.parent.wechat || '',
            parAddress: this.props.apporData.parent.address,
            courseId: this.props.apporData.courseId || '',
            courseName: this.props.apporData.courseName || ''
          }
        }

        const birthday = new Date(data.stuBirthday);
        const age = calculateAge(birthday);

        this.setState({
          option: {relation, gender},
          data,
          birthday,
          age
        }, () => {
          const keys = Object.keys(data);

          keys.map(key => {
            if (this.form[key]) {
              if (key === 'startDate' || key === 'endDate') {
                this.form[key].value = fmtDate(data[key]);
              } else {
                this.form[key].value = data[key];
              }
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

    // request()
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
    if (!this.form.checkValidity() || !this.form.stuGrade.value || !this.form.courseId.value || !this.form.courseName.value) {
      return
    }

    let query = {};

    query.stuBirthday = this.state.birthday;
    query.stuCode = this.form.code.value;
    query.courseType = this.form.courseId.options[this.form.courseId.selectedIndex].text;

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
                  <p className="ht pb-3 b-b">基本信息</p>
                  <div className="row">
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>体验课场次
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="code" required={true}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">状态</label>
                        <div className="col-7">
                            <select className="form-control" name={this.props.throughStatus || "throughStatus"}>
                                {
                                    this.state.option ? this.state.option.allClassStatus.map(item => (
                                        <option key={item.code} value={item.code}>{item.name}</option>
                                    )) : null
                                }
                            </select>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>时间
                        </label>
                        <div className="col-7">
                            <DatePicker
                                name="throughTime"
                                value={this.state.throughTime}
                                width="100%"
                                className="allWidth"
                                isShowTime={true}
                                placeholder="选择日期"
                                format="yyyy-MM-dd HH:mm"
                                onChange={date=>{
                                    console.debug('DatePicker1 changed: ', date)
                                    this.setState({throughTime: date})
                                }}
                            />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>主教
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="mainTeacher"
                                 value={this.state.mainTeacher ? this.state.mainTeacher : ''} />
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>助教
                        </label>
                        <div className="col-7">
                            <input type="text" className="form-control" name="assistant" required={true}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>课程顾问
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="adviser" required={true}/>
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