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
        let relation = await ajax('/mkt/relation/list.do');
        let gender = await ajax('/mkt/gender/list.do');
        let data = null;

        if (this.props.isEditor) {
          data = await ajax('/sales/contract/query.do', {id: this.props.editorId});
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
    if (!this.state.option || (this.props.isEditor && !this.state.data)) {
      return (
        <form ref={(dom) => {
          this.form = dom
        }}>
          <div className="row justify-content-md-center">
            <div className="col col-12">
              <div className="card">
                <div className="card-body">数据加载中...</div>
              </div>
            </div>
          </div>
        </form>
      )
    } else {
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
                          <em className="text-danger">*</em>学员姓名
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="stuName" required={true}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">学员姓别</label>
                        <div className="col-7">
                          <Gender data={this.state.option.gender} name="stuGenderId"/>
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
                          <Grade name="stuGrade"/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>所在学校
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="stuSchoolName" required={true}/>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">证件类型</label>
                        <div className="col-7">
                          <Document name="stuIdType"/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">证件号码</label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="stuIdCode"/>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>家长姓名
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="parName" required={true}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>与孩子关系
                        </label>
                        <div className="col-7">
                          <Relation data={this.state.option.relation}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>联系电话
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="parCellphone" required={true}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">微信号</label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="parWechat"/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">电子邮箱</label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="parEmail"/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">家庭住址</label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="parAddress"/>
                        </div>
                      </div>
                    </div>
                    <div className="col"/>
                  </div>
                  <p className="ht pt-3 pb-3 b-t b-b">合同信息</p>
                  <div className="row">
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>课程类别
                        </label>
                        <div className="col-7">
                          <CourseType/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>课程产品
                        </label>
                        <div className="col-7">
                          <CourseName/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>课时
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="courseHours" required={true}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>课次
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="courseTimes" required={true}/>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>合同金额
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="oriPrice" required={true}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>折扣金额
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="discPrice" required={true}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>应付金额
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="finalPrice" required={true}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>已付金额
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="paid" required={true}/>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>合同编号
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="code" required={true}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>合同类型
                        </label>
                        <div className="col-7">
                          <select className="form-control" name="typeId">
                            <option value="2">新招</option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>签约日期
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="startDate" required={true}
                                 placeholder={fmtDate(new Date())}/>
                        </div>
                      </div>
                      <div className="form-group row">
                        <label className="col-5 col-form-label font-weight-bold">
                          <em className="text-danger">*</em>到期日期
                        </label>
                        <div className="col-7">
                          <input type="text" className="form-control" name="endDate" required={true}
                                 placeholder={fmtDate(new Date())}/>
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
}

export default Form;