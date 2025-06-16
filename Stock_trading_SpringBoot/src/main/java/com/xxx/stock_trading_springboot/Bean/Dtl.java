package com.xxx.stock_trading_springboot.Bean;

public class Dtl {
    private String tradeDate;
    private String tsCode;
    private String name;
    private Double close;
    private Double pctChange;
    private Double turnoverRate;
    private Double amount;
    private Double lSell;
    private Double lBuy;
    private Double lAmount;
    private Double netAmount;
    private Double netRate;
    private Double amountRate;
    private Double floatValues;
    private String reason;

    public Dtl() {
    }

    public Dtl(String tradeDate, String tsCode, String name, Double close, Double pctChange, Double turnoverRate, Double amount, Double lSell, Double lBuy, Double lAmount, Double netAmount, Double netRate, Double amountRate, Double floatValues, String reason) {
        this.tradeDate = tradeDate;
        this.tsCode = tsCode;
        this.name = name;
        this.close = close;
        this.pctChange = pctChange;
        this.turnoverRate = turnoverRate;
        this.amount = amount;
        this.lSell = lSell;
        this.lBuy = lBuy;
        this.lAmount = lAmount;
        this.netAmount = netAmount;
        this.netRate = netRate;
        this.amountRate = amountRate;
        this.floatValues = floatValues;
        this.reason = reason;
    }

    public String getTradeDate() {
        return tradeDate;
    }

    public void setTradeDate(String tradeDate) {
        this.tradeDate = tradeDate;
    }

    public String getTsCode() {
        return tsCode;
    }

    public void setTsCode(String tsCode) {
        this.tsCode = tsCode;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getClose() {
        return close;
    }

    public void setClose(Double close) {
        this.close = close;
    }

    public Double getPctChange() {
        return pctChange;
    }

    public void setPctChange(Double pctChange) {
        this.pctChange = pctChange;
    }

    public Double getTurnoverRate() {
        return turnoverRate;
    }

    public void setTurnoverRate(Double turnoverRate) {
        this.turnoverRate = turnoverRate;
    }

    public Double getlSell() {
        return lSell;
    }

    public void setlSell(Double lSell) {
        this.lSell = lSell;
    }

    public Double getlBuy() {
        return lBuy;
    }

    public void setlBuy(Double lBuy) {
        this.lBuy = lBuy;
    }

    public Double getFloatValues() {
        return floatValues;
    }

    public void setFloatValues(Double floatValues) {
        this.floatValues = floatValues;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public Double getNetRate() {
        return netRate;
    }

    public void setNetRate(Double netRate) {
        this.netRate = netRate;
    }

    public Double getAmountRate() {
        return amountRate;
    }

    public void setAmountRate(Double amountRate) {
        this.amountRate = amountRate;
    }

    public Double getlAmount() {
        return lAmount;
    }

    public void setlAmount(Double lAmount) {
        this.lAmount = lAmount;
    }

    public Double getNetAmount() {
        return netAmount;
    }

    public void setNetAmount(Double netAmount) {
        this.netAmount = netAmount;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    @Override
    public String toString() {
        return "dtl{" +
                "tradeDate='" + tradeDate + '\'' +
                ", tsCode='" + tsCode + '\'' +
                ", name='" + name + '\'' +
                ", close=" + close +
                ", pctChange=" + pctChange +
                ", turnoverRate=" + turnoverRate +
                ", amount=" + amount +
                ", lSell=" + lSell +
                ", lBuy=" + lBuy +
                ", lAmount=" + lAmount +
                ", netAmount=" + netAmount +
                ", netRate=" + netRate +
                ", amountRate=" + amountRate +
                ", floatValues=" + floatValues +
                ", reason='" + reason + '\'' +
                '}';
    }
}
