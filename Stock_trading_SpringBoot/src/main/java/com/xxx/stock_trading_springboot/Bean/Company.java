package com.xxx.stock_trading_springboot.Bean;

public class Company {
    private int companyId;
    private String tsCode;
    private String exchange;
    private String chairman;
    private String regCapital;
    private String website;
    private String mainBusiness;
    private String introduction;
    public Company() {
    }

    public Company(int companyId, String tsCode, String exchange, String chairman, String regCapital, String website, String mainBusiness, String introduction) {
        this.companyId = companyId;
        this.tsCode = tsCode;
        this.exchange = exchange;
        this.chairman = chairman;
        this.regCapital = regCapital;
        this.website = website;
        this.mainBusiness = mainBusiness;
        this.introduction = introduction;
    }

    public int getCompanyId() {
        return companyId;
    }

    public void setCompanyId(int companyId) {
        this.companyId = companyId;
    }

    public String getTsCode() {
        return tsCode;
    }

    public void setTsCode(String tsCode) {
        this.tsCode = tsCode;
    }

    public String getExchange() {
        return exchange;
    }

    public void setExchange(String exchange) {
        this.exchange = exchange;
    }

    public String getChairman() {
        return chairman;
    }

    public void setChairman(String chairman) {
        this.chairman = chairman;
    }

    public String getRegCapital() {
        return regCapital;
    }

    public void setRegCapital(String regCapital) {
        this.regCapital = regCapital;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getMainBusiness() {
        return mainBusiness;
    }

    public void setMainBusiness(String mainBusiness) {
        this.mainBusiness = mainBusiness;
    }

    public String getIntroduction() {
        return introduction;
    }

    public void setIntroduction(String introduction) {
        this.introduction = introduction;
    }

    @Override
    public String toString() {
        return "company{" +
                "companyId=" + companyId +
                ", tsCode='" + tsCode + '\'' +
                ", exchange='" + exchange + '\'' +
                ", chairman='" + chairman + '\'' +
                ", regCapital='" + regCapital + '\'' +
                ", website='" + website + '\'' +
                ", mainBusiness='" + mainBusiness + '\'' +
                ", introduction='" + introduction + '\'' +
                '}';
    }
}
