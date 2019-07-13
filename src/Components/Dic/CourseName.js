import React from 'react'
const CourseName = ({name}) => (
    <select name={name || "courseName"} className="form-control">
        <option value="">请选择</option>
        <option value="K1(Pre-K)">K1(Pre-K)</option>
        <option value="K2(K)">K2(K)</option>
        <option value="K3(Pre-Rise)">K3(Pre-Rise)</option>
    </select>
);

export default CourseName;