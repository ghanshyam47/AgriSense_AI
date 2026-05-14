package com.agrisense.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication(scanBasePackages = "com.agrisense.server")
@EnableScheduling
public class AgrisenseServerApplication {
    public static void main(String[] args) {
        SpringApplication.run(AgrisenseServerApplication.class, args);
    }
}
