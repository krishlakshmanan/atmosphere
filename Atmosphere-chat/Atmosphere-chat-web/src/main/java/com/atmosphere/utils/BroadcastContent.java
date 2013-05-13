package com.atmosphere.utils;


public class BroadcastContent<T> {
	private String subscriberId;
	private String contentType ;
	private T content;
	
	public BroadcastContent() {
		super();   
	}
	public String getSubscriberId() {
		return subscriberId;
	}
	public void setSubscriberId(String subscriberId) {
		this.subscriberId = subscriberId;
	}
	public String getContentType() {
		return contentType;
	}
	public void setContentType(String contentType) {
		this.contentType = contentType;
	}
	public T getContent() {
		return content;
	}
	public void setContent(T content) {
		this.content = content;
	}
	
}
