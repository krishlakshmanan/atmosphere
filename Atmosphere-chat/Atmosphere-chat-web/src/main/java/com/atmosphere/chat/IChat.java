package com.atmosphere.chat;

import java.io.IOException;

import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;

import com.atmosphere.utils.BroadcastContent;

public interface IChat {
	@POST
	@Path("/chat")
	@Consumes(MediaType.APPLICATION_JSON)
	public Response chat(BroadcastContent data) throws JsonParseException, JsonMappingException, IOException;

	@POST
	@Path("/toggle")
	public Response toggle(String data);

	public void notifySubscribers(Object notificationData, String subscriberId);
}
