export default {
  AUTH: {
    //市场相关权限配置
    "1": {ICON_CLASS: "fa-balance-scale"},
    "1-1": {
      PATH: "home/mkt/act",
      PATH_RULE: /^\/home\/mkt\/act(\/((?!create).)*)?$/,
      ICON_CLASS: "fa-pie-chart",
      CATEGORY: '市场',
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
      CATEGORY: '销售',
      NAME: '线索'
    },
    "1-2-1": {
      PATH_RULE: /^\/home\/mkt\/leads\/create$/,
      ICON_CLASS: "fa-filter",
      CATEGORY: '销售',
      NAME: '线索'
    },
    "1-2-2": {
      PATH_RULE: /^\/home\/mkt\/leads\/edit\/((?!create).)*$/,
      ICON_CLASS: "fa-filter",
      CATEGORY: '销售',
      NAME: '线索'
    },


    //销售相关权限配置
    "2": {ICON_CLASS: "fa-tags"},
    "2-1": {
      PATH: "home/sales/oppor",
      PATH_RULE: /^\/home\/sales\/oppor(\/((?!create).)*)?$/,
      ICON_CLASS: "fa-file-o",
      CATEGORY: '销售',
      NAME: '机会'
    },
    "2-1-1": {
      PATH_RULE: /^\/home\/sales\/oppor\/create$/,
      ICON_CLASS: "fa-file-o",
      CATEGORY: '销售',
      NAME: '机会'
    },
    "2-1-2": {
      PATH_RULE: /^\/home\/sales\/oppor\/((?!create).)*\/edit$/,
      ICON_CLASS: "fa-file-o",
      CATEGORY: '销售',
      NAME: '机会'
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
      PATH_RULE: /^\/home\/sales\/customer(\/(student|parent|contract)\/((?!create).)*)?$/,
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
    "2-3-5": {
      PATH_RULE: /^\/home\/sales\/customer\/parent\/((?!create).)*\/edit$/,
      ICON_CLASS: "fa-graduation-cap",
      CATEGORY: '我的',
      NAME: '学员'
    },


    //服务相关权限配置
    "3": {ICON_CLASS: "fa-cogs"},
      "3-4": {
          PATH: "home/service/visitorin",
          PATH_RULE: /^\/home\/service\/visitorin(\/((?!create).)*)?$/,
          ICON_CLASS: "fa-child",
          CATEGORY: '访客登记',
          // NAME: '访客'
      },
      "3-4-2": {
          PATH_RULE: /^\/home\/service\/visitorin\/create$/,
          ICON_CLASS: "fa-filter",
          CATEGORY: '访客登记',
          // NAME: '访客'
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
    "3-1-2": {
      PATH_RULE: /^\/home\/service\/contract\/((?!create).)*\/edit$/,
      ICON_CLASS: "fa-file-text-o",
      CATEGORY: '合同'
    },
    "3-2": {
      PATH: "home/service/customer",
      PATH_RULE: /^\/home\/service\/customer(\/(student|parent|contract)\/((?!create).)*)?$/,
      ICON_CLASS: "fa-graduation-cap",
      CATEGORY: '学员'
    },
    "3-2-2": {
      PATH_RULE: /^\/home\/service\/customer\/student\/((?!create).)*\/edit$/,
      ICON_CLASS: "fa-graduation-cap",
      CATEGORY: '学员'
    },
    "3-2-5": {
      PATH_RULE: /^\/home\/service\/customer\/parent\/((?!create).)*\/edit$/,
      ICON_CLASS: "fa-graduation-cap",
      CATEGORY: '学员'
    },


    //财务相关权限配置
    "4": {ICON_CLASS: "fa-money"},


    //教务相关权限配置
    "5": {ICON_CLASS: "fa-calendar-check-o"},


    //教学相关权限配置
    "6": {ICON_CLASS: "fa-stack-overflow"},


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
    "7-4-2": {PATH_RULE: /^\/home\/users\/((?!create).)*$/}
  },

  TYPE_ID: {1: '线索', 2: '新招', 3: '续报'},
  DOCUMENT: {1: '身份证'}
};
