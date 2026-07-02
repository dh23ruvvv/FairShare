#include "Expense.h"

Expense::Expense(int payerId, double amount, std::string desc)
    : payerId(payerId), totalAmount(amount), description(std::move(desc)) {}

void Expense::addParticipant(int userId, std::shared_ptr<Split> split) {
    participantSplits[userId] = std::move(split);
}

std::map<int, double> Expense::computeShares() const {
    std::map<int, double> shares;
    for (const auto& [userId, split] : participantSplits) {
        shares[userId] = split->getAmount(totalAmount);
    }
    return shares;
}

int Expense::getPayerId() const {
    return payerId;
}

double Expense::getTotalAmount() const {
    return totalAmount;
}
