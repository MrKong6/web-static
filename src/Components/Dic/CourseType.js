import React from 'react'

const CourseType = ({name}) => (
  <select name={name || "courseId"} className="form-control">
    <option value="">请选择</option>
    <option value="16122700000002">默认类型</option>
  </select>
);

export default CourseType;