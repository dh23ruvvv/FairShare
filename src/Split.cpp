#include "Split.h"

EqualSplit::EqualSplit(int n) : numParticipants(n) {}

double EqualSplit::getAmount(double totalAmount) const {
    if (numParticipants <= 0) return 0.0;
    return totalAmount / numParticipants;
}

ExactSplit::ExactSplit(double amt) : exactAmount(amt) {}

double ExactSplit::getAmount(double /*totalAmount*/) const {
    return exactAmount;
}

PercentSplit::PercentSplit(double pct) : percentage(pct) {}

double PercentSplit::getAmount(double totalAmount) const {
    return totalAmount * (percentage / 100.0);
}
