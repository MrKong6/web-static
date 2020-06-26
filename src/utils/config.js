export default {
    AUTH: {
        //市场相关权限配置
        "1": {ICON_CLASS: "fa-balance-scale"},
        "1-0": {
            PATH: "home/mkt/statistic",
            PATH_RULE: /^\/home\/mkt\/statistic(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-area-chart",
            CATEGORY: '',
            NAME: '仪表盘'
        },
        "1-1": {
            PATH: "home/mkt/act",
            PATH_RULE: /^\/home\/mkt\/act(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-pie-chart",
            CATEGORY: '营销',
            NAME: '活动'
        },
        "1-1-1": {
            PATH_RULE: /^\/home\/mkt\/act\/create$/,
            ICON_CLASS: "fa-pie-chart",
            CATEGORY: '市场',
            NAME: '活动'
        },
        "1-1-2": {
            PATH_RULE: /^\/home\/mkt\/act\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-pie-chart",
            CATEGORY: '市场',
            NAME: '活动'
        },
        "1-2": {
            PATH: "home/mkt/leads",
            PATH_RULE: /^\/home\/mkt\/leads(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-filter",
            CATEGORY: '线索',
            NAME: '私有池'
        },
        "1-2-1": {
            PATH_RULE: /^\/home\/mkt\/leads\/create$/,
            ICON_CLASS: "fa-filter",
            CATEGORY: '线索',
            NAME: '私有池'
        },
        "1-2-2": {
            PATH_RULE: /^\/home\/mkt\/leads\/edit\/((?!create).)*$/,
            ICON_CLASS: "fa-filter",
            CATEGORY: '线索',
            NAME: '私有池'
        },
        "1-3": {
            PATH: "home/mkt/leadspublic",
            PATH_RULE: /^\/home\/mkt\/leadspublic(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-filter",
            CATEGORY: '线索',
            NAME: '公有池'
        },
        "1-3-1": {
            PATH_RULE: /^\/home\/mkt\/leadspublic\/create$/,
            ICON_CLASS: "fa-filter",
            CATEGORY: '线索',
            NAME: '公有池'
        },
        "1-3-2": {
            PATH_RULE: /^\/home\/mkt\/leadspublic\/edit\/((?!create).)*$/,
            ICON_CLASS: "fa-filter",
            CATEGORY: '线索',
            NAME: '公有池'
        },


        //销售相关权限配置
        "2": {ICON_CLASS: "fa-tags"},
        "2-1": {
            PATH: "home/sales/oppor",
            PATH_RULE: /^\/home\/sales\/oppor(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-file-o",
            CATEGORY: '机会',
            NAME: '私有池'
        },
        "2-1-1": {
            PATH_RULE: /^\/home\/sales\/oppor\/create$/,
            ICON_CLASS: "fa-file-o",
            CATEGORY: '机会',
            NAME: '私有池'
        },
        "2-1-2": {
            PATH_RULE: /^\/home\/sales\/oppor\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-file-o",
            CATEGORY: '机会',
            NAME: '私有池'
        },
        "2-0": {
            PATH: "home/sales/opporpublic",
            PATH_RULE: /^\/home\/sales\/opporpublic(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-file-o",
            CATEGORY: '机会',
            NAME: '公有池'
        },
        "2-0-1": {
            PATH_RULE: /^\/home\/sales\/opporpublic\/create$/,
            ICON_CLASS: "fa-file-o",
            CATEGORY: '机会',
            NAME: '公有池'
        },
        "2-0-2": {
            PATH_RULE: /^\/home\/sales\/opporpublic\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-file-o",
            CATEGORY: '机会',
            NAME: '公有池'
        },
        "2-2": {
            PATH: "home/sales/contract",
            PATH_RULE: /^\/home\/sales\/contract(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-file-text-o",
            CATEGORY: '我的',
            NAME: '合同'
        },
        "2-2-1": {
            PATH_RULE: /^\/home\/sales\/contract\/create$/,
            ICON_CLASS: "fa-file-text-o",
            CATEGORY: '我的',
            NAME: '合同'
        },
        "2-2-2": {
            PATH_RULE: /^\/home\/sales\/contract\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-file-text-o",
            CATEGORY: '我的',
            NAME: '合同'
        },
        "2-3": {
            PATH: "home/sales/customer",
            PATH_RULE: /^\/home\/sales\/customer(\/(student|parent|contract|situation)\/((?!create).)*)?$/,
            ICON_CLASS: "fa-graduation-cap",
            CATEGORY: '我的',
            NAME: '学员'
        },
        "2-3-1": {
            PATH_RULE: /^\/home\/sales\/customer\/student\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-graduation-cap",
            CATEGORY: '我的',
            NAME: '学员'
        },
        "2-3-2": {
            PATH_RULE: /^\/home\/sales\/customer\/student\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-graduation-cap",
            CATEGORY: '我的',
            NAME: '学员'
        },
        "2-3-3": {
            PATH_RULE: /^\/home\/sales\/customer\/student\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-graduation-cap",
            CATEGORY: '我的',
            NAME: '学员'
        },
        "2-3-4": {
            PATH_RULE: /^\/home\/sales\/customer\/student\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-graduation-cap",
            CATEGORY: '我的',
            NAME: '学员'
        },
        "2-3-5": {
            PATH_RULE: /^\/home\/sales\/customer\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-graduation-cap",
            CATEGORY: '我的',
            NAME: '学员'
        },

        "2-4": {
            PATH: "home/sales/through",
            PATH_RULE: /^\/home\/sales\/through(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-desktop",
            CATEGORY: '我的',
            NAME: '体验课'
        },

        "2-5": {
            PATH: "home/sales/allleads",
            PATH_RULE: /^\/home\/sales\/allleads(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-desktop",
            CATEGORY: '销售所有池',
        },


        //服务相关权限配置
        "3": {ICON_CLASS: "fa-cogs"},
        "3-4": {
            PATH: "home/service/visitorin",
            PATH_RULE: /^\/home\/service\/visitorin(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-child",
            CATEGORY: '访客',
            NAME: '登记'
        },
        "3-4-2": {
            PATH_RULE: /^\/home\/service\/visitorin\/create$/,
            ICON_CLASS: "fa-filter",
            CATEGORY: '访客',
            NAME: '登记'
        },
        /*"3-3": {
            PATH: "home/service/visitor",
            PATH_RULE: /^\/home\/service\/visitor(((?!create).)*)?$/,
            ICON_CLASS: "fa-graduation-cap",
            CATEGORY: '访客'
        },
        "3-3-2": {
            PATH_RULE: /^\/home\/service\/visitor\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-graduation-cap",
            CATEGORY: '访客'
        },*/
        "3-4-5": {
            PATH_RULE: /^\/home\/service\/visitorin\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-graduation-cap",
            CATEGORY: '访客登记'
        },
        "3-3": {
            PATH: "home/service/visitor",
            PATH_RULE: /^\/home\/service\/visitor(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-filter",
            CATEGORY: '访客',
            // NAME: '访客'
        },
        "3-3-2": {
            PATH_RULE: /^\/home\/service\/visitor\/create$/,
            ICON_CLASS: "fa-filter",
            CATEGORY: '访客',
            // NAME: '访客'
        },
        "3-1": {
            PATH: "home/service/contract",
            PATH_RULE: /^\/home\/service\/contract(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-file-text-o",
            CATEGORY: '合同'
        },
        "3-1-1": {
            PATH_RULE: /^\/home\/service\/contract\/create$/,
            ICON_CLASS: "fa-file-text-o",
            CATEGORY: '合同'
        },
        "3-1-2": {
            PATH_RULE: /^\/home\/service\/contract\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-file-text-o",
            CATEGORY: '合同'
        },
        "3-2": {
            PATH: "home/service/customer",
            PATH_RULE: /^\/home\/service\/customer(\/(student|parent|contract|account|situation|class|charge)\/((?!create).)*)?$/,
            ICON_CLASS: "fa-graduation-cap",
            CATEGORY: '学员'
        },
        "3-2-1": {
            PATH_RULE: /^\/home\/service\/customer\/student\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-graduation-cap",
            CATEGORY: '学员'
        },
        "3-2-2": {
            PATH_RULE: /^\/home\/service\/customer\/student\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-graduation-cap",
            CATEGORY: '学员'
        },
        "3-2-3": {
            PATH_RULE: /^\/home\/service\/customer\/student\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-graduation-cap",
            CATEGORY: '学员'
        },
        "3-2-4": {
            PATH_RULE: /^\/home\/service\/customer\/student\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-graduation-cap",
            CATEGORY: '学员'
        },
        "3-2-5": {
            PATH_RULE: /^\/home\/service\/customer\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-graduation-cap",
            CATEGORY: '学员'
        },
        "3-2-6": {
            PATH_RULE: /^\/home\/service\/customer\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-graduation-cap",
            CATEGORY: '学员'
        },
        "3-2-7": {
            PATH_RULE: /^\/home\/service\/customer\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-graduation-cap",
            CATEGORY: '学员'
        },
        "3-5": {
            PATH: "home/service/statistic",
            PATH_RULE: /^\/home\/service\/statistic(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-area-chart",
            CATEGORY: '',
            NAME: '仪表盘'
        },
        "3-6": {
            PATH: "home/service/through",
            PATH_RULE: /^\/home\/service\/through(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-desktop",
            CATEGORY: '体验课'
        },
        "3-6-1": {
            PATH_RULE: /^\/home\/service\/through\/create$/,
            ICON_CLASS: "fa-desktop",
            CATEGORY: '体验课'
        },
        "3-7": {
            PATH: "home/service/situation",
            PATH_RULE: /^\/home\/service\/situation(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-desktop",
            CATEGORY: '异动'
        },
        "3-7-1": {
            PATH_RULE: /^\/home\/service\/situation\/create$/,
            ICON_CLASS: "fa-desktop",
            CATEGORY: '异动'
        },

        //财务相关权限配置
        "4": {ICON_CLASS: "fa-money"},
        "4-1": {
            PATH: "home/finance/account",
            PATH_RULE: /^\/home\/finance\/account(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-credit-card",
            CATEGORY: '账户'
        },
        "4-2": {
            PATH: "home/finance/charge",
            PATH_RULE: /^\/home\/finance\/charge(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-credit-card",
            CATEGORY: '财务'
        },

        //教务相关权限配置
        "5": {ICON_CLASS: "fa-calendar-check-o"},
        "5-1": {
            PATH: "home/academy/course",
            PATH_RULE: /^\/home\/academy\/course(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-leanpub",
            CATEGORY: '课程'
        },
        "5-1-1": {
            PATH_RULE: /^\/home\/academy\/course\/create$/,
            ICON_CLASS: "fa-user-o",
            CATEGORY: '课程',
            // NAME: '访客'
        },
        "5-2": {
            PATH: "home/academy/teacher",
            PATH_RULE: /^\/home\/academy\/teacher(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-user-o",
            CATEGORY: '教师'
        },
        "5-2-1": {
            PATH_RULE: /^\/home\/academy\/teacher\/create$/,
            ICON_CLASS: "fa-user-o",
            CATEGORY: '教师',
            // NAME: '访客'
        },
        "5-3": {
            PATH: "home/academy/room",
            PATH_RULE: /^\/home\/academy\/room(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-houzz",
            CATEGORY: '教室'
        },
        "5-3-1": {
            PATH_RULE: /^\/home\/academy\/room\/create$/,
            ICON_CLASS: "fa-houzz",
            CATEGORY: '教室',
            // NAME: '访客'
        },
        "5-4": {
            PATH: "home/academy/class",
            PATH_RULE: /^\/home\/academy\/class$/,
            ICON_CLASS: "fa-users",
            CATEGORY: '班级'
        },
        "5-4": {
            PATH: "home/academy/class",
            PATH_RULE: /^\/home\/academy\/class\/create$/,
            ICON_CLASS: "fa-users",
            CATEGORY: '班级'
        },
        "5-4-1": {
            PATH: "home/academy/class",
            PATH_RULE: /^\/home\/academy\/class(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-users",
            CATEGORY: '班级'
        },
        "5-4-2": {
            PATH: "home/academy/class",
            PATH_RULE: /^\/home\/academy\/class(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-users",
            CATEGORY: '班级'
        },
        "5-4-3": {
            PATH: "home/academy/class",
            PATH_RULE: /^\/home\/academy\/class(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-users",
            CATEGORY: '班级'
        },
        "5-4-4": {
            PATH: "home/academy/class",
            PATH_RULE: /^\/home\/academy\/class(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-users",
            CATEGORY: '班级'
        },
        "5-4-5": {
            PATH: "home/academy/class",
            PATH_RULE: /^\/home\/academy\/class(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-users",
            CATEGORY: '班级'
        },
        "5-4-6": {
            PATH: "home/academy/class",
            PATH_RULE: /^\/home\/academy\/class(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-users",
            CATEGORY: '班级'
        },
        /*"5-4-1-1": {
            PATH_RULE: /^\/home\/academy\/class\/create$/,
            ICON_CLASS: "fa-houzz",
            CATEGORY: '班级',
            NAME: ''
        },*/
        "5-5": {
            PATH: "home/academy/assignclass",
            PATH_RULE: /^\/home\/academy\/assignclass(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-tasks",
            CATEGORY: '排课'
        },
        "5-5-1": {
            PATH: "home/academy/assignclass",
            PATH_RULE: /^\/home\/academy\/assignclass\/create$/,
            ICON_CLASS: "fa-tasks",
            CATEGORY: '排课'
        },

        //教学相关权限配置
        "6": {ICON_CLASS: "fa-stack-overflow"},
        "6-1": {
            PATH: "home/education/class",
            PATH_RULE: /^\/home\/education\/class(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-users",
            CATEGORY: '我的',
            NAME: '班级'
        },
        "6-1-1": {
            PATH: "home/education/class",
            PATH_RULE: /^\/home\/education\/class\/create$/,
            ICON_CLASS: "fa-users",
            CATEGORY: '我的',
            NAME: '班级'
        },
        "6-1-2": {
            PATH: "home/education/class",
            PATH_RULE: /^\/home\/education\/class\/create$/,
            ICON_CLASS: "fa-users",
            CATEGORY: '我的',
            NAME: '班级'
        },
        "6-1-3": {
            PATH: "home/education/class",
            PATH_RULE: /^\/home\/education\/class\/create$/,
            ICON_CLASS: "fa-users",
            CATEGORY: '我的',
            NAME: '班级'
        },
        "6-1-4": {
            PATH: "home/education/class",
            PATH_RULE: /^\/home\/education\/class\/create$/,
            ICON_CLASS: "fa-users",
            CATEGORY: '我的',
            NAME: '班级'
        },
        "6-1-5": {
            PATH: "home/education/class",
            PATH_RULE: /^\/home\/education\/class\/create$/,
            ICON_CLASS: "fa-users",
            CATEGORY: '我的',
            NAME: '班级'
        },
        "6-1-6": {
            PATH: "home/education/class",
            PATH_RULE: /^\/home\/education\/class\/create$/,
            ICON_CLASS: "fa-users",
            CATEGORY: '我的',
            NAME: '班级'
        },
        "6-2": {
            PATH: "home/education/course",
            PATH_RULE: /^\/home\/education\/course(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-leanpub",
            CATEGORY: '我的',
            NAME: '课程表'
        },
        "6-3": {
            PATH: "home/education/through",
            PATH_RULE: /^\/home\/education\/through(\/((?!create).)*)?$/,
            ICON_CLASS: "fa-desktop",
            CATEGORY: '我的',
            NAME: '体验课'
        },

        //管理员相关权限配置
        "7": {ICON_CLASS: "fa-sitemap"},
        "7-1": {
            PATH: "home/groups",
            PATH_RULE: /^\/home\/groups$/,
            ICON_CLASS: "fa-sitemap"
        },
        "7-1-1": {PATH_RULE: /^\/home\/groups\/create$/},
        "7-1-2": {PATH_RULE: /^\/home\/groups\/((?!create).)*$/},
        "7-2": {
            PATH: "home/roles",
            PATH_RULE: /^\/home\/roles$/,
            ICON_CLASS: "fa-shield"
        },
        "7-2-1": {PATH_RULE: /^\/home\/roles\/create$/},
        "7-2-2": {PATH_RULE: /^\/home\/roles\/((?!create).)*$/},

        "7-3": {
            PATH: "home/permissions",
            PATH_RULE: /^\/home\/permissions$/,
            ICON_CLASS: "fa-users"
        },

        "7-4": {PATH: "home/users", PATH_RULE: /^\/home\/users$/, ICON_CLASS: "fa-user"},
        "7-4-1": {PATH_RULE: /^\/home\/users\/create$/},
        "7-4-2": {PATH_RULE: /^\/home\/users\/((?!create).)*$/},

        //统计分析
        "8": {ICON_CLASS: "fa-area-chart"},
        "8-1": {
            PATH: "home/statistic",
            PATH_RULE: /^\/home\/statistic/,
            ICON_CLASS: "fa-sitemap",
            CATEGORY: '统计',
            NAME: '分析'
        },
        "8-1-1": {
            PATH_RULE: /^\/home\/statistic\/create$/,
            ICON_CLASS: "fa-file-o",
            CATEGORY: '统计',
            NAME: '分析'
        },
        "8-1-2": {
            PATH_RULE: /^\/home\/statistic\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-file-o",
            CATEGORY: '统计',
            NAME: '分析'
        },
        //迁移向导
        "9": {ICON_CLASS: "fa-area-chart"},
        "9-1": {
            PATH: "home/import",
            PATH_RULE: /^\/home\/import/,
            ICON_CLASS: "fa-sitemap",
            CATEGORY: '迁移向导',
            NAME: ''
        },
        //业务配置
        "10": {ICON_CLASS: "fa-area-chart"},
        "10-1": {
            PATH: "home/setting/service",
            PATH_RULE: /^\/home\/setting\/service/,
            ICON_CLASS: "fa-sitemap",
            CATEGORY: '客户服务',
            NAME: ''
        },
        "10-1-1": {
            PATH_RULE: /^\/home\/setting\/service\/create$/,
            ICON_CLASS: "fa-sitemap",
            CATEGORY: '客户服务',
            NAME: ''
        },
        "10-1-2": {
            PATH_RULE: /^\/home\/setting\/service\/((?!create).)*\/edit$/,
            ICON_CLASS: "fa-file-o",
            CATEGORY: '客户服务',
        },
        "10-2": {
            PATH: "home/setting/academy",
            PATH_RULE: /^\/home\/setting\/academy/,
            ICON_CLASS: "fa-sitemap",
            CATEGORY: '教务',
            NAME: ''
        },
        "10-3": {
            PATH: "home/setting/price",
            PATH_RULE: /^\/home\/setting\/price/,
            ICON_CLASS: "fa-sitemap",
            CATEGORY: '商品',
            NAME: ''
        },
        "11": {ICON_CLASS: "fa-area-chart"},
        "11-1": {
            PATH: "home/wechat",
            PATH_RULE: /^\/home\/wechat/,
            ICON_CLASS: "fa-sitemap",
            CATEGORY: '微信后台',
            NAME: ''
        },
    },
    TYPE_ID: {1: '线索', 2: '新招', 3: '续报'},
    DOCUMENT: {1: '身份证'},
    WEEKNAME: ["周一","周二","周三","周四","周五","周六","周日"]
};
