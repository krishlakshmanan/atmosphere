package com.atmosphere;

import java.io.IOException;

import org.atmosphere.cpr.AtmosphereResource;
import org.atmosphere.cpr.AtmosphereResourceEvent;

public interface AtmosphereHandler {
	void onRequest(AtmosphereResource resource) throws IOException;

	void onStateChange(AtmosphereResourceEvent event) throws IOException;

	void destroy();
}
