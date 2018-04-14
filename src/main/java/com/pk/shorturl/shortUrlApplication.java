package com.pk.shorturl;

import org.mybatis.spring.annotation.MapperScan;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;

@SpringBootApplication(scanBasePackages = {"com.pk.shorturl"})
@MapperScan("com.pk.shorturl.dao")
public class shortUrlApplication extends SpringBootServletInitializer {

  private static final Logger logger = LoggerFactory.getLogger(shortUrlApplication.class);

  @Override
  protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
    return application.sources(shortUrlApplication.class);
  }

  public static void main(String[] args) {
    logger.info("Starting shortUrlApplication...");
    SpringApplication.run(shortUrlApplication.class, args);
  }

}
