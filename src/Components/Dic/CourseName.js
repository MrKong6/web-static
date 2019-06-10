import React from 'react'

const CourseName = ({name}) => (
  <select name={name || "courseName"} className="form-control">
    <option value="">请选择</option>
    <option value="默认产品2018第一期课程">默认产品2018第一期课程</option>
  </select>
);

export default CourseName;