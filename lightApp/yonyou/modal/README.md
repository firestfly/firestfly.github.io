# 仿IOS8弹窗插件

##参数介绍
1. string ---- UModal.alert(str)

2. 对象object 
     ```
{
      title:string //标题,
      text: string //文本内容,
      btnText: Array //["确定","取消"],分别设置左右2个按钮的文本
      ok:function(data)  //对带有ok类按钮的回调函数,data为prompt和login模态框中输入框的值
      cancle: function //对带有cancle类按钮的回调函数
 }
```
```
<a href="##" class="btn btn-group alert">alert</a>
<a href="##" class="btn btn-group tips">tips</a>
<a href="##" class="btn btn-group confirm">confirm</a>
<a href="##" class="btn btn-group load">loading</a>
<a href="##" class="btn btn-group prompt">prompt</a>
<a href="##" class="btn btn-group login">login</a>
```
##调用方式

###alert警告框
```
$(".alert").click(function(){
  UModal.alert({title:"你是谁？",text:"这是弹出框框"});
})
```
或者UModal.alert("这是警告信息");

###confirm确认框
```
$(".confirm").click(function(){
  UModal.confirm(
    {
      ok:function(){
        UModal.alert("您确定了");
      },
      cancle:function(){
        UModal.alert("您取消了");
      },
      btnText: ["ok","取消"]
  });
})
```

> 注意：由于alert,confirm有按钮触发函数调用的功能，比如在具有类.ok的按钮上触发参数列表的ok函数，
在loading加载模态框和tips提示框中无按钮形式的回调，要使其具有回调功能可同下添加回调函数

###tips提示框

```
$(".tips").click(function() {
  var tips = UModal.tips("正在加载...",1200,function(){
    UModal.alert("加载完成");
  });
})
```
###loading加载
```
$(".load").click(function() {
  var loading = UModal.loading(null,1200,function(){
    UModal.alert("加载完成");
  });
})
```

###prompt输入信息
```
$(".prompt").click(function(){
  UModal.prompt(
    {
     ok:function(data) {
      UModal.alert("你输入的是：" + data);
     }
  });
})
```
###login登录框

```
$(".login").click(function(){
  UModal.login(
    {
     ok:function(data) {
      UModal.alert("你输入的是：<br>" + data[0] + "<br>" + data[1]);
     },
     btnText: ["登录","取消"]
  });
})
```
login登陆框的输入值通过ok函数的data数组按照输入框顺序获取，如data[0]为第一个输入框的值
