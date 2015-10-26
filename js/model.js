var StopWatchApp = StopWatchApp || {};

StopWatchApp.Model = function(){
	var _self = this;

	_self.ticks = 0;

	_self.Time = new StopWatchApp.Time();

	_self.history = [];
};

StopWatchApp.Time = function(){
	var _self = this;

	_self.h = 0;
	_self.m = 0;
	_self.s = 0;
	_self.ms = 0;
};