var requestMaps = null;
var postMsg = {
	message : "",
	author : "",
	time : null
};
callbackAdded = false;
var broadcastData = {
	subscriberId : null,
	contentType : null,
	content : null
};
var authors = new Array();
var subscriberId = null;
var action = null;

function multiChat(response){
    var id = response.subscriberId;
    chatboxManager.addBox(id,
    {dest:null, // not used in demo
    title:response.content.author,
    first_name:response.content.author,
    last_name:""
    //you can add your own options too
    });
}
Array.prototype.remove = function(el) {
	return this.splice(this.indexOf(el), 1);
};
function subscribeChat(subscriberId2) {
	subscriberId = subscriberId2;
	new ControlManager();
}

function agentRequest(subId) {
	subscriberId = subId;
	postMsg.message = " is requesting an agent.";
	broadcastData.contentType = "agent:request";
	broadcastData.subscriberId = subscriberId;
	broadcastData.content = postMsg;
	new ControlManager();
	post(broadcastData);
}
function subscribeAgent() {
	subscriberId = "agents";
	broadcastData.contentType = "agent:subscribe";
	broadcastData.subscriberId = subscriberId;
	broadcastData.content = postMsg;
	new ControlManager();
}

function controlConnect() {
	//controlUnsubscribe();
	controlSubscribe();
}

// jquery.atmosphere.response
function callback(response) {
	// Websocket events.
	$.atmosphere.log('info', [ "response.state: " + response.state ]);
	$.atmosphere.log('info', [ "response.transport: " + response.transport ]);
	$.atmosphere.log('info', [ "response.status: " + response.status ]);

	if (response.transport != 'polling' && response.state == 'messageReceived') {
		$.atmosphere.log('info', [ "response.responseBody: "
				+ response.responseBody ]);
		if (response.status == 200) {
			// displaymsg(response.responseBody);
			displayChat(response.responseBody);
		}
	}
}

