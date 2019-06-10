import React from 'react'
import CONFIG from '../../utils/config';
import objectToArray from "../../utils/objectToArray";

const list = objectToArray(CONFIG.DOCUMENT);

const Document = ({name}) => (
  <select name={name} className="form-control">
    <option value="">请选择</option>
    {
      list.map(item => (
        <option key={item.id} value={item.id}>{item.name}</option>
      ))
    }
  </select>
);

export default Document;