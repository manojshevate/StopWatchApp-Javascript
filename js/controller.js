var StopWatchApp  = StopWatchApp || {};

StopWatchApp.Controller = function(m){
	var _self = this;

	_self.model = $.extend({},m);

	_self.Start = function(f,interval){
		return setInterval(f,interval);
	};

	_self.Stop = function(f){
		clearInterval(f)
	};

	_self.Reset = function(f,id){
		clearInterval(f);
		_self.ResetModel(id);
	};

	_self.ResetModel = function(id){
		if(_self.model && _self.model[id]){
			_self.model[id] = new StopWatchApp.Model();
		}
	};


	_self.InitModel = function(ids){
		for (var i = 0; i < ids.length; i++) {
			_self.model[ids[i]] = new StopWatchApp.Model();
		};
	};

};