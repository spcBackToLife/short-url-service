package com.pk.shortUrl.controller;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.regex.Pattern;

import org.junit.After;
import org.junit.Before;
import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.embedded.LocalServerPort;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import com.pk.shorturl.shortUrlApplication;

import junit.framework.TestCase;
import net.sf.json.JSONObject;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = shortUrlApplication.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@DirtiesContext
public class ShortUrlControllerTest extends TestCase {
  private static final Logger logger = LoggerFactory.getLogger(ShortUrlControllerTest.class);

  @Override
  @Before
  public void setUp() throws Exception {
    // token = "";
    errLongUrl = "www.baidu.com";
    correctLongUrl = "http://www.baidu.com";
    shortUrlLength = 6;
    shortUrlLengthSmallest = 1;
    shortUrl = "custom";
    this.repeatUrl = "custom";

    this.body = new LinkedMultiValueMap<String, Object>();
    this.headers = new LinkedMultiValueMap<String, String>();
  }

  @Override
  @After
  public void tearDown() throws Exception {}

  // private String token;
  private String errLongUrl;
  private String correctLongUrl;
  private String shortUrl;
  private String repeatUrl;
  private int shortUrlLength;
  private int shortUrlLengthSmallest;
  // params
  MultiValueMap<String, Object> body;
  MultiValueMap<String, String> headers;

  @LocalServerPort
  private int port;

  @Autowired
  private TestRestTemplate rest;

  @Test
  @Ignore
  public void shouldReturnFailByWrongLongUrl() {
    logger.info("shouldReturnCorrectShortUrlByDefault...");
    body.set("long_url", this.errLongUrl);
    body.set("short_url_length", this.shortUrlLength);
    ResponseEntity<String> response =
        this.rest.exchange("http://localhost:" + port + "/url_convertor/default_convert",
            HttpMethod.POST, new HttpEntity<>(body, headers), String.class);
    logger.info("response body:{}", response.getBody());
    assertThat(response.getBody())
        .isEqualTo("{\"reason\":\"所需转换的网络地址不正确,请核实.\",\"success\":false}");

  }

  // Fixed-length url used up, need to increase.
  @Test
  @Ignore
  public void shouldReturnFailByFullOfUrlWithLength() {
    // There are 61 records in db , it will test that the number of the shortLength is full.
    logger.info("shouldReturnCorrectShortUrlByDefault...");
    body.set("long_url", this.correctLongUrl);
    body.set("short_url_length", this.shortUrlLengthSmallest);
    ResponseEntity<String> response =
        this.rest.exchange("http://localhost:" + port + "/url_convertor/default_convert",
            HttpMethod.POST, new HttpEntity<>(body, headers), String.class);
    logger.info("response body:{}", response.getBody());
    assertThat(response.getBody())
        .isEqualTo("{\"reason\":\"指定位数的短地址已用完,需增加短地址长度.\",\"success\":false}");
  }

  @Test
  @Ignore
  public void shouldReturnSuccessByCorrectLongUrl() {
    logger.info("shouldReturnCorrectShortUrlByDefault...");
    body.set("long_url", this.correctLongUrl);
    body.set("short_url_length", this.shortUrlLength);
    ResponseEntity<String> response =
        this.rest.exchange("http://localhost:" + port + "/url_convertor/default_convert",
            HttpMethod.POST, new HttpEntity<>(body, headers), String.class);
    String res = response.getBody();
    JSONObject resObj = JSONObject.fromObject(res);
    logger.info("response body:{}", res);
    assertThat(resObj.containsKey("shortUrl")).isEqualTo(true);
  }

  @Test
  @Ignore
  public void shouldReturnSuccessByCustomConvert() {
    logger.info("shouldReturnCorrectShortUrlByDefault...");
    body.set("long_url", this.correctLongUrl);
    body.set("short_url", this.shortUrl);
    ResponseEntity<String> response =
        this.rest.exchange("http://localhost:" + port + "/url_convertor/custom_convert",
            HttpMethod.POST, new HttpEntity<>(body, headers), String.class);
    String res = response.getBody();
    JSONObject resObj = JSONObject.fromObject(res);
    logger.info("response body:{}", res);
    assertThat(resObj.containsKey("shortUrl")).isEqualTo(true);
  }

