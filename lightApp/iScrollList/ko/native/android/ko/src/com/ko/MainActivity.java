package com.ko;

import com.yonyou.uap.um.core.*;
import android.os.*;

public  class MainActivity extends UMWebActivity {



	@Override
	public void onInit(Bundle arg0) {
		// TODO Auto-generated method stub
		
	}
	
	@Override
	public String getControllerName() {
		return "Controller";
	}
	@Override
	public String getWebStartPage() {
		return "iscroll.html";//起始页面xxx.html
	}
	
	
	@Override
	public String getContextName() {
		return "";
	}

	@Override
	public String getNameSpace() {
		return "UMP.UI.Mvc";
	}


}

