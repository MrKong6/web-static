import React from "react";
import ReactDOM from "react-dom";
import {Route, Switch, Redirect} from 'react-router-dom'

import PrivateRoute from '../PrivateRoute/PrivateRoute'
import Drawer from "../Drawer/Drawer";
import Header from "../Header/Header";
import Group from "../Group/Group";
import Roles from "../Roles/Roles";
import Permissions from "../Permissions/Permissions";
import User from "../User/User"
import Act from '../Mkt/Act/Act';
import Leads from '../Mkt/Leads/Leads';
import Appor from '../Sales/Appor/Appor';
import SalesContract from '../Sales/Contract/Contract';
import SalesCustomer from '../Sales/Customer/Customer';
import ServiceThrough from '../Service/Through/Through';
import ServiceContract from '../Service/Contract/Contract';
import ServiceCustomer from '../Service/Customer/Customer';
import ServiceVisitor from '../Service/Visitor/Visitor';
import FinanceAccount from '../Finance/Account/Account';
import AcademyCourse from '../Academy/Course/Course';
import AcademyTeacher from '../Academy/Teacher/Teacher';
import AcademyClass from '../Academy/Class/Class';
import AcademyRoom from '../Academy/Room/Room';
import AcademyAssignClass from '../Academy/AssignClass/AssignClass';
import EducationClass from '../Education/Class/Class';
import EducationCourse from '../Education/Course/Course';

import ChangePwd from '../ChangePwd/ChangePwd';
import NoMatch from "../NoMatch/NoMatch";
import DialogTips from "../Dialog/DialogTips";

import ajax from "../../utils/ajax";
import profileProcess from "../../utils/profileProcess";
import Statistic from "../Mkt/Statistic/Statistic";
import AllStatistic from "../Statistic/SaleStatistic/SaleStatistic";
import SaleStatistic from "../Statistic/SaleStatistic/SaleStatistic";
import ServiceStatistic from "../Service/ServiceStatistic/ServiceStatistic";

class Home extends React.Component {
  constructor(props) {
    super(props);
    // debugger
    this.state = {
      profile: null,
      group: null,
      redirectToReferrer: false
    };
    this.createDialogTips = this.createDialogTips.bind(this);
    this.changedCrmGroup = this.changedCrmGroup.bind(this);
  }

  componentDidMount() {
    const request = async () => {
      try {
        let profile = await ajax('/user/profile.do');
        const fmtProfile = profileProcess(profile);
        this.setState({
          profile: fmtProfile,
          group: {
            id: fmtProfile.profile.org.cId,
            name: fmtProfile.profile.org.cName
          }
        });
      } catch (err) {
        if (err.errCode === 401) {
          this.setState({redirectToReferrer: true})
        } else {
          this.createDialogTips(`${err.errCode}: ${err.errText}`);
        }
      }
    };

    request();
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

  changedCrmGroup(group) {
    this.setState({group});
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

    if (!this.state.profile) {
      return (
        <div className="container-fluid">
          <p className="p-2">程序准备中...</p>
        </div>
      );
    }

    const query = {
      access: this.state.profile.access,
      profile: this.state.profile.profile,
      commands: this.state.profile.commands
    };

    return (
      <div className="container-fluid">
        <Drawer
          profile={this.state.profile.profile}
          menu={this.state.profile.menu}
          hasChangeGroupBtn={this.state.profile.hasChangeGroupBtn}
          changed={this.changedCrmGroup}
        />

        <main>
          <Header profile={this.state.profile.profile}/>

          <Switch>
            <Route
              exact
              path={this.props.match.url}
              render={() => (<div/>)}
            />
            <PrivateRoute path="/home/groups" component={Group}{...query}/>
            <PrivateRoute path="/home/roles" component={Roles}{...query}/>
            <PrivateRoute path="/home/permissions" component={Permissions}{...query}/>
            <PrivateRoute path="/home/users" component={User}{...query}/>
            <PrivateRoute path="/home/mkt/act" changedCrmGroup={this.state.group} component={Act}{...query}/>
            <PrivateRoute path="/home/mkt/leads" changedCrmGroup={this.state.group} component={Leads}{...query}/>
            <PrivateRoute path="/home/mkt/leadspublic" changedCrmGroup={this.state.group} component={Leads}{...query}/>
            <PrivateRoute path="/home/mkt/statistic" changedCrmGroup={this.state.group} component={Statistic}{...query}/>
            <PrivateRoute path="/home/sales/oppor" changedCrmGroup={this.state.group} component={Appor}{...query}/>
            <PrivateRoute path="/home/sales/opporpublic" changedCrmGroup={this.state.group} component={Appor}{...query}/>
            <PrivateRoute path="/home/sales/contract" changedCrmGroup={this.state.group}
                          component={SalesContract}{...query}/>
            <PrivateRoute path="/home/sales/customer" changedCrmGroup={this.state.group}
                          component={SalesCustomer}{...query}/>
            <PrivateRoute path="/home/sales/statistic" changedCrmGroup={this.state.group} component={SaleStatistic}{...query}/>
            <PrivateRoute path="/home/service/through" changedCrmGroup={this.state.group}
                          component={ServiceThrough}{...query} />
            <PrivateRoute path="/home/service/visitorin" changedCrmGroup={this.state.group}
                        component={ServiceVisitor}{...query} />
            <PrivateRoute path="/home/service/visitor" changedCrmGroup={this.state.group}
                          component={ServiceVisitor}{...query}/>
            <PrivateRoute path="/home/service/contract" changedCrmGroup={this.state.group}
                          component={ServiceContract}{...query}/>
            <PrivateRoute path="/home/service/customer" changedCrmGroup={this.state.group}
                          component={ServiceCustomer}{...query}/>
            <PrivateRoute path="/home/service/statistic" changedCrmGroup={this.state.group} component={ServiceStatistic}{...query}/>
            <PrivateRoute path="/home/finance/account" changedCrmGroup={this.state.group}
                          component={FinanceAccount}{...query}/>
            <PrivateRoute path="/home/academy/course" changedCrmGroup={this.state.group}
                          component={AcademyCourse}{...query}/>
            <PrivateRoute path="/home/academy/teacher" changedCrmGroup={this.state.group}
                          component={AcademyTeacher}{...query}/>
            <PrivateRoute path="/home/academy/class" changedCrmGroup={this.state.group}
                          component={AcademyClass}{...query}/>
            <PrivateRoute path="/home/academy/room" changedCrmGroup={this.state.group}
                          component={AcademyRoom}{...query}/>
            <PrivateRoute path="/home/academy/assignclass" changedCrmGroup={this.state.group}
                          component={AcademyAssignClass}{...query}/>
            <PrivateRoute path="/home/education/class" changedCrmGroup={this.state.group}
                          component={EducationClass}{...query}/>
            <PrivateRoute path="/home/education/course" changedCrmGroup={this.state.group}
                          component={EducationCourse}{...query}/>
            <PrivateRoute path="/home/statistic" changedCrmGroup={this.state.group}
                          component={AllStatistic}{...query}/>
            <Route path="/home/changepwd" component={ChangePwd}/>
            <Route render={(props) => (
              <NoMatch {...props} profile={this.state.profile.profile}/>
            )}/>
          </Switch>
        </main>
      </div>
    )
  }
}

export default Home;
