var config = {
    "menulist": {
        "visible": "true",
        "style": "wx",
        "menu": [
            {
                "icon": "a9_.png",
                "actionid": "4",
                "font-size": "16",
                "name": "设置24666"
            },
            {
                "icon": "a9_.png",
                "actionid": "4",
                "font-size": "16",
                "name": "设置24666"
            },
            {
                "icon": "a9_.png",
                "actionid": "4",
                "font-size": "16",
                "name": "设置24666"
            }

        ]
    },
    "title": "中国有色集团企业门户",
    "tabbar": {
        "visible": "true",
        "extend": "true",
        "background": "value",
        "tabitem": [
            {
                "color": "#EAEAEA",
                "name": "消息",
                "icon-background-image": "alh.png",
                "icon-pressed-image": "alg.png",
                "onclick": "0",
                "font-pressed-color": "#2dbb69"
            },
            {
                "color": "#EAEAEA",
                "name": "通讯录",
                "icon-background-image": "ald.png",
                "icon-pressed-image": "alc.png",
                "onclick": "1",
                "font-pressed-color": "#2dbb69"
            },
            {
                "color": "#EAEAEA",
                "name": "新闻",
                "icon-background-image": "all.png",
                "icon-pressed-image": "alk.png",
                "onclick": "2",
                "font-pressed-color": "#2dbb69"
            },
            {
                "color": "#EAEAEA",
                "name": "待办",
                "icon-background-image": "alq.png",
                "icon-pressed-image": "alo.png",
                "onclick": "3",
                "font-pressed-color": "#2dbb69"
            },
            {
                "color": "#EAEAEA",
                "name": "更多",
                "icon-background-image": "set.png",
                "icon-pressed-image": "set.png",
                "onclick": "4",
                "font-pressed-color": "#2dbb69"
            }
        ]
    },
    "pages": {
        "page": [
            {
                "viewitem": [
                    {
                        "icon": "ic_launcher.png",
                        "height": "4",
                        "name": "0",
                        "width": "4",
                        "onclick": "onclick",
                        "left": "0",
                        "type": "localview",
                        "url": "http://10.2.112.61:8080/cnmc/project.dynamic#com.yonyou.cnmc.Message",
                        "top": "0"
                    }
                ],
                "fixed": "true",
                "pageid": "value",
                "tabbarindex": "0"
            },
            {
                "viewitem": [
                    {
                        "icon": "ic_launcher.png",
                        "height": "4",
                        "name": "0",
                        "width": "4",
                        "onclick": "onclick",
                        "left": "0",
                        "type": "localview",
                        "url": "http://10.2.112.61:8080/cnmc/project.dynamic#com.yonyou.cnmc.AddressMainWin",
                        "top": "0"
                    }
                ],
                "fixed": "true",
                "pageid": "value",
                "tabbarindex": "1"
            },
            {
                "viewitem": [
                    {
                        "icon": "ic_launcher.png",
                        "height": "4",
                        "name": "0",
                        "width": "4",
                        "onclick": "onclick",
                        "left": "0",
                        "type": "localview",
                        "url": "http://10.2.112.61:8080/cnmc/project.dynamic#com.yonyou.cnmc.NewsMainWin",
                        "top": "0"
                    }
                ],
                "fixed": "true",
                "pageid": "value",
                "tabbarindex": "2"
            },
            {
                "viewitem": [
                    {
                        "icon": "ic_launcher.png",
                        "height": "4",
                        "name": "0",
                        "width": "4",
                        "onclick": "onclick",
                        "left": "0",
                        "type": "localview",
                        "url": "http://10.2.112.61:8080/cnmc/project.dynamic#com.yonyou.cnmc.TodoApprovalWin",
                        "top": "0"
                    }
                ],
                "fixed": "true",
                "pageid": "value",
                "tabbarindex": "3"
            },
            {
                "viewitem": [
                    {
                        "icon": "ic_launcher.png",
                        "height": "4",
                        "name": "0",
                        "width": "4",
                        "onclick": "onclick",
                        "left": "0",
                        "type": "label",
                        "font-size": "28",
                        "value": "更多内容敬请期待。。。",
                        "align": "center",
                        "url": "http://10.2.112.61:8080/cnmc/project.dynamic",
                        "top": "0"
                    }
                ],
                "fixed": "true",
                "pageid": "value"
            }
        ]
    },
    "action": [
        {
            "viewcontroller": "setting",
            "actionid": "0",
            "viewid": "viewid",
            "urlschemes": "portalapp",
            "page": "0",
            "packagename": "packagename",
            "method": "pageControl"
        },
        {
            "viewcontroller": "add",
            "actionid": "1",
            "viewid": "viewid",
            "urlschemes": "portalapp",
            "page": "2",
            "packagename": "packagename",
            "method": "jumpApp"
        },
        {
            "viewcontroller": "add",
            "actionid": "2",
            "viewid": "viewid",
            "urlschemes": "portalapp",
            "page": "2",
            "packagename": "packagename",
            "method": "jumpController"
        },
        {
            "viewcontroller": "add",
            "actionid": "3",
            "viewid": "viewid",
            "urlschemes": "portalapp",
            "page": "2",
            "packagename": "packagename",
            "method": "jumpController"
        },
        {
            "viewcontroller": "setting",
            "actionid": "4",
            "viewid": "viewid",
            "urlschemes": "portalapp",
            "page": "2",
            "packagename": "packagename",
            "method": "jumpController"
        }
    ],
    "appid": "xxx",
    "version": "10"
};
var apptitle = sessionStorage.apptitle;
if (apptitle) config.title = sessionStorage.apptitle;
um.set("portalconf", config);