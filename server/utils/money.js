class Money {
    constructor() {
        this.total_money = 0;
        this.base_income = 1000;
    }

    gainBaseIncome() {
        return this.gainMoney(this.base_income);
    }

    getBaseIncome() {
        return this.base_income;
    }

    setBaseIncome(new_income) {
        this.base_income = new_income;
    }

    gainMoney(money) {
        this.total_money += money;
        return this.total_money;
    }

    getCurrentMoney() {
        return this.total_money;
    }
}

exports.Money = Money;