#include "FairShareManager.h"
#include <iostream>
#include <iomanip>
#include <queue>
#include <cmath>
#include <algorithm>

void FairShareManager::addUser(int id, const std::string& name) {
    ledger.addUser(User(id, name));
}

void FairShareManager::addExpense(const Expense& e) {
    ledger.recordExpense(e);
    auto shares = e.computeShares();
    int payerId = e.getPayerId();

    for (const auto& [userId, amount] : shares) {
        if (userId != payerId && amount > 0) {
            ledger.updateDebt(userId, payerId, amount);
        }
    }
}

void FairShareManager::showBalances() const {
    auto debts = ledger.getAllDebts();
    if (debts.empty()) {
        std::cout << "No balances." << std::endl;
        return;
    }

    const auto& users = ledger.getUsers();
    std::cout << std::fixed << std::setprecision(2);
    for (const auto& debt : debts) {
        int debtorId = std::get<0>(debt);
        int creditorId = std::get<1>(debt);
        double amount = std::get<2>(debt);

        std::string debtorName = users.count(debtorId) ? users.at(debtorId).getName() : "User " + std::to_string(debtorId);
        std::string creditorName = users.count(creditorId) ? users.at(creditorId).getName() : "User " + std::to_string(creditorId);

        std::cout << debtorName << " owes " << creditorName << ": " << amount << std::endl;
    }
}

void FairShareManager::simplifyDebts() {
    std::unordered_map<int, double> netBalances;
    for (const auto& debt : ledger.getAllDebts()) {
        int debtorId = std::get<0>(debt);
        int creditorId = std::get<1>(debt);
        double amount = std::get<2>(debt);
        netBalances[debtorId] -= amount;
        netBalances[creditorId] += amount;
    }

    auto comp = [](const std::pair<double, int>& a, const std::pair<double, int>& b) {
        return a.first < b.first;
    };
    std::priority_queue<std::pair<double, int>, std::vector<std::pair<double, int>>, decltype(comp)> debtors(comp);
    std::priority_queue<std::pair<double, int>, std::vector<std::pair<double, int>>, decltype(comp)> creditors(comp);

    for (const auto& [userId, balance] : netBalances) {
        if (balance < -0.01) {
            debtors.push({-balance, userId});
        } else if (balance > 0.01) {
            creditors.push({balance, userId});
        }
    }

    ledger.clearDebts();

    while (!debtors.empty() && !creditors.empty()) {
        auto debtor = debtors.top();
        debtors.pop();
        auto creditor = creditors.top();
        creditors.pop();

        double settlementAmount = std::min(debtor.first, creditor.first);
        ledger.updateDebt(debtor.second, creditor.second, settlementAmount);

        debtor.first -= settlementAmount;
        creditor.first -= settlementAmount;

        if (debtor.first > 0.01) {
            debtors.push(debtor);
        }
        if (creditor.first > 0.01) {
            creditors.push(creditor);
        }
    }
}

void FairShareManager::showHistory() const {
    const auto& expenses = ledger.getExpenses();
    if (expenses.empty()) {
        std::cout << "No history." << std::endl;
        return;
    }
    
    const auto& users = ledger.getUsers();
    for (size_t i = 0; i < expenses.size(); ++i) {
        int payerId = expenses[i].getPayerId();
        std::string payerName = users.count(payerId) ? users.at(payerId).getName() : std::to_string(payerId);
        std::cout << "Expense " << i + 1 << ": " << payerName << " paid " << expenses[i].getTotalAmount() << std::endl;
    }
}

const Ledger& FairShareManager::getLedger() const {
    return ledger;
}

void FairShareManager::loadLedger(const Ledger& l) {
    ledger = l;
}
