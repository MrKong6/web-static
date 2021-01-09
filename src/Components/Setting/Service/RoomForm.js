import React from 'react'
import ReactDOM from 'react-dom'

import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

import DialogTips from "../../Dialog/DialogTips";
import Gender from '../../Dic/Gender';
import Grade from '../../Dic/Grade';
import Document from '../../Dic/Document';

import ajax from "../../../utils/ajax";
import fmtDate from "../../../utils/fmtDate";
import calculateAge from "../../../utils/calculateAge";
import {DatePicker} from "element-react";
import Org from "../../Dic/Org";

class Form extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            group: this.props.changedCrmGroup,
            birthday: null,
            age: 0,
            option: {'gender':[],'positionList':[],'typeList':[],'rangeList':[]},
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
                    data = await ajax('/academy/room/query.do', {id: this.props.editorId});
                    data = data.data;
                }

                this.setState({
                    data
                }, () => {
                    if (this.props.isEditor) {
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
                    }
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

        query.birthday = this.state.birthday;

        for (let i = 0; i < this.form.length; i++) {
            if (this.form[i].name) {
                /*if (this.form[i].name === 'startDate' || this.form[i].name === 'endDate') {
                    query[this.form[i].name] = new Date(this.form[i].value);
                } else {*/
                    query[this.form[i].name] = this.form[i].value;
                /*}*/
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
                                                <em className="text-danger">*</em>编号
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="code"
                                                       required={true}/>
                                            </div>
                                        </div>
                                        <Org />
                                        <div className="form-group row">
                                            <label className="col-5 col-form-label font-weight-bold">
                                                备注
                                            </label>
                                            <div className="col-7">
                                                <input type="text" className="form-control" name="comment"/>
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