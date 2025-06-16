package com.xxx.stock_trading_springboot.Bean;

public class Account {
    private int accountId;
    private Double asset;
    private Double marketValue;
    private Double moneyRest;

    public Account() {
    }

    public Account(Double asset, Double marketValue, Double moneyRest, int accountId) {
        this.asset = asset;
        this.marketValue = marketValue;
        this.moneyRest = moneyRest;
        this.accountId = accountId;
    }

    public Double getAsset() {
        return asset;
    }

    public void setAsset(Double asset) {
        this.asset = asset;
    }

    public Double getMarketValue() {
        return marketValue;
    }

    public void setMarketValue(Double marketValue) {
        this.marketValue = marketValue;
    }

    public Double getMoneyRest() {
        return moneyRest;
    }

    public void setMoneyRest(Double moneyRest) {
        this.moneyRest = moneyRest;
    }

    public int getAccountId() {
        return accountId;
    }

    public void setAccountId(int accountId) {
        this.accountId = accountId;
    }

    @Override
    public String toString() {
        return "Account{" +
                "accountId=" + accountId +
                ", asset=" + asset +
                ", marketValue=" + marketValue +
                ", moneyRest=" + moneyRest +
                '}';
    }
}
