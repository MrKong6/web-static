import React from 'react'

const CourseType = ({name}) => (
  <select name={name || "courseId"} className="form-control">
    <option value="">请选择</option>
      <option value="16122700000002">Rise start</option>
      <option value="16122700000003">Rise on</option>
      <option value="16122700000004">Rise up</option>
  </select>
);

export default CourseType;