import { http } from '../api/http'
export default {
    data() {
        /**
         * @param {navgroup} 动态导航菜单默认值
          */
        return {
            username: '',
            navgroup: []
        }
    },
    created() {
        this.getUserInfo();
    },
    methods: {
        getUserInfo() {
            http("/login/getloginuser", "get").then(res => {
                this.username = res.username;
                this.navgroup =res.menu
            });
        }
    }
}






// [
//     {
//         name: '基础静态数据',
//         icon: 'el-icon-menu',
//         sonMenu: [
//             {
//                 name: "型号信息",
//                 router: { path: "/home/modalInfo" }
//             },
//             {
//                 name: "单机信息",
//                 router: { path: "/home/singelModal" }
//             },
//             // {
//             //     name: "关键件信息",
//             //     router: { path: "/home/keyComponentInfo" }
//             // },
//             // {
//             //     name: "关键部位信息",
//             //     router: { path: "/home/keyPosition" }
//             // },
//             // {
//             //     name: "当量基准损伤",
//             //     router: { path: "/home/equivalent" }
//             // },
//             // {
//             //     name: "关键部位基准损伤",
//             //     router: { path: "/home/keyPosEquivalent" }
//             // },
//             // {
//             //     name: "飞行科目信息",
//             //     router: { path: "/home/flightCourse" }
//             // },
//             // {
//             //     name: "材料信息",
//             //     router: { path: "/home/materialInfo" }
//             // },

//         ]
//     },
//     {
//         name: '数据导入计算',
//         icon: 'el-icon-menu',
//         sonMenu: [
//             {
//                 name: "数据导入计算",
//                 router: { path: "/home/dataComputed" }
//             },
//             {
//                 name: "数据同步",
//                 router: { path: "/home/dataSync" }
//             },
//         ]
//     },
//     {
//         name: '数据查询统计',
//         icon: 'el-icon-menu',
//         sonMenu: [
//             {
//                 name: "飞参数据",
//                 router: { path: "/home/fdrData" }
//             },
//             {
//                 name: "飞参曲线",
//                 router: { path: "/home/fdrBight" }
//             },
//             {
//                 name: "单机履历信息",
//                 router: { path: "/home/standMessage" }
//             },
//             // {
//             //     name: "机动动作统计",
//             //     router: { path: "/home/flexibleStatistics" }
//             // },
//             // {
//             //     name: "科目统计",
//             //     router: { path: "/home/subjectStatistics" }
//             // },
//             // {
//             //     name: "载荷超越数统计",
//             //     router: { path: "/home/loadStatistics" }
//             // },
//             // {
//             //     name: "结构超载情况统计",
//             //     router: { path: "/home/structuralStatistics" }
//             // },
//             // {
//             //     name: "单机结构损伤情况",
//             //     router: { path: "/home/SingleDamage" }
//             // },
//             // {
//             //     name: "机群结构损伤情况",
//             //     router: { path: "/home/structuralGroup" }
//             // },
//         ]
//     },
//     // {
//     //     name: '报表定制',
//     //     icon: 'el-icon-location',
//     //     sonMenu: [
//     //         {
//     //             name: "报表定制",
//     //             router: { path: "/home/report" }
//     //         },
//     //     ]
//     // },
//     {
//         name: '系统管理',
//         icon: 'el-icon-menu',
//         sonMenu: [
//             // {
//             //     name: "菜单管理",
//             //     router: { path: "/home/menuManagel" }
//             // },
//             {
//                 name: "部门管理",
//                 router: { path: "/home/departmentManage" }
//             },
//             {
//                 name: "角色管理",
//                 router: { path: "/home/roleManagel" }
//             },
//             {
//                 name: "人员管理",
//                 router: { path: "/home/personnelManage" }
//             },
//             // {
//             //     name: "参数维护",
//             //     router: { path: "/home/paramMaintain" }
//             // },
//             {
//                 name: "飞参字段设置",
//                 router: { path: "/home/flightField" }
//             },
//         ]
//     },
// ],