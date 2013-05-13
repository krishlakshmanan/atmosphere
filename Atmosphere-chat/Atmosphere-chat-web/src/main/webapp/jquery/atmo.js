var cm;

var postMsg = {
		  message:"",
		  author:"",
		  time:null
};
var broadcastData = {
		subscriberId: null,
	    contentType: null,
	    content: null
};
var authors = new Array(); 
var subscriberId = null;
var action = null;

Array.prototype.remove = function(el){
    return this.splice(this.indexOf(el),1);
};
function subscribeChat(){
	subscriberId = $("#subscriberId").val();
	cm = new ControlManager();
}

function agentRequest(){
	subscriberId = $("#subscriberId").val();
	postMsg.message = " is requesting an agent.";
	postMsg.author = $("#status").text();
	broadcastData.contentType = "agent:request";
	broadcastData.subscriberId = subscriberId;
	broadcastData.content = postMsg;
	cm =new ControlManager();
	post();
}
function subscribeAgent(){
	subscriberId = "agents";
	broadcastData.contentType = "agent:subscribe";
	broadcastData.subscriberId = subscriberId;
	broadcastData.content = postMsg;
	cm =new ControlManager();
}

function controlConnect() {
	controlUnsubscribe();
    controlSubscribe();
}

// jquery.atmosphere.response
function callback(response) {
	// Websocket events.
	$.atmosphere.log('info', ["response.state: " + response.state]);
	$.atmosphere.log('info', ["response.transport: " + response.transport]);
	$.atmosphere.log('info', ["response.status: " + response.status]);

	if (response.transport != 'polling' && response.state == 'messageReceived') {
		$.atmosphere.log('info', ["response.responseBody: " + response.responseBody]);
		if (response.status == 200) {
			var data = response.responseBody;
			if (data.length > 0) {
				displaymsg(data);
			}
		}
	}
}

function controlSubscribe() {
	if (!this.callbackAdded) {
		var url = $.url();
		var location = url.attr('protocol') + '://' + url.attr('host') + ':' + url.attr('port') + '/Atmosphere-chat-web/atmosphere/subscribe';
		location = location + "?subscriberId="+subscriberId;
		this.connectedEndpoint = $.atmosphere.subscribe(location,
			!callbackAdded ? this.callback : null,
			$.atmosphere.request = { 
				transport: 'long-polling' 
			}
		);
		
		this.callbackAdded = true;
	}	
}
function controlUnsubscribe(){
	this.callbackAdded = false;
	$.atmosphere.unsubscribe();
}
function ControlManager() {
	this.suscribe = controlSubscribe;
	this.unsubscribe = controlUnsubscribe;
	this.connect = controlConnect;
	this.callback = callback;
	this.connect();
}
function showItem(id) {
	$(id).show();
}
function hideItem(id) {
	$(id).hide();
}
function displaymsg(data) {	
	response = JSON.parse(data);
	color = "gray";
	datetime = new Date(response.content.time);
	if(response.contentType.match("chat:status")!=null && (response.content.author != $("#status").text())){
		if ($.inArray(response.content.author,authors) == -1)
		{
			authors.push(response.content.author);
		}
	}
	else if(response.contentType.match("chat:remove") != null && (response.content.author != $("#status").text())){
		if ($.inArray(response.content.author,authors) != -1)
		{
			authors.remove(response.content.author);
		}
	}
	else if (response.contentType.match("chat:post") != null){
		if ($.inArray(response.content.author,authors) != -1)
		{
			authors.remove(response.content.author);
		}
		addMessage(response.content.author, response.content.message, color, datetime);
	}
	else if(response.contentType.match("agent:request") != null){
		alert(response.content.author +" " +response.content.message);
		if (true)
		{
			$("#subscriberId").val = response.subscriberId;
			cm = new ControlManager();
		}
	}
	displayTypingMessage();
}
function post() {
	var request = $.ajax({
		url: 'rest/subscribe/chat',
		type: 'POST',
		data:JSON.stringify(broadcastData),
		contentType:"application/json; charset=utf-8",
	});
	request.fail(function(jqXHR, textStatus) {
  		alert( "Request failed: " + textStatus );
	});
}

function chat(event) {
	if(event.keyCode !=  13 && (($("#input").val().length%4)==0) && ($("#input").val().length>4)){
		sendProgress();
	}else if(event.keyCode ==  13){
	if(postMsg.author == "" ){
		postMsg.author = $("#input").val();
		$("#status").html($("#input").val());
		$("#input").val("").attr('placeholder','Enter your msg here');
		return;
	}
	postMsg.message = $("#input").val();
	broadcastData.subscriberId = $("#subscriberId").val();
	broadcastData.contentType = "chat:post";
	broadcastData.content = postMsg;
	var request = $.ajax({
		url: 'rest/subscribe/chat',
		type: 'POST',
		data: JSON.stringify(broadcastData),
		contentType:"application/json; charset=utf-8",
	});
    $("#input").val("");	
	request.fail(function(jqXHR, textStatus) {
  		alert( "Request failed: " + textStatus );
	});
	}
}
function sendProgress() {
	if(postMsg.author != "" ){
	broadcastData.contentType = "chat:status";
	postMsg.message = "is typing ";//$("#input").val();
	broadcastData.content = postMsg;
	broadcastData.subscriberId = $("#subscriberId").val();
	var request = $.ajax({
		url: 'rest/subscribe/chat',
		type: 'POST',
		data:JSON.stringify(broadcastData),
		contentType:"application/json; charset=utf-8",
	});
	request.fail(function(jqXHR, textStatus) {
  		alert( "Request failed: sendProgress " + textStatus );
	});
	}
}
function removeProgress() {
	if(postMsg.author != "" ){
	broadcastData.contentType = "chat:remove";//$("#input").val();
	postMsg.message = "is not typing ";
	broadcastData.content = postMsg;
	broadcastData.subscriberId = $("#subscriberId").val();
	var request = $.ajax({
		url: 'rest/subscribe/chat',
		type: 'POST',
		data: JSON.stringify(broadcastData),
		contentType:"application/json; charset=utf-8",
	});
	request.fail(function(jqXHR, textStatus) {
  		alert( "Request failed: removeProgress " + textStatus );
	});
	}
}

function addMessage(author, message, color, datetime) {
	content = $('#content');
    content.append('<p><span style="color:' + color + '">' + author + '</span> @ ' +
        + (datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime.getHours()) + ':'
        + (datetime.getMinutes() < 10 ? '0' + datetime.getMinutes() : datetime.getMinutes())+':'
        + (datetime.getSeconds() < 10 ? '0' + datetime.getSeconds() : datetime.getSeconds())
        + ':   ' + message + '</p>');
    $("#statusDiv").text("");
 }
function displayTypingMessage() {
	var temp ="are";
	if (authors.length > 0 ){
		if (authors.length == 1){
			temp = "is";
		}
		$("#statusDiv").text(authors.join()+" "+temp+" typing");
	}
	else if (authors.length == 0){
		$("#statusDiv").text("");
	}
 }