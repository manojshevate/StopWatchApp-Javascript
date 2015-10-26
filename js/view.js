var StopWatchApp = StopWatchApp || {};

StopWatchApp.View = function(controller){
	var _self = this;

	_self.timerVariable = {};

	_self.template = null;

	_self.controls = {
		startBtn : null,
		stopBtn : null,
		resetBtn: null,
		timerDisplay: null,
		splitBtn: null,
		historyItems: null,
		stopWatch: null,
		Init : function(){
			this.startBtn = $('.jStart');
			this.stopBtn = $('.jStop');
			this.resetBtn = $('.jReset');
			this.timerDisplay = $('.jTimerDisplay');
			this.splitBtn = $(".jSplit");
			this.historyItems = $(".jHistory");
			this.stopWatch = $('.jStopWatch')
		}
	};

	_self.Init = function(){
		_self.controls.Init();
		var stopWatchIds = [];
		_self.controls.stopWatch.each(function(){
			stopWatchIds.push($(this).attr('id'));
		});
		controller.InitModel(stopWatchIds);

		_self.Bind();

		var source   = $("#historyTemplate").html();
		_self.template = Handlebars.compile(source);

		for (var i = 0; i < stopWatchIds.length; i++) {
			_self.Display(stopWatchIds[i]);
		};

	}

	_self.Timer = function(id){
		if(controller.model[id]){
			controller.model[id].ticks += 5;
			controller.model[id] = $.extend({},controller.model[id],_self.Helper.ConvertTicksToTimeSpan(controller.model[id].ticks));
			_self.Display(id);	
		}
		
	};

	_self.Display = function(id){
		var txt = _self.Helper.ConvertToText(controller.model[id].Time);
		$('#'+id).find('.jTimerDisplay').html(txt);
		var html = _self.template(controller.model[id]);
		$('#'+id).find('.jHistory').html(html);
	};

	_self.Bind= function(){
		_self.controls.startBtn.click(function(){

			var parentStopWatch = $(this).closest('.jStopWatch');
			var id = parentStopWatch.attr('id');
			_self.timerVariable[id] = controller.Start(function(){
				_self.Timer(id);
			},1);
			parentStopWatch.find('.jStart').prop("disabled",true);
			parentStopWatch.find('.jStop').prop("disabled",false);
			parentStopWatch.find('.jSplit').prop("disabled",false);
		});

		_self.controls.stopBtn.click(function(){
			
			var parentStopWatch = $(this).closest('.jStopWatch');
			var id = parentStopWatch.attr('id');

			controller.Stop(_self.timerVariable[id]);
			parentStopWatch.find('.jStop').prop("disabled",true);
			parentStopWatch.find('.jSplit').prop("disabled",true);
			_self.Helper.SaveHistory(id);
			_self.Display(id);
			_self.Helper.Export(id);
		});

		_self.controls.resetBtn.click(function(){
			var parentStopWatch = $(this).closest('.jStopWatch');
			var id = parentStopWatch.attr('id');

			controller.Reset(_self.timerVariable[id],id);
			_self.Display(id);
			parentStopWatch.find('.jStop').prop("disabled",true);
			parentStopWatch.find('.jStart').prop("disabled",false);
			parentStopWatch.find('.jSplit').prop("disabled",true);
		});

		_self.controls.splitBtn.click(function(){
			var parentStopWatch = $(this).closest('.jStopWatch');
			var id = parentStopWatch.attr('id');

			_self.Helper.SaveHistory(id);
			_self.Display(id);
		});
	};

	_self.Helper = {
		ConvertToText: function(timeSpan){
			return (timeSpan.h ? (timeSpan.h > 9 ? timeSpan.h : "0" + timeSpan.h) : "00") + ":" 
				+ (timeSpan.m ? (timeSpan.m > 9 ? timeSpan.m : "0" + timeSpan.m) : "00") + ":" 
				+ (timeSpan.s ? (timeSpan.s > 9 ? timeSpan.s : "0" + timeSpan.s) : "00") + ":" 
				+ (timeSpan.ms ? (timeSpan.ms > 99 ? timeSpan.ms : (timeSpan.ms > 9 ? "0" + timeSpan.ms : "00" + timeSpan.ms)) : "000");
		},

		Export: function(id){
			var historyStr = JSON.stringify(controller.model[id].history);
			var url = "data:text/plain;charset=utf-8," + escape(historyStr);
			var link = document.createElement("a");
			link.href = url;
			link.download = "StopWatchHistory_"+ id+".json";
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		},

		SaveHistory: function(id){
			var historyObject = {};
			historyObject.totalTime = _self.Helper.ConvertToText(controller.model[id].Time);
			historyObject.lapTime = _self.Helper.ConvertToText(controller.model[id].Time);
			historyObject.ticks = controller.model[id].ticks;

			if(controller.model[id].history && controller.model[id].history.length > 0){
				var laptime = _self.Helper.ConvertToText(_self.Helper.ConvertTicksToTimeSpan(historyObject.ticks - controller.model[id].history[controller.model[id].history.length-1].ticks).Time);
				historyObject.lapTime = laptime;
			}

			controller.model[id].history.push(historyObject);
		},

		ConvertTicksToTimeSpan: function(ticks){
			var retObj = {};
			retObj.s = Math.floor(ticks / 1000);
			retObj.m = Math.floor(retObj.s / 60);
			retObj.s = retObj.s % 60;
			retObj.h = Math.floor(retObj.m / 60);
			retObj.m = retObj.m % 60;
			retObj.h = retObj.h % 24
			retObj.ms = ticks % 1000;

			return {Time: retObj};
		}


	};
	_self.Init();
}