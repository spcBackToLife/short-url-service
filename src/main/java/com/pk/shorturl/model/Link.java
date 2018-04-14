package com.pk.shorturl.model;


public class Link {
  private String longUrl;
  private int id;
  private int type;
  private String shortUrl;

  public Link() {}

  public Link(String longUrl, int type) {
    this.longUrl = longUrl;
    this.type = type;
  }

  public Link(String longUrl, int type, String shortUrl) {
    this.longUrl = longUrl;
    this.type = type;
    this.shortUrl = shortUrl;
  }

  public String getShortUrl() {
    return shortUrl;
  }

  public void setShortUrl(String shortUrl) {
    this.shortUrl = shortUrl;
  }

  public int getType() {
    return type;
  }

  public void setType(int type) {
    this.type = type;
  }


  public String getLongUrl() {
    return longUrl;
  }

  public void setLongUrl(String longUrl) {
    this.longUrl = longUrl;
  }

  public int getId() {
    return id;
  }

  public void setId(int id) {
    this.id = id;
  }

}
