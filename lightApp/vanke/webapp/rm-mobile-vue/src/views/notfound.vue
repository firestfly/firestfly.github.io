<template>
  <div class="apps flexbox ev__space__between">
    <div class="inner-panel block">
      <p style="height: 100px;">
        <img src="../assets/images/icon-error.png" width="100" alt="">
      </p>
      <h2 class="alert-h2">操作失败</h2>
      <p class="gray">网络链接出错，或系统故障，请返回上一页重新操作；或者回首页浏览其它内容！</p>
      <div class="ev-btn-grounp">
        <router-link class="ev-btn ev-btn--defualt" :to="{name: 'home'}">
          回首页
        </router-link>
      </div>
    </div>
    <p class="copyright">Copyright&copy; 2017</p>
  </div>
</template>

<style scoped>
.alert-h2{
	margin: 40px 0 20px;
}
.ev-btn-grounp .ev-btn{
	margin-bottom: 10px;
}
.copyright{
	color: #999;
	font-size: 12px;
}
.inner-panel{
	text-align: center;
}

</style>
