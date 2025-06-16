package com.xxx.stock_trading_springboot.Bean;

public class Stock {
    private String tsCode;
    private String symbol;
    private String name;
    private String marketType;
    private String area;
    private String industry;
    private String exchange;
    public Stock() {
    }

    public Stock(String symbol, String marketType, String name, String area, String industry, String exchange, String tsCode) {
        this.symbol = symbol;
        this.marketType = marketType;
        this.name = name;
        this.area = area;
        this.industry = industry;
        this.exchange = exchange;
        this.tsCode = tsCode;
    }

    public String getTsCode() {
        return tsCode;
    }

    public void setTsCode(String tsCode) {
        this.tsCode = tsCode;
    }

    public String getSymbol() {
        return symbol;
    }

    public void setSymbol(String symbol) {
        this.symbol = symbol;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getArea() {
        return area;
    }

    public void setArea(String area) {
        this.area = area;
    }

    public String getMarketType() {
        return marketType;
    }

    public void setMarketType(String marketType) {
        this.marketType = marketType;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getExchange() {
        return exchange;
    }

    public void setExchange(String exchange) {
        this.exchange = exchange;
    }

    @Override
    public String toString() {
        return "Stock{" +
                "tsCode='" + tsCode + '\'' +
                ", symbol='" + symbol + '\'' +
                ", name='" + name + '\'' +
                ", marketType='" + marketType + '\'' +
                ", area='" + area + '\'' +
                ", industry='" + industry + '\'' +
                ", exchange='" + exchange + '\'' +
                '}';
    }
}
