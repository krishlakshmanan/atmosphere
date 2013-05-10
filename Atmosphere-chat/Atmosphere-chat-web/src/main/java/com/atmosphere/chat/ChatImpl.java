package com.atmosphere.chat;

import java.util.Date;

import javax.ejb.LocalBean;
import javax.ejb.Stateless;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Response;

import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.cpr.BroadcasterFactory;

import com.atmosphere.utils.JsonUtils;

@Path("/subscribe")
@Stateless
@LocalBean
public class ChatImpl implements IChat {

	@Override
	@POST
	@Path("/chat")
	public Response chat(Data data) {
		data.setTime(new Date().getTime());
		notifySubscribers(data, data.getSubscriberId());
		return Response.ok().build();
	}

	@Override
	public void notifySubscribers(Object notificationData, String subscriberId) {
		Broadcaster broadcaster = BroadcasterFactory.getDefault().lookup(subscriberId, true);
		if (broadcaster != null)
			broadcaster.broadcast(JsonUtils.toJson(notificationData));
	}

	@Path("/data")
	@GET
	@Produces("application/json")
	public Data getMessage() {
		return new Data();
	}

	@Override
	@POST
	@Path("/toggle")
	public Response toggle(String data) {
		notifySubscribers(data, "subscribe");
		return Response.ok().build();
	}
}