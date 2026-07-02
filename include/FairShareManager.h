#pragma once

#include "Ledger.h"
#include <string>
#include <vector>

class FairShareManager {
    Ledger ledger;
    int nextExpenseId = 1;

public:
    void addUser(int id, const std::string& name);
    void addExpense(const Expense& e);
    void showBalances() const;
    void simplifyDebts();
    void showHistory() const;
    const Ledger& getLedger() const;
    void loadLedger(const Ledger& l);
};
