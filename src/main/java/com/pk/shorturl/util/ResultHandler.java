package com.pk.shorturl.util;

import java.util.HashMap;
import java.util.Map;

import com.pk.shorturl.common.Constant;

// handle return result
public class ResultHandler {
  public static Map<String, Object> convertSuccessHandler(String shortUrl) {
    return new HashMap<String, Object>() {
      {
        put(Constant.SUCCESS_KEY, true);
        put(Constant.SHORT_URL_KEY, shortUrl);
      }
    };
  }

  public static Map<String, Object> convertFailHandler(String reason) {
    return new HashMap<String, Object>() {
      {
        put(Constant.SUCCESS_KEY, false);
        put(Constant.FAIL_REASON_KEY, reason);
      }
    };
  }


}
