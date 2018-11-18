var PageTransitions = (function() {
	var $pages = $('div.page'),
		current = 0, // 初始化第一页
		endCurrPage = false,
		endNextPage = false,
		isReverse = 0,
		animEndEventNames = ['webkitAnimationEnd', 'oAnimationEnd', 'MSAnimationEnd', 'animationend'],
		//animEndEventNames = ['webkitAnimationEnd','oAnimationEnd','MSAnimationEnd','animationend'];
		animEndEventName = animEndEventNames[0],
		outClass = '',
		inClass = '',
		hashArr = [];

	function init() {
		$pages.each(function() {
			var $page = $(this);
			$page.data('originalClassList', $page.attr('class'));
		});

		var currentPage = "#" + $pages.eq(current).attr("id");
		$pages.eq(current).addClass('active');
	}

	function enterPage(e) {
		e.preventDefault();
		e.stopPropagation();
		var $currPage = $(this).closest(".page");
		var target = $(this).attr("href");
		var $this = $(this);
		
		if ($(target).length) {
			$nextPage = $(target);
			hashArr.push($currPage.attr("id"));
		}else {
			var len = hashArr.length;
			if(len) {
				$nextPage = $("#" + hashArr[len - 1]);
				hashArr.pop();
			}
		}
		if ($this.hasClass("back") || ($this.data("reverse") == "true")) {
			isReverse = 1;
		} else {
			isReverse = 0;
		}
		//var transition = Number($(this).data("transition")) || 1;
		// door
/*
f7
slide
slideup
fade
slidefade
slideupfade
slide_ease
pop
slide_scale
scale_pop
scale_down_up
scale_slide
*/

		var trans = $(this).data("transition") || "slide_ease";
		var options = {
			transition: trans,
			isReverse: isReverse,
			currPage: $currPage,
			nextPage: $nextPage
		}
		transFun(options);
		return false;
	}

	function currPageTrans(options) {
		options.currPage.addClass(outClass).on(animEndEventName, function() {
			options.currPage.off(animEndEventName);
			endCurrPage = true;
			if (endNextPage) {
				onEndAnimation(options.currPage, options.nextPage);
			}
		});
	}

	function nextPageTrans(options) {
		options.nextPage.addClass(inClass).on(animEndEventName, function() {
			options.nextPage.off(animEndEventName);
			endNextPage = true;
			if (endCurrPage) {
				onEndAnimation(options.currPage, options.nextPage);
			}
		});
	}

	function transFun(options) {
		options.nextPage.addClass("active");
		try {
			setTransitionClass(options.transition);
			setTimeout(function(){
				currPageTrans(options);
				nextPageTrans(options);
			},0)
		} catch (e) {
			console.log(e)
		}
	}

	function onEndAnimation($outpage, $inpage) {
		endCurrPage = false;
		endNextPage = false;
		resetPage($outpage, $inpage);
	}

	function resetPage($outpage, $inpage) {
		$outpage.attr('class', $outpage.data('originalClassList'));
		$inpage.attr('class', $inpage.data('originalClassList') + ' active');
	}

	function setTransitionClass(flag) {
		switch (flag) {
			case "door":// 开门旋转
				outClass = 'rotatePushLeft';
				inClass = 'rotatePullRight';
				if (isReverse) {
					outClass = 'rotatePushRight';
					inClass = 'rotatePullLeft';
				}
				break;
			case "f7" :
				outClass = 'page-from-center-to-left';
				inClass = 'page-from-right-to-center';
				if (isReverse) {
					outClass = 'page-from-center-to-right';
					inClass = 'page-from-left-to-center';
				}
				break;
			case "slide":
				outClass = 'moveToLeft';
				inClass = 'moveFromRight';

				if (isReverse) {
					outClass = 'moveToRight';
					inClass = 'moveFromLeft';
				}
				break;
			case "slideup": 
				outClass = 'moveToTop';
				inClass = 'moveFromBottom';
				if (isReverse) {
					outClass = 'moveToBottom';
					inClass = 'moveFromTop';
				}
				break;
			case "fade": // fade
				outClass = 'fadeOut';
				inClass = 'fadeIn';
				break;
			case "slidefade":
				outClass = 'moveToLeftFade';
				inClass = 'moveFromRightFade';
				if (isReverse) {
					outClass = 'moveToRightFade';
					inClass = 'moveFromLeftFade';
				}
				break;
			case "slideupfade":
				outClass = 'moveToTopFade';
				inClass = 'moveFromBottomFade';
				if (isReverse) {
					outClass = 'moveToBottomFade';
					inClass = 'moveFromTopFade';
				}
				break;
			case "slide_ease":
				outClass = 'moveToLeftEasing';
				inClass = 'moveFromRight';
				if (isReverse) {
					outClass = 'moveToRightEasing';
					inClass = 'moveFromLeft';
				}
				break;
			case "pop":
				outClass = 'fadeIn';
				inClass = 'moveFromBottom';
				if (isReverse) {
					outClass = 'moveToBottomEasing';
					inClass = 'fadeIn';
				}
				break;
			case "slide_scale":
				outClass = 'scaleDown';
				inClass = 'moveFromRight';
				if (isReverse) {
					outClass = 'scaleDown';
					inClass = 'moveFromLeft';
				}
				break;
			case "scale_pop":
				outClass = 'scaleDown';
				inClass = 'moveFromBottom';
				if (isReverse) {
					outClass = 'scaleDown';
					inClass = 'moveFromTop';
				}
				break;
			case "scale_down_up":
				outClass = 'scaleDownUp';
				inClass = 'scaleUp';
				if (isReverse) {
					outClass = 'scaleDown';
					inClass = 'scaleUpDown';
				}
				break;
			case "scale_slide":
				outClass = 'moveToLeft';
				inClass = 'scaleUp';
				if (isReverse) {
					outClass = 'moveToRight';
					inClass = 'scaleUp';
				}
				break;
			/*case 25:
				outClass = 'moveToTop';
				inClass = 'scaleUp';
				if (isReverse) {
					outClass = 'moveToBottom';
					inClass = 'scaleUp';
				}
				break;
			case 27:
				outClass = 'scaleDownCenter';
				inClass = 'scaleUpCenter';
				break;
			case 28:
				outClass = 'rotateRightSideFirst';
				inClass = 'moveFromRight';
				if (isReverse) {
					outClass = 'rotateLeftSideFirst';
					inClass = 'moveFromLeft';
				}
				break;
			case 30:
				outClass = 'rotateTopSideFirst';
				inClass = 'moveFromTop';
				if (isReverse) {
					outClass = 'rotateBottomSideFirst';
					inClass = 'moveFromBottom';
				}
				break;
			case 32:
				outClass = 'flipOutRight';
				inClass = 'flipInLeft';
				if (isReverse) {
					outClass = 'flipOutLeft';
					inClass = 'flipInRight';
				}
				break;
			case 34:
				outClass = 'flipOutTop';
				inClass = 'flipInBottom';
				if (isReverse) {
					outClass = 'flipOutBottom';
					inClass = 'flipInTop';
				}
				break;
			case 40:
				outClass = 'rotatePushTop';
				inClass = 'moveFromBottom';
				if (isReverse) {
					outClass = 'rotatePushBottom';
					inClass = 'moveFromTop';
				}
				break;*/
			case "fall":
				outClass = 'rotateFall';
				inClass = 'scaleUp';
				break;
			case "rotate":
				outClass = 'rotateOutNewspaper';
				inClass = 'rotateInNewspaper';
				break;
			case "push_left":
				outClass = 'rotatePushLeft';
				inClass = 'moveFromRight';
				if (isReverse) {
					outClass = 'rotatePushRight';
					inClass = 'moveFromLeft';
				}
				break;
			case "push_top":
				outClass = 'rotatePushTop';
				inClass = 'rotatePullBottom';
				if (isReverse) {
					outClass = 'rotatePushBottom';
					inClass = 'rotatePullTop';
				}
				break;
			case "turn":
				outClass = 'rotatePushLeft';
				inClass = 'rotatePullRight';
				if (isReverse) {
					outClass = 'rotatePushRight';
					inClass = 'rotatePullLeft';
				}
				break;
			case "cube":
				outClass = 'rotateFoldLeft';
				inClass = 'moveFromRightFade';
				if (isReverse) {
					outClass = 'rotateFoldRight';
					inClass = 'moveFromLeftFade';
				}
				break;
			case "cube_pop":
				outClass = 'rotateFoldTop';
				inClass = 'moveFromBottomFade';
				if (isReverse) {
					outClass = 'rotateFoldBottom';
					inClass = 'moveFromTopFade';
				}
				break;
			case "cube_slide":
				outClass = 'moveToLeftFade';
				inClass = 'rotateUnfoldRight';
				if (isReverse) {
					outClass = 'moveToRightFade';
					inClass = 'rotateUnfoldLeft';
				}
				break;
			case "cube_":
				outClass = 'rotateCubeLeftOut';
				inClass = 'rotateCubeLeftIn';
				if (isReverse) {
					outClass = 'rotateCubeRightOut';
					inClass = 'rotateCubeRightIn';
				}
				break;
			case "flow":
				outClass = 'rotateSlideOut';
				inClass = 'rotateSlideIn';
				if (isReverse) {
					outClass = 'moveToRight';
					inClass = 'moveFromLeft';
				}
				break;
			/*case 52:
				outClass = 'moveToBottomFade';
				inClass = 'rotateUnfoldTop';
				if (isReverse) {
					outClass = 'moveToTopFade';
					inClass = 'rotateUnfoldBottom';
				}
				break;
			case 54:
				outClass = 'rotateRoomLeftOut';
				inClass = 'rotateRoomLeftIn';
				if (isReverse) {
					outClass = 'rotateRoomRightOut';
					inClass = 'rotateRoomRightIn';
				}
				break;
			case 56:
				outClass = 'rotateRoomTopOut';
				inClass = 'rotateRoomTopIn';
				if (isReverse) {
					outClass = 'rotateRoomBottomOut';
					inClass = 'rotateRoomBottomIn';
				}
				break;
			case 60:
				outClass = 'rotateCubeTopOut';
				inClass = 'rotateCubeTopIn';
				if (isReverse) {
					outClass = 'rotateCubeBottomOut';
					inClass = 'rotateCubeBottomIn';
				}
				break;
			case 62:
				outClass = 'rotateCarouselLeftOut';
				inClass = 'rotateCarouselLeftIn';
				if (isReverse) {
					outClass = 'rotateCarouselRightOut';
					inClass = 'rotateCarouselRightIn';
				}
				break;
			case 64:
				outClass = 'rotateCarouselTopOut';
				inClass = 'rotateCarouselTopIn';
				if (isReverse) {
					outClass = 'rotateCarouselBottomOut';
					inClass = 'rotateCarouselBottomIn';
				}
				break;*/
		}
	}

	init();
	$("a[href^=#]").on("click", enterPage);
	$("button.btn").on("click", function() {
		var options = {
			transition: "pop",
			isReverse: 0,
			currPage: $(this),
			nextPage: $(this).next()
		}
		transFun(options);
	});
	return {
		init: init
	};
})();