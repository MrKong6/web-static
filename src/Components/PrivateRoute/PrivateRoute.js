import React from 'react'
import {Route, Redirect} from 'react-router-dom'

const PrivateRoute = ({component: Component, ...rest}) => {
  const temp = {...rest};
  const isAccess = temp.access.filter((item) => (item.test(temp.location.pathname) === true));

  console.log("====================================================")
  console.log(isAccess);
  console.log("PrivateRoute visit path is " + temp.location.pathname)
  console.log("====================================================")
  return (
    <Route {...rest} render={props => (
      isAccess.length ? (
        <Component profile={temp.profile} commands={temp.commands} changedCrmGroup={temp.changedCrmGroup} {...props}/>
      ) : (
        <Redirect to="/404"/>
      )
    )}/>
  )
};

export default PrivateRoute;