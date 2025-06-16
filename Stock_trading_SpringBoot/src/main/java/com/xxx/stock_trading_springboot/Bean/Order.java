package com.xxx.stock_trading_springboot.Bean;

public class Order {
    private String orderId;
    private int userId;
    private String tsCode;
    private String type;
    private Double dealPrice;
    private Double dealNumber;
    private Double dealValue;
    private String dealDate;
    private String status;

    public Order() {

    }

    public Order(int userId, String orderId, String tsCode, String type, Double dealPrice, Double dealNumber, Double dealValue, String dealDate, String status) {
        this.userId = userId;
        this.orderId = orderId;
        this.tsCode = tsCode;
        this.type = type;
        this.dealPrice = dealPrice;
        this.dealNumber = dealNumber;
        this.dealValue = dealValue;
        this.dealDate = dealDate;
        this.status = status;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public String getTsCode() {
        return tsCode;
    }

    public void setTsCode(String tsCode) {
        this.tsCode = tsCode;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Double getDealPrice() {
        return dealPrice;
    }

    public void setDealPrice(Double dealPrice) {
        this.dealPrice = dealPrice;
    }

    public Double getDealNumber() {
        return dealNumber;
    }

    public void setDealNumber(Double dealNumber) {
        this.dealNumber = dealNumber;
    }

    public Double getDealValue() {
        return dealValue;
    }

    public void setDealValue(Double dealValue) {
        this.dealValue = dealValue;
    }

    public String getDealDate() {
        return dealDate;
    }

    public void setDealDate(String dealDate) {
        this.dealDate = dealDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderId='" + orderId + '\'' +
                ", userId=" + userId +
                ", tsCode='" + tsCode + '\'' +
                ", type='" + type + '\'' +
                ", dealPrice=" + dealPrice +
                ", dealNumber=" + dealNumber +
                ", dealValue=" + dealValue +
                ", dealDate='" + dealDate + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}
