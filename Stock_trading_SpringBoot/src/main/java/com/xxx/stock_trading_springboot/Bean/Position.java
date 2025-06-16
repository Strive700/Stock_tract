package com.xxx.stock_trading_springboot.Bean;

public class Position {
    private  int positionId;
    private  int  accountId;
    private  String  tsCode;
    private  Double dealPrice;
    private  Double  number;
    private  Double  cost;
    private  Double  marketPrice;
    private  Double  marketValue;
    private  Double  profitLoss;
    private  String  dealTime;
    public Position() {
    }

    public Position(int positionId, int accountId, String tsCode, Double dealPrice, Double number, Double marketPrice, Double cost, Double marketValue, Double profitLoss, String dealTime) {
        this.positionId = positionId;
        this.accountId = accountId;
        this.tsCode = tsCode;
        this.dealPrice = dealPrice;
        this.number = number;
        this.marketPrice = marketPrice;
        this.cost = cost;
        this.marketValue = marketValue;
        this.profitLoss = profitLoss;
        this.dealTime = dealTime;
    }

    public int getPositionId() {
        return positionId;
    }

    public void setPositionId(int positionId) {
        this.positionId = positionId;
    }

    public int getAccountId() {
        return accountId;
    }

    public void setAccountId(int accountId) {
        this.accountId = accountId;
    }

    public String getTsCode() {
        return tsCode;
    }

    public void setTsCode(String tsCode) {
        this.tsCode = tsCode;
    }

    public Double getDealPrice() {
        return dealPrice;
    }

    public void setDealPrice(Double dealPrice) {
        this.dealPrice = dealPrice;
    }

    public Double getNumber() {
        return number;
    }

    public void setNumber(Double number) {
        this.number = number;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public Double getMarketPrice() {
        return marketPrice;
    }

    public void setMarketPrice(Double marketPrice) {
        this.marketPrice = marketPrice;
    }

    public Double getMarketValue() {
        return marketValue;
    }

    public void setMarketValue(Double marketValue) {
        this.marketValue = marketValue;
    }

    public Double getProfitLoss() {
        return profitLoss;
    }

    public void setProfitLoss(Double profitLoss) {
        this.profitLoss = profitLoss;
    }

    public String getDealTime() {
        return dealTime;
    }

    public void setDealTime(String dealTime) {
        this.dealTime = dealTime;
    }

    @Override
    public String toString() {
        return "Position{" +
                "positionId=" + positionId +
                ", accountId=" + accountId +
                ", tsCode='" + tsCode + '\'' +
                ", dealPrice=" + dealPrice +
                ", number=" + number +
                ", cost=" + cost +
                ", marketPrice=" + marketPrice +
                ", marketValue=" + marketValue +
                ", profitLoss=" + profitLoss +
                ", dealTime='" + dealTime + '\'' +
                '}';
    }
}
