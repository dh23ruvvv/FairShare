#pragma once

#include <unordered_map>
#include <map>
#include <vector>
#include <utility>
#include "User.h"
#include "Expense.h"

class Ledger {
    std::unordered_map<int, User> users;
    std::vector<Expense> expenses;
    std::map<std::pair<int, int>, double> debts;

public:
    void addUser(const User& u);
    void recordExpense(const Expense& e);
    void updateDebt(int debtorId, int creditorId, double amount);
    std::vector<std::tuple<int, int, double>> getAllDebts() const;
    const std::unordered_map<int, User>& getUsers() const;
    const std::vector<Expense>& getExpenses() const;
    void clearDebts();
};
