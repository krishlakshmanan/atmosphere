package com.atmosphere.chat;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.core.Response;

public interface IChat {
	@POST
	@Path("/chat")
	public Response chat(Data data);

	@POST
	@Path("/toggle")
	public Response toggle(String data);

	public void notifySubscribers(Object notificationData, String subscriberId);
}