  @Test
  @Ignore
  public void shouldReturnFailOfRepeatUrlByCustom() {
    logger.info("shouldReturnCorrectShortUrlByDefault...");
    body.set("long_url", this.correctLongUrl);
    body.set("short_url", this.repeatUrl);
    ResponseEntity<String> response =
        this.rest.exchange("http://localhost:" + port + "/url_convertor/custom_convert",
            HttpMethod.POST, new HttpEntity<>(body, headers), String.class);
    String res = response.getBody();
    logger.info("response body:{}", res);
    assertThat(res).isEqualTo("{\"reason\":\"指定的短地址已被使用,请重新指定.\",\"success\":false}");
  }

  @Test
  @Ignore
  public void shouldReturnSuccessByRepeatUrlWithCustom() {
    logger.info("shouldReturnSuccessByRepeatUrlWithCustom...");
    // 此单元测试,需根据当前表里最后一个id+2,创建一个自定义的短地址.
    // 此时id+1则是自定义地址,占用了id+2的地址,
    // 创建Id+2时, 会去根据id+1的值生成短地址,则正确.
    // 由上,根据数据库得,此时id=1,则id+2对应的短地址,计算为:aaaaaM.
    // 创建id+2时候,地址为: aaaaaL. 则正确.
    body.set("long_url", this.correctLongUrl);
    body.set("short_url", "aaaaaM");
    ResponseEntity<String> response =
        this.rest.exchange("http://localhost:" + port + "/url_convertor/custom_convert",
            HttpMethod.POST, new HttpEntity<>(body, headers), String.class);
    body.set("long_url", this.correctLongUrl);
    body.set("short_url_length", this.shortUrlLength);
    response = this.rest.exchange("http://localhost:" + port + "/url_convertor/default_convert",
        HttpMethod.POST, new HttpEntity<>(body, headers), String.class);
    String res = response.getBody();
    JSONObject resObj = JSONObject.fromObject(res);
    logger.info("response body:{}", res);
    assertThat(resObj.containsValue("aaaaaL")).isEqualTo(true);
  }

  @Test
  public void shouldReturnCorrectJudgmentOfUrl() {
    String url = "https://wwws.baidu.com";
    String url2 = "http://wwws.baidu.com";
    String url3 = "http://www.baidu.com";
    String url4 = "https://www.baidu.com";
    String url5 = "wronghttp://www.baidu.com";
    String url6 = "http://www.baidu.com/cust_";
    String url7 = "http://www.baidu.com/cust_@#$@%^";
    String url8 = "http://www.baidu.com/cust_;?><";
    String url9 = "http://www.baidu.com/cust_---";
    String url10 = "http://www.baidu.com/cust_";
    String pat =
        "^(http|https|ftp)\\://([a-zA-Z0-9\\.\\-]+(\\:[a-zA-Z0-9\\.&%\\$\\-]+)*@)?((25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9])\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[1-9]|0)\\.(25[0-5]|2[0-4][0-9]|[0-1]{1}[0-9]{2}|[1-9]{1}[0-9]{1}|[0-9])|([a-zA-Z0-9\\-]+\\.)*[a-zA-Z0-9\\-]+\\.[a-zA-Z]{2,4})(\\:[0-9]+)?(/[^/][a-zA-Z0-9\\.\\,\\?\\'\\\\/\\+&%\\$#\\=~_\\-@]*)*$";
    Pattern pattern = Pattern.compile(pat);
    System.out.println(pattern.matcher(url).matches());
    System.out.println(pattern.matcher(url2).matches());
    System.out.println(pattern.matcher(url3).matches());
    System.out.println(pattern.matcher(url4).matches());
    System.out.println(pattern.matcher(url5).matches());
    System.out.println(pattern.matcher(url6).matches());
    System.out.println(pattern.matcher(url7).matches());
    System.out.println(pattern.matcher(url8).matches());
    System.out.println(pattern.matcher(url9).matches());
    System.out.println(pattern.matcher(url10).matches());
  }
}
