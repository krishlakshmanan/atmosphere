package com.atmosphere.chat;

import java.util.Date;

public final class Data {

	private String message;
	private String author;
	private long time;
	private String subscriberId;

	public Data() {
		this("", "");
	}

	public Data(String author, String message) {
		this.author = author;
		this.message = message;
		this.time = new Date().getTime();
	}

	public String getMessage() {
		return message;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public long getTime() {
		return time;
	}

	public void setTime(long time) {
		this.time = time;
	}

	public String getSubscriberId() {
		return subscriberId;
	}

	public void setSubscriberId(String subscriberId) {
		this.subscriberId = subscriberId;
	}

}