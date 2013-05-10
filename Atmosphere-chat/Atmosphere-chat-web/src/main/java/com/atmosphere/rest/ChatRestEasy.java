package com.atmosphere.rest;

import javax.servlet.http.HttpServletRequest;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;

import org.atmosphere.cpr.ApplicationConfig;
import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.Broadcaster;
import org.atmosphere.cpr.BroadcasterFactory;
import org.atmosphere.websocket.WebSocketEventListenerAdapter;

import com.atmosphere.chat.Data;

@Path("/")
public class ChatRestEasy {
	@Context
	HttpServletRequest req;

	@GET
	@Path("/suspend")
	public Response suspended() {
		AtmosphereResource atmosphereResource = (AtmosphereResource) req.getAttribute("org.atmosphere.cpr.AtmosphereResource");
		atmosphereResource.addEventListener(new WebSocketEventListenerAdapter());
		Broadcaster broadcaster = lookupBroadcaster(req.getPathInfo());
		if (broadcaster != null) {
			req.setAttribute(ApplicationConfig.RESUME_ON_BROADCAST, Boolean.TRUE);
			atmosphereResource.setBroadcaster(broadcaster).suspend();
		}
		return null;
	}

	@POST
	@Path("/broadcast")
	@Consumes("application/json")
	public String broadcast(Data message) {
		lookupBroadcaster("/suspend").broadcast(message);
		return "OK";
	}

	@Path("/data")
	@GET
	@Produces("application/json")
	public Data getMessage() {
		return new Data();
	}

	Broadcaster lookupBroadcaster(String pathInfo) {
		String[] decodedPath = pathInfo.split("/");
		Broadcaster b = BroadcasterFactory.getDefault().lookup(decodedPath[decodedPath.length - 1], true);
		return b;
	}

}