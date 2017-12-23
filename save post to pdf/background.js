//incialize staff
var contextMenuClicked = function (info, tab) {
	chrome.tabs.sendMessage(tab.id, "getClickedEl");
};
//add context menu
chrome.contextMenus.create({
	"title": 'download post as pdf',
	"onclick": contextMenuClicked,
});
