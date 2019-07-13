import React from 'react'

const Grade = ({name}) => (
  <select name={name || "classGrade"} className="form-control">
    <option value="">请选择</option>
    <option value="幼儿园小班">幼儿园小班</option>
    <option value="幼儿园中班">幼儿园中班</option>
      <option value="幼儿园大班">幼儿园大班</option>
      <option value="学前班">学前班</option>
      <option value="小学一年级">小学一年级</option>
      <option value="小学二年级">小学二年级</option>
      <option value="小学三年级">小学三年级</option>
      <option value="小学四年级">小学四年级</option>
      <option value="小学四年级">小学五年级</option>
      <option value="小学四年级">小学六年级</option>

  </select>
);

export default Grade;