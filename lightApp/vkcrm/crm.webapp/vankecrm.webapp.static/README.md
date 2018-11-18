# 静态资源站点开发说明

### 环境准备

#### SCSS编辑工具 
1. Koala
	1. 将web/src/scss目录加入koala文件夹
2. Ruby sass
    1. 自行安装Ruby sass 压缩合并工具(OS X 系统自带Ruby,仅需gem install sass PS:需FQ,Windows 系统请自行安装)

#### 压缩合并任务
1. Grunt
	1. 安装[nodejs](https://nodejs.org)
	2. 安装grunt命令 `npm install -g grunt-cli`
	3. 安装npm包，在web目录中运行 `npm install`
	4. 修改完src目录下的js或者scss后运行命令 `grunt`,将自动压缩合并成tar.gz包

### 自动监控压缩合并
1. Grunt watch
    1. 安装[nodejs](https://nodejs.org)
	2. 安装grunt命令 `npm install -g grunt-cli`
	3. 安装npm包，在web目录中运行 `npm install`
    4. 显示 `Running "watch" task
      Waiting...` 既为开始监听文件变更,自动压缩合并
    5. 修改完src目录下的js或者scss后将自动压缩合并打包成tar.gz包

### 目录说明(web目录)
+ __css__ 	
	> 编译后样式存放目录（勿手工修改）
	
+ __font__ 
	> iconfont存放目录
	
+ __img__
	> 图片存放目录
	
+ __js__
	> js脚本存放目录（勿手工修改）
	
+ __lib__
	> js库存放目录
	
+ __src/js__
	> 原始js脚本存放目录（合并前，压缩前）

+ __src/scss__
	> 原始样式存放目录（合并前，压缩前）
	
__js脚本和样式应该修改src目录中的文件，请勿修改css和js目录中的内容__ 	

