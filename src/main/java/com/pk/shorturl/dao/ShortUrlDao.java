package com.pk.shorturl.dao;


import org.apache.ibatis.annotations.Param;

import com.pk.shorturl.model.Link;

public interface ShortUrlDao {
  long addDefaultLinks(Link link);

  long addCustomLinks(Link link);

  Integer updateLinks(@Param("shortUrl") String shortUrl, @Param("id") int id);

  String getLongUrl(@Param("shortUrl") String shortUrl);

  Integer checkShortUrl(@Param("shortUrl") String shortUrl);

  Integer updateLinkCount(@Param("shortUrl") String shortUrl);
}
