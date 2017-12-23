(function () {

	var clickedEl = null,
	fbPost,
	findParentBySelector = function (elm, selector) {
		var all = document.querySelectorAll(selector),
		cur = elm.parentNode,
		collectionHas = function (a, b) {
			for (var i = 0, len = a.length; i < len; i++) {
				if (a[i] == b)
					return true;
			}
			return false;
		};
		while (cur && !collectionHas(all, cur)) {
			cur = cur.parentNode;
		}
		return cur;
	},
	loadAllComment = function (el, callBack) {
		var commentSelector = '.UFIPagerLink,.UFIReplySocialSentenceLinkText,._5v47.fss',
		interval = setInterval(function () {
				Array.prototype.slice.call(el.querySelectorAll(commentSelector)).forEach(function (openCommentButton) { //method
					openCommentButton.click();
				});
				if (el.querySelectorAll(commentSelector).length == 0) {
					clearInterval(interval);
					callBack();
				}
			}, 1000);
	},
	loadCommentSection = function (el, callBack) {
		fbPost.querySelector('.comment_link._5yxe').click();
		var interval = setInterval(function () {
				if (el.querySelector('.uiUfi.UFIContainer').innerHTML.length != 0) {
					clearInterval(interval);
					callBack();
				}
			}, 1000);
	},
	PrintElem = function (el) {
		var headstr = "<html><head><title>Booking Details</title></head><body>";
		var footstr = "</body>";
		var newstr = el.innerHTML;
		var oldstr = document.body.innerHTML;
		document.body.innerHTML = headstr + newstr + footstr;
		window.print();
		document.body.innerHTML = oldstr;
		return false;
	};
	document.addEventListener("mousedown", function (e) {
		if (e.button == 2) {
			clickedEl = e.target;
		}
	}, true);
	chrome.runtime.onMessage.addListener(function (request) {
		if (request == "getClickedEl") {
			fbPost = findParentBySelector(clickedEl, '._5jmm._5pat');
			if (fbPost) { 
				loadCommentSection(fbPost, function () {
					loadAllComment(fbPost, function () {
						PrintElem(fbPost);
					});
				});
			}
		}
	});
	//return true;
})();
