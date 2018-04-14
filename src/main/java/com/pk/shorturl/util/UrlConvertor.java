package com.pk.shorturl.util;

import java.util.LinkedList;
import java.util.Map;
import java.util.regex.Pattern;

import com.pk.shorturl.common.Constant;

// used to convert url
public class UrlConvertor {

  public static Map<String, Object> convert(int id, int length) {
    LinkedList<Integer> value = base62(id);
    StringBuffer shortUrl = new StringBuffer("");
    value.forEach(each -> shortUrl.append(Constant.CHARS[each]));
    // 1.if the lenth of the shortUrl longer than pointed, should return fail.
    // need to add length of shortUrl
    int lengthDiffer = shortUrl.length() - length;
    if (lengthDiffer > 0) {
      return convertFail();
    }
    // 2.if the length of shortUrl shorter than pointed, need to append.
    if (lengthDiffer < 0) {
      for (int i = 0; i < -lengthDiffer; i++)
        shortUrl.append(Constant.CHARS[0]);
    }
    // 3.Reverse Order
    shortUrl.reverse();
    return convertSuccess(shortUrl.toString());
  }

  public static boolean checkUrl(String longUrl) {
    Pattern pattern = Pattern.compile(Constant.PATTEN_RULE);
    return pattern.matcher(longUrl).matches();
  }

  private static LinkedList<Integer> base62(int id) {
    LinkedList<Integer> value = new LinkedList<Integer>();
    while (id > 0) {
      int remainder = id % 62;
      value.add(remainder);
      id = id / 62;
    }
    return value;
  }

  private static Map<String, Object> convertSuccess(String shortUrl) {
    return ResultHandler.convertSuccessHandler(shortUrl.toString());
  }

  private static Map<String, Object> convertFail() {
    return ResultHandler.convertFailHandler(Constant.URL_CONVERTION_FAIL_REASON);
  }
}
