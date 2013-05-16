package com.atmosphere.chat;

import java.io.IOException;
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
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;

import com.atmosphere.utils.BroadcastContent;
import com.atmosphere.utils.JsonUtils;

/**
 * @author krish
 *
 */
@Path("/subscribe")
@Stateless
@LocalBean
public class ChatImpl implements IChat {

	@Override
	@POST
	@Path("/chat")
	public Response chat(BroadcastContent broadcastContent) throws JsonParseException, JsonMappingException, IOException {
		System.out.println("Inside Chat ");
		Data data = null;
		String subscriberId =  broadcastContent.getSubscriberId();
			data = new ObjectMapper().convertValue(broadcastContent.getContent(), Data.class);
			data.setTime(new Date().getTime());
			if (broadcastContent.getContentType().equals("agent:request")){
				subscriberId = "agents";
			}
			notifySubscribers(broadcastContent,subscriberId);
			System.out.println("Data broadcasted");
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
	
	@Path("/broadcastdata")
	@GET
	@Produces("application/json")
	public BroadcastContent getBroadcastMessage() {
		BroadcastContent broadcastContent = new BroadcastContent();
		broadcastContent.setContent(new Data());
		return broadcastContent;
	}
}