package com.pk.shorturl.service;

import java.util.HashMap;
import java.util.Map;

import org.javatuples.Pair;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.pk.shorturl.common.Constant;
import com.pk.shorturl.dao.ShortUrlDao;
import com.pk.shorturl.model.Link;
import com.pk.shorturl.util.ResultHandler;
import com.pk.shorturl.util.UrlConvertor;

@Service
public class ShortUrlService {
  private static final Logger logger = LoggerFactory.getLogger(ShortUrlService.class);
  @Autowired
  private ShortUrlDao shortUrlDao;

  public String getLongUrl(String shortUrl) {
    // update visit times if can find longUrl
    String longUrl = shortUrlDao.getLongUrl(shortUrl);
    if (longUrl != null) shortUrlDao.updateLinkCount(shortUrl);
    return longUrl;
  }

  public Map<String, Object> convertByCustom(String longUrl, String shortUrl) {
    // check the shortUrl whether it has been used
    if (shortUrlDao.checkShortUrl(shortUrl) != null)
      return ResultHandler.convertFailHandler(Constant.URL_REPEAT_REASON);
    shortUrlDao.addCustomLinks(new Link(longUrl, Constant.TYPE_CUSTOM, shortUrl));
    return this.convertSuccess(shortUrl);
  }

  public Map<String, Object> convertByDefault(String longUrl, int shortUrlLength) {
    Link link = new Link(longUrl, Constant.TYPE_SYSTEM);
    shortUrlDao.addDefaultLinks(link);
    int id = link.getId();
    String shortUrl = "";
    logger.debug("id:{}", link.getId());
    Pair<Boolean, String> res = getConvertUrl(id, shortUrlLength);
    if (res.getValue0()) {
      // converted successfully, save the shortUrl.
      shortUrl = res.getValue1();
      shortUrlDao.updateLinks(shortUrl, id);
      return this.convertSuccess(shortUrl);
    }
    return ResultHandler.convertFailHandler(Constant.URL_CONVERTION_FAIL_REASON);
  }

  // the first param of Pair means whether convert successfully
  // the second param of Pair is shortUrl
  private Pair<Boolean, String> getConvertUrl(int id, int shortUrlLength) {
    Map<String, Object> result = new HashMap<String, Object>();
    result = UrlConvertor.convert(id, shortUrlLength);
    if ((boolean) result.get(Constant.SUCCESS_KEY)) {
      String shortUrl = (String) result.get(Constant.SHORT_URL_KEY);
      logger.debug("计算的URL:{}", shortUrl);
      // if shortUrl is definend by custom ,we should use it's id to create new shortUrl which can
      // not be used.
      Integer recordId = shortUrlDao.checkShortUrl(shortUrl);
      if (recordId != null) {
        // it has been used,should convert again with recordId.
        logger.debug("用户已经自定义过,需重新计算.");
        return getConvertUrl(recordId, shortUrlLength);
      }
      logger.debug("计算的URL对应id:{}", id);
      return Pair.with(true, shortUrl);
    }
    return Pair.with(false, "");
  }

  private Map<String, Object> convertSuccess(String shortUrl) {
    return ResultHandler.convertSuccessHandler(shortUrl);
  }


}
