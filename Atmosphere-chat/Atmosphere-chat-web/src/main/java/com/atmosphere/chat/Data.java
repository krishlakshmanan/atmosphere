package com.atmosphere.chat;

import java.io.Serializable;
import java.util.Date;
public final class Data implements Serializable {
	private String id;
	private String message;
	private String author;
	private long time;
	
	public Data() {
		this("", "");
	}

	public Data(String author, String message) {
		this.author = author;
		this.message = message;
		this.time = new Date().getTime();
	}
	

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
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

}