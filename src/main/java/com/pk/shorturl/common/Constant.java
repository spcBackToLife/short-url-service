package com.pk.shorturl.common;

public class Constant {
  public static String[] CHARS = new String[] {"a", "K", "L", "M", "N", "b", "c", "d", "O", "P",
      "Q", "R", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "I", "J", "S", "p", "q", "u",
      "v", "w", "x", "T", "y", "z", "A", "B", "C", "D", "E", "F", "r", "s", "t", "G", "H", "U", "V",
      "W", "X", "Y", "Z", "0", "1", "2", "6", "7", "3", "5", "8", "4", "9"};

  public static String PATTEN_RULE =
      "^(http|https|ftp)\\://([a-zA-Z0-9\\.\\-]+(\\:[a-zA-Z0-9\\.&%\\$\\-]+)*@)?((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\\-]+\\.)*[a-zA-Z0-9\\-]+\\.[a-zA-Z]{2,4})(\\:[0-9]+)?(/[^/][a-zA-Z0-9\\.\\,\\?\\'\\\\/\\+&%\\$#\\=~_\\-@]*)*$";

  public static String FAIL_REASON_KEY = "reason";
  public static String SUCCESS_KEY = "success";
  public static String SHORT_URL_KEY = "shortUrl";



  public static int TYPE_SYSTEM = 0; // default type
  public static int TYPE_CUSTOM = 1; // custom type

  public static String DB_FAIL_REASON = "数据库操作报错,请联系平台管理员.";
  public static String INVALID_URL = "所需转换的网络地址不正确,请核实.";
  public static String URL_CONVERTION_FAIL_REASON = "指定位数的短地址已用完,需增加短地址长度.";
  public static String URL_REPEAT_REASON = "指定的短地址已被使用,请重新指定.";
}
