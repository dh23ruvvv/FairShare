#include "Ledger.h"
#include <tuple>

void Ledger::addUser(const User& u) {
    users.insert({u.getId(), u});
}

void Ledger::recordExpense(const Expense& e) {
    expenses.push_back(e);
}

void Ledger::updateDebt(int debtorId, int creditorId, double amount) {
    if (debtorId == creditorId) return;
    debts[{debtorId, creditorId}] += amount;
}

std::vector<std::tuple<int, int, double>> Ledger::getAllDebts() const {
    std::vector<std::tuple<int, int, double>> result;
    for (const auto& [pair, amount] : debts) {
        if (amount > 0) {
            result.emplace_back(pair.first, pair.second, amount);
        }
    }
    return result;
}

const std::unordered_map<int, User>& Ledger::getUsers() const {
    return users;
}

const std::vector<Expense>& Ledger::getExpenses() const {
    return expenses;
}

void Ledger::clearDebts() {
    debts.clear();
}
