package com.pk.shorturl.controller;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pk.shorturl.common.Constant;
import com.pk.shorturl.service.ShortUrlService;
import com.pk.shorturl.util.ResultHandler;
import com.pk.shorturl.util.UrlConvertor;

@RestController
@RequestMapping("/url_convertor")
public class ShortUrlController {
  private static final Logger logger = LoggerFactory.getLogger(ShortUrlController.class);

  @Autowired
  private ShortUrlService shortUrlService;


  // convert url to short url by system
  @RequestMapping(path = "/default_convert", method = RequestMethod.POST)
  public Map<String, Object> shortUrlByDefault(@RequestParam("long_url") String longUrl,
      @RequestParam("short_url_length") int shortUrlLength) {
    logger.info("Processing shortUrlByDefault. longUrl={},shortUrlLength={}", longUrl,
        shortUrlLength);
    // check url whether is correct
    if (!UrlConvertor.checkUrl(longUrl)) {
      return ResultHandler.convertFailHandler(Constant.INVALID_URL);
    }
    return shortUrlService.convertByDefault(longUrl, shortUrlLength);
  }

  // convert url to short url by custom
  @RequestMapping(path = "/custom_convert", method = RequestMethod.POST)
  public Map<String, Object> customConvert(@RequestParam("long_url") String longUrl,
      @RequestParam("short_url") String shortUrl) {
    logger.info("Processing assignedConvert. longUrl={},shortUrlLength={]", longUrl);
    // check url whether is correct
    if (!UrlConvertor.checkUrl(longUrl)) {
      return ResultHandler.convertFailHandler(Constant.INVALID_URL);
    }
    return shortUrlService.convertByCustom(longUrl, shortUrl);
  }

  // redirect to long url by short url
  @RequestMapping(path = "/{shorturl}", method = RequestMethod.GET)
  public void redirect(@PathVariable String shorturl, HttpServletRequest request,
      HttpServletResponse response) throws IOException {
    logger.info("Processing redirect. shorturl ={}", shorturl);
    String longUrl = shortUrlService.getLongUrl(shorturl);
    if (longUrl == null) {
      response.sendError(404);
      return;
    }
    response.sendRedirect(longUrl);
  }

}
