var cm;
var postMsg = {
		
		  message:"",
		  author:"",
		  time:"",
		  subscriberId:""
};
var authors = new Array(); 
//$(document).ready(function(){	
	//cm = new ControlManager();
 //});
Array.prototype.remove = function(el){
    return this.splice(this.indexOf(el),1);
}
function subscribeAtmosphere(){
	cm = new ControlManager();
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
		var subscriberId = $("#subscriberId").val();
		var location = url.attr('protocol') + '://' + url.attr('host') + ':' + url.attr('port') + '/Atmosphere-chat-web/atmosphere/subscribe';
		location = location + "?subscriberId="+subscriberId;
		this.connectedEndpoint = $.atmosphere.subscribe(location,
			!callbackAdded ? this.callback : null,
			$.atmosphere.request = { 
				transport: 'websocket' 
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
	this.actions = cm_actions;
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
	datetime = new Date(response.time);
	if(response.message.startsWith("Status:") && (response.author != $("#status").text())){
		if ($.inArray(response.author,authors) == -1)
		{
			authors.push(response.author);
		}
	}
	else if(response.message.startsWith("Remove:") && (response.author != $("#status").text())){
		if ($.inArray(response.author,authors) != -1)
		{
			authors.remove(response.author);
		}
	}
	else if (!response.message.startsWith("Status:") && !response.message.startsWith("Remove:")){
		if ($.inArray(response.author,authors) != -1)
		{
			authors.remove(response.author);
		}
		addMessage(response.author, response.message, color, datetime);
	}
	displayTypingMessage();
}
function post() {
	var request = $.ajax({
		url: 'rest/subscribe/toggle',
		type: 'POST',
		data: '<doc>foo</doc>',
		contentType:"application/xml; charset=utf-8",
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
	postMsg.subscriberId = $("#subscriberId").val();
	var request = $.ajax({
		url: 'rest/subscribe/chat',
		type: 'POST',
		data: JSON.stringify(postMsg),
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
	postMsg.message = "Status:";//$("#input").val();
	postMsg.subscriberId = $("#subscriberId").val();
	var request = $.ajax({
		url: 'rest/subscribe/chat',
		type: 'POST',
		data: JSON.stringify(postMsg),
		contentType:"application/json; charset=utf-8",
	});
	request.fail(function(jqXHR, textStatus) {
  		alert( "Request failed: " + textStatus );
	});
	}
}
function removeProgress() {
	if(postMsg.author != "" ){
	postMsg.message = "Remove:";//$("#input").val();
	postMsg.subscriberId = $("#subscriberId").val();
	var request = $.ajax({
		url: 'rest/subscribe/chat',
		type: 'POST',
		data: JSON.stringify(postMsg),
		contentType:"application/json; charset=utf-8",
	});
	request.fail(function(jqXHR, textStatus) {
  		alert( "Request failed: " + textStatus );
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