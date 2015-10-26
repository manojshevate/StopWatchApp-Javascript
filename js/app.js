var StopWatchApp = StopWatchApp || {};

StopWatchApp.Init = function(){
	var model = {};
	var controller = new StopWatchApp.Controller(model);
	var view = new StopWatchApp.View(controller);
};

$(function(){
	StopWatchApp.Init();
})

