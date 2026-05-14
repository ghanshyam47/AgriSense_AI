package com.agrisense.server.controller;

import com.agrisense.server.service.MarketService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/market")
public class MarketController {

    private final MarketService marketService;

    public MarketController(MarketService marketService) {
        this.marketService = marketService;
    }

    @GetMapping("/prices/{crop}")
    public ResponseEntity<Map<String, Object>> prices(@PathVariable String crop) {
        return ResponseEntity.ok(marketService.getPrices(crop));
    }

    @GetMapping("/msp/{crop}")
    public ResponseEntity<Map<String, Object>> msp(@PathVariable String crop) {
        return ResponseEntity.ok(marketService.getMsp(crop));
    }

    @GetMapping("/trend/{crop}")
    public ResponseEntity<Map<String, Object>> trend(@PathVariable String crop) {
        return ResponseEntity.ok(marketService.getTrend(crop));
    }

    @GetMapping("/advice/{crop}")
    public ResponseEntity<Map<String, Object>> advice(@PathVariable String crop) {
        return ResponseEntity.ok(marketService.getAdvice(crop));
    }
}
