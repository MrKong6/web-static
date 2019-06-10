import React from 'react'

const Grade = ({name}) => (
  <select name={name || "classGrade"} className="form-control">
    <option value="">请选择</option>
    <option value="幼儿园">幼儿园</option>
    <option value="小学一年级">小学一年级</option>
  </select>
);

export default Grade;