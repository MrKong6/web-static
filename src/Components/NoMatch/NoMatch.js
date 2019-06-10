import React from "react";
import mainSize from "../../utils/mainSize";

class NoMatch extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    mainSize();
  }

  render() {
    return (
      <div id="main" className="main p-3">
        <p>您没有权限访问此页面，或页面不存在 ！</p>
      </div>
    )
  }
}

export default NoMatch;