function controlSubscribe() {
	this.callbackAdded = false;
	callbackAdded = false;
	if (requestMaps == null){
		requestMaps = new Map();
	}
	if (!this.callbackAdded) {
		var url = $.url();
		var location = url.attr('protocol') + '://' + url.attr('host') + ':'
				+ url.attr('port')
				+ '/Atmosphere-chat-web/atmosphere/subscribe';
		location = location + "?subscriberId=" + subscriberId;
		this.connectedEndpoint = $.atmosphere.subscribe(location,
				!callbackAdded ? this.callback : null, $.atmosphere.request = {
					transport : 'long-polling'
				});
		requestMaps.put(subscriberId,this.connectedEndpoint);
		this.callbackAdded = true;
	}
}
function controlUnsubscribe() {
	this.callbackAdded = false;
	$.atmosphere.unsubscribe();
}
function ControlManager() {
	this.suscribe = controlSubscribe;
	// this.unsubscribe = controlUnsubscribe;
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
function displayChat(data) {
	response = JSON.parse(data);
	color = "gray";
	datetime = new Date(response.content.time);

	name = response.content.author;
	msg = response.content.message;
	subscriberId = response.subscriberId;

	if (response.contentType.match("chat:status") != null
			&& (response.content.author != postMsg.author)) {
		var temp = document.getElementById("chat-box-typing-"+response.subscriberId);
		if (temp == null){
			var e = document.createElement('div');
	        var p = document.createElement("p");
	        $(e).append(p);
	        if (response.content.author) {
	            var peerName = document.createElement("i");
	            $(peerName).text(response.content.author + " " + response.content.message);
	            p.appendChild(peerName);
	        }
	        $(e).addClass("ui-chatbox-typing");
	        $(e).attr("id","chat-box-typing-"+response.subscriberId);
			$('#'+response.subscriberId).after(e);
		}
		else{
			$("#chat-box-typing-"+response.subscriberId).show();
		}

	} else if (response.contentType.match("chat:remove") != null
			&& (response.content.author != postMsg.author)) {
		var temp = document.getElementById("chat-box-typing-"+response.subscriberId);
		if(temp != null){
			$("#chat-box-typing-"+response.subscriberId).hide();
		}
	} else if (response.contentType.match("chat:post") != null) {
		var temp = document.getElementById("chat-box-typing-"+response.subscriberId);
		if(temp != null){
			$("#chat-box-typing-"+response.subscriberId).hide();
		}
		$("#"+response.subscriberId).chatbox("option", "boxManager").addMsg(response.content.author, response.content.message);
	} else if (response.contentType.match("agent:request") != null) {
		if (confirm(response.content.author + " " + response.content.message)) {
//			openChatWindow(response);
			multiChat(response);
			broadcastData = response;
			broadcastData.contentType = "agent:accept"; 
			broadcastData.content = postMsg;
			post(broadcastData);
			subscribeChat(response.subscriberId);
		}
	} else if (response.contentType.match("agent:accept") != null) {
//		openChatWindow(response);
		multiChat(response);
	}
	displayTypingMessage();
}
function post(object) {
	var request = $.ajax({
		url : 'rest/subscribe/chat',
		type : 'POST',
		data : JSON.stringify(object),
		contentType : "application/json; charset=utf-8",
	});
	request.fail(function(jqXHR, textStatus) {
		alert("Request failed: " + textStatus);
	});
}
function setName(event) {
	if (event.keyCode == $.ui.keyCode.ENTER) {
		temp = $.trim($(event.target).val());
		if (temp.length > 0) {
			postMsg.author = temp;
			$('#authorName').text() + ' - ' + temp;
			hideItem(event.target.id);
			$('#authorName').text($('#authorName').text() + ' - ' + temp);
			if($('#authorName').text().match("Client -") != null)
			{
				agentRequest(temp+'-'+Math.floor(Math.random()*101));
			}
		}
	}
}
//This method will be called when enter is pressed in chat text box
function chat(textItem,subId) {

	/*
	 * if(event.keyCode != $.ui.keyCode.ENTER &&
	 * (($(currentObject).val().length%4)==0) &&
	 * ($(currentObject).val().length>4)){ sendProgress(); }
	 */
	msg = $.trim($(textItem).val());
	if (msg.length > 0) {
		postMsg.message = $(textItem).val();
		broadcastData.subscriberId = subId;
		broadcastData.contentType = "chat:post";
		broadcastData.content = postMsg;
		post(broadcastData);
	}
}
function sendProgress(textItem,subId) {
	if (postMsg.author != "") {
		broadcastData.contentType = "chat:status";
		postMsg.message = "is typing a message..";// $("#input").val();
		broadcastData.content = postMsg;
		broadcastData.subscriberId = subId;
		post(broadcastData);
	}
}
function removeProgress(textItem,subId) {
	if (postMsg.author != "") {
		broadcastData.contentType = "chat:remove";// $("#input").val();
		postMsg.message = "is not typing ";
		broadcastData.content = postMsg;
		broadcastData.subscriberId = subId;
		post(broadcastData);
	}
}
function closeChat(subId){
	var req =requestMaps.get(subId);
	if (req != null){
		req.close();
	}
}
function getTimeInHtml(datetime) {
/*	var time = "'<p><span style="'color:graytext'
			+ '">'
			+ author
			+ '</span> @ '
			+ +(datetime.getHours() < 10 ? '0' + datetime.getHours() : datetime
					.getHours())
			+ ':'
			+ (datetime.getMinutes() < 10 ? '0' + datetime.getMinutes()
					: datetime.getMinutes())
			+ ':'
			+ (datetime.getSeconds() < 10 ? '0' + datetime.getSeconds()
					: datetime.getSeconds()) + ':   ' + message + '</p>'"";*/
}
function displayTypingMessage() {
	var temp = "are";
	if (authors.length > 0) {
		if (authors.length == 1) {
			temp = "is";
		}
		$("#statusDiv").text(authors.join() + " " + temp + " typing");
	} else if (authors.length == 0) {
		$("#statusDiv").text("");
	}
}

function openChatWindow(resp) {

	if (box) {
		box.chatbox("option", "boxManager").toggleBox();
	}
	else {
		$("#chat_div").append(
				"<div id='chat_div_" + resp.subscriberId + "'></div>");
		box = $("#chat_div_" + resp.subscriberId).chatbox(
				{
					id : resp.content.author,
					user : {
						key : "value"
					},
					title : resp.content.author,
					messageSent : function(id, user, msg) {
						$("#chat_div_" + resp.subscriberId).chatbox("option",
								"boxManager").addMsg(id, msg);
					}
				});
	}
}
