/*-get right clicked element
-save element as pdf(print)
https://stackoverflow.com/questions/2255291/print-the-contents-of-a-div
http://jsfiddle.net/tn04Ldka/2/
-change post content(remove profile pic,name, change name to fictional)*/

//testpage:https://www.facebook.com/groups/878165838959829/permalink/1381193798657028/?comment_id=1387015818074826&notif_id=1513274895997144&notif_t=group_comment_reply
(function () {

	var clickedEl = null,
	fbPost,
	findParentBySelector = function (elm, selector) {
		var all = document.querySelectorAll(selector),
		cur = elm.parentNode,
		collectionHas = function (a, b) { //helper function (see below)
			for (var i = 0, len = a.length; i < len; i++) {
				if (a[i] == b)
					return true;
			}
			return false;
		};
		while (cur && !collectionHas(all, cur)) { //keep going up until you find a match
			cur = cur.parentNode; //go up
		}

		return cur; //will return null if not found
	},
	loadAllComment = function (el, callBack) {
		var commentSelector = '.UFIPagerLink,.UFIReplySocialSentenceLinkText',
		interval = setInterval(function () {
				Array.prototype.slice.call(el.querySelectorAll(commentSelector)).forEach(function (openCommentButton) { //method
					openCommentButton.click();
				});

				if (el.querySelectorAll(commentSelector).length == 0) {
					clearInterval(interval);
					callBack(); //method at last time
				}
			}, 1000);

		//condition
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

	//get right-clicked element
	document.addEventListener("mousedown", function (e) {
		//right click
		if (e.button == 2) {
			clickedEl = e.target;
		}
	}, true);

	chrome.runtime.onMessage.addListener(function (request) {
		if (request == "getClickedEl") {
			//get facebook post element(classes:_5jmm _5pat)
			fbPost = findParentBySelector(clickedEl, '._5jmm._5pat');
			if (fbPost) { //is it facebook post?

				//open all comment: ._ipm._-56 or  .UFIPagerLink  subcomment: .UFICommentLink .UFIPagerLink
				loadCommentSection(fbPost, function () {
					loadAllComment(fbPost, function () {
						//save post as pdf
						PrintElem(fbPost);
					});
				});

			}
		}
	});

	return true;
})();
