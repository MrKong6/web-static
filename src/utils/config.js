export default {
  AUTH: {
    //市场相关权限配置
    "1": {ICON_CLASS: "fa-balance-scale"},
    "1-1": {
      PATH: "mkt/act",
      PATH_RULE: /^\/mkt\/act(\/((?!create).)*)?$/,
      ICON_CLASS: "fa-pie-chart",
      CATEGORY: '市场',
      NAME: '活动'
    },
    "1-1-1": {
      PATH_RULE: /^\/mkt\/act\/create$/,
      ICON_CLASS: "fa-pie-chart",
      CATEGORY: '市场',
      NAME: '活动'
    },
    "1-1-2": {
      PATH_RULE: /^\/mkt\/act\/((?!create).)*\/edit$/,
      ICON_CLASS: "fa-pie-chart",
      CATEGORY: '市场',
      NAME: '活动'
    },
    "1-2": {
      PATH: "mkt/leads",
      PATH_RULE: /^\/mkt\/leads(\/((?!create).)*)?$/,
      ICON_CLASS: "fa-filter",
      CATEGORY: '销售',
      NAME: '线索'
    },
    "1-2-1": {
      PATH_RULE: /^\/mkt\/leads\/create$/,
      ICON_CLASS: "fa-filter",
      CATEGORY: '销售',
      NAME: '线索'
    },
    "1-2-2": {
      PATH_RULE: /^\/mkt\/leads\/edit\/((?!create).)*$/,
      ICON_CLASS: "fa-filter",
      CATEGORY: '销售',
      NAME: '线索'
    },


    //销售相关权限配置
    "2": {ICON_CLASS: "fa-tags"},
    "2-1": {
      PATH: "sales/oppor",
      PATH_RULE: /^\/sales\/oppor(\/((?!create).)*)?$/,
      ICON_CLASS: "fa-file-o",
      CATEGORY: '销售',
      NAME: '机会'
    },
    "2-1-1": {
      PATH_RULE: /^\/sales\/oppor\/create$/,
      ICON_CLASS: "fa-file-o",
      CATEGORY: '销售',
      NAME: '机会'
    },
    "2-1-2": {
      PATH_RULE: /^\/sales\/oppor\/((?!create).)*\/edit$/,
      ICON_CLASS: "fa-file-o",
      CATEGORY: '销售',
      NAME: '机会'
    },
    "2-2": {
      PATH: "sales/contract",
      PATH_RULE: /^\/sales\/contract(\/((?!create).)*)?$/,
      ICON_CLASS: "fa-file-text-o",
      CATEGORY: '我的',
      NAME: '合同'
    },
    "2-2-1": {
      PATH_RULE: /^\/sales\/contract\/create$/,
      ICON_CLASS: "fa-file-text-o",
      CATEGORY: '我的',
      NAME: '合同'
    },
    "2-2-2": {
      PATH_RULE: /^\/sales\/contract\/((?!create).)*\/edit$/,
      ICON_CLASS: "fa-file-text-o",
      CATEGORY: '我的',
      NAME: '合同'
    },
    "2-3": {
      PATH: "sales/customer",
      PATH_RULE: /^\/sales\/customer(\/(student|parent|contract)\/((?!create).)*)?$/,
      ICON_CLASS: "fa-graduation-cap",
      CATEGORY: '我的',
      NAME: '学员'
    },
    "2-3-2": {
      PATH_RULE: /^\/sales\/customer\/student\/((?!create).)*\/edit$/,
      ICON_CLASS: "fa-graduation-cap",
      CATEGORY: '我的',
      NAME: '学员'
    },
    "2-3-5": {
      PATH_RULE: /^\/sales\/customer\/parent\/((?!create).)*\/edit$/,
      ICON_CLASS: "fa-graduation-cap",
      CATEGORY: '我的',
      NAME: '学员'
    },


    //服务相关权限配置
    "3": {ICON_CLASS: "fa-cogs"},
    "3-1": {
      PATH: "service/contract",
      PATH_RULE: /^\/service\/contract(\/((?!create).)*)?$/,
      ICON_CLASS: "fa-file-text-o",
      CATEGORY: '合同'
    },
    "3-1-2": {
      PATH_RULE: /^\/service\/contract\/((?!create).)*\/edit$/,
      ICON_CLASS: "fa-file-text-o",
      CATEGORY: '合同'
    },
    "3-2": {
      PATH: "service/customer",
      PATH_RULE: /^\/service\/customer(\/(student|parent|contract)\/((?!create).)*)?$/,
      ICON_CLASS: "fa-graduation-cap",
      CATEGORY: '学员'
    },
    "3-2-2": {
      PATH_RULE: /^\/service\/customer\/student\/((?!create).)*\/edit$/,
      ICON_CLASS: "fa-graduation-cap",
      CATEGORY: '学员'
    },
    "3-2-5": {
      PATH_RULE: /^\/service\/customer\/parent\/((?!create).)*\/edit$/,
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
      PATH: "groups",
      PATH_RULE: /^\/groups$/,
      ICON_CLASS: "fa-sitemap"
    },
    "7-1-1": {PATH_RULE: /^\/groups\/create$/},
    "7-1-2": {PATH_RULE: /^\/groups\/((?!create).)*$/},
    "7-2": {
      PATH: "roles",
      PATH_RULE: /^\/roles$/,
      ICON_CLASS: "fa-shield"
    },
    "7-2-1": {PATH_RULE: /^\/roles\/create$/},
    "7-2-2": {PATH_RULE: /^\/roles\/((?!create).)*$/},

    "7-3": {
      PATH: "permissions",
      PATH_RULE: /^\/permissions$/,
      ICON_CLASS: "fa-users"
    },

    "7-4": {PATH: "users", PATH_RULE: /^\/users$/, ICON_CLASS: "fa-user"},
    "7-4-1": {PATH_RULE: /^\/users\/create$/},
    "7-4-2": {PATH_RULE: /^\/users\/((?!create).)*$/}
  },

  TYPE_ID: {1: '线索', 2: '新招', 3: '续报'},
  DOCUMENT: {1: '身份证'}
};
