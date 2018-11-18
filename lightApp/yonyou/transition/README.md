# transition

## Page CSS3 transitions
---

[Demo](http://fire17643.github.io/transition/)

`data-transition`取值如下

f7      slide      slideup      fade      slidefade      slideupfade      slide_ease      pop      slide_scale      scale_pop      scale_down_up      scale_slide

**只需要在需要动画的地方添加如`data-transition="f7"`即可**

```
<a href="#item2" data-transition="f7">f7 ></a>
```

##反向动画

为需要反向动画的添加`.back`类或者添加`data-transition="slidefade"`即可

```
<a href="#item1" class="back" data-transition="slidefade">&lt;slidefade</a>
<a href="#item1" data-reverse="true" data-transition="door">&lt;door</a>
```

##js控制动画

```
var options = {
	transition: "pop", // 动画形式
	isReverse: 0, // 是否反向
	currPage: $(this), // 当前页
	nextPage: $(this).next() // 动画跳转的下一页
}
transFun(options);
```