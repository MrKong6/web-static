import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/App/App";
import 'element-theme-default';
import { Button,Upload } from 'element-react';

const root = document.getElementById("root");

root.style.position = "relative";
root.style.width = "100%";
root.style.height = "100%";

ReactDOM.render(<App/>, root);
