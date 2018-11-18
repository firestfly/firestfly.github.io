(function(){
	Index.menu.getReqMenuId = Portal.services.getHashMenu ;
	
	Index.menu.setReqMenuId = Portal.services.setHashMenu ;

	//获取菜单数据
	var menus =Portal.services.getMenus();
	
	$(menus).each(function(index,menu){
		$.extend(this,{'name':menu.title})
	}) ;
	
	//快捷菜单获取
	var shortCuts = Portal.services.getShortcut() ;
	
	//get Config
	var _portal = Portal.services.getBaseInfo();
	
	var themes = [
		{code:"mobile",name:"万科物业"}
	] ;
	
	//渲染
	$.pageLoad.register("before",function(){
		if (canChangeTheme) {
			Index.theme.render(themes) ;
		}
		
		Index.menu.init(menus) ;
		
		Index.shortcut.render(shortCuts) ;
		
		if( _portal ){
			$(".copyright").html(_portal.footer) ;
		
			//window.title = _portal.title ;
			//title
			// _portal.title
		}
	});
	
})() ;
