#pragma once

#include <string>
#include <map>
#include <memory>
#include "Split.h"

class Expense {
    int payerId;
    double totalAmount;
    std::string description;
    std::map<int, std::shared_ptr<Split>> participantSplits;

public:
    Expense(int payerId, double amount, std::string desc);
    void addParticipant(int userId, std::shared_ptr<Split> split);
    std::map<int, double> computeShares() const;
    int getPayerId() const;
    double getTotalAmount() const;
    std::string getDescription() const;
};