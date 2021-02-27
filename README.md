This project was bootstrapped with [SaleManageReport React App](https://github.com/facebookincubator/create-react-app).

- [npm start](#npm-start)
- [npm test](#npm-test)
- [npm run build](#npm-run-build)
- [npm run eject](#npm-run-eject)


import antd into schoolpal
- [yarn add antd]
- [yarn add react-app-rewired customize-cra]
- [yarn add babel-plugin-import]
- [<2019-06-12 熟悉系统部署脚本、将系统部署另一套8080]
- [2019-06-12 优化系统所有表格组件（表格样式、表格排序、表格tooltip）]
- [去掉销售机会线程进程中的类型字段]
- [修复销售线索在详情页没有沟通记录不显示bug]

- [npm i react-vertical-timeline-component]

add [https://www.ctolib.com/react-input-color.html]
- [npm install react-input-color --save]
- [yarn add react-input-color]

add [漏斗图 HighChart] 
- [https://jshare.com.cn/demos/hhhhiu/2]

合同：合同管理、我的合同、学员信息中的我的合同


- [项目目录结构代表组件]
Academy    教务管理
    AssignClass  排课管理
    Class  班级管理
    Course  课程管理
    Room  教室管理
    Teacher   教师管理
App 程序入口组件
Area
ChangePwd 修改密码组件
Commands 按钮
Contact 线索/机会/访客  --沟通记录
Dialog 弹框公用组件
Dic 页面公用组件
Drawer 左侧导航
Education 教学管理
    Class 我的班级
    Course 我的课程
    Through 我的体验课
Finace  财务管理
    Account 账户管理
    Charge 收费管理
Group  组织管理
Header 头部导航
Home   首页
Import  迁移向导 -- 迁移向导
Login  登录
Mkt 市场管理
    Act 营销活动
    Leads 线索管理
    Statistic
NoMatch 
Permissions 权限管理
PrivateRoute 路径权限过滤
Progress 进度条组件 
Riles 角色管理
Sales 销售管理
    All 销售所有池
    Appor 机会公有池/私有池
    Contract 我的合同
    Customer 我的学员
    Through 我的体验课
Service 客户服务
    Contract 合同管理
    Customer 学员管理
    ServiceStatistic
    Situation 异动管理
    Through 体验课管理
    Visitor 访客管理
Setting 业务配置
    Academy 客户服务
    Service  教务管理
    Wechat  实时访客 --  实时访客管理
    WechatCls 内容模型 -- 班级管理
    WechatCourse 内容模型 -- 课程管理
    WechatCourseStage  内容模型 -- 课程管理
    WechatIdxImage 内容模型 -- 轮播图
    WechatOrder  实时访客 -- 预约信息管理
    WechatType  内容模型 -- 年级管理
    WechatUser  实时访客 --  预约用户管理

Statistic   统计分析
User 用户管理
util  常用工具类
    

























{/*<thead>
                                        <tr>
                                            <th>项目</th>
                                            <th>序号</th>
                                            <th>日期</th>
                                            <th>摘要</th>
                                            <th>收入</th>
                                            <th>支出</th>
                                            <th>余额</th>
                                            <th>操作</th>
                                        </tr>
                                    </thead>*/}

                                    <tr>
                                        <td style={{"border": 0, "border-top": "hidden"}}>课时消耗子账户</td>
                                        <td style={{"border": 0, "border-left": "1px solid black"}}>0</td>
                                        <td style={{"border": 0}}></td>
                                        <td style={{"border": 0}}>课时费</td>
                                        <td style={{"border": 0}}>¥6210.00</td>
                                        <td style={{"border": 0}}></td>
                                        <td style={{"border": 0, "border-right": "1px solid black"}}>¥0.00</td>
                                        <td style={{"border": 0}}></td>
                                    </tr>
                                    <tr>
                                        <td style={{"border": 0}}></td>
                                        <td style={{"border": 0, "border-left": "1px solid black"}}>1</td>
                                        <td style={{"border": 0}}></td>
                                        <td style={{"border": 0}}></td>
                                        <td style={{"border": 0}}></td>
                                        <td style={{"border": 0}}></td>
                                        <td style={{"border": 0, "border-right": "1px solid black"}}>¥0.00</td>
                                        <td style={{"border": 0}}></td>
                                    </tr>
                                    
                                    
                                    
                                    {/*<Form labelPosition="left" inline={true} className="demo-table-expand">
                                                                        <Form.Item label=""><span>子账户</span></Form.Item>
                                                                        <Form.Item label=""><span>1</span></Form.Item>
                                                                        <Form.Item label=""><span>2019-11-10</span></Form.Item>
                                                                        <Form.Item label=""><span>---</span></Form.Item>
                                                                        <Form.Item label=""><span>8000</span></Form.Item>
                                                                        <Form.Item label=""><span>---</span></Form.Item>
                                                                        <Form.Item label=""><span>8000</span></Form.Item>
                                                                        <Form.Item label=""><span>---</span></Form.Item>
                                                                    </Form>*/}