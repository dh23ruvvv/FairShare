#pragma once

class Split {
public:
    virtual double getAmount(double totalAmount) const = 0;
    virtual ~Split() = default;
};

class EqualSplit : public Split {
    int numParticipants;
public:
    EqualSplit(int n);
    double getAmount(double totalAmount) const override;
};

class ExactSplit : public Split {
    double exactAmount;
public:
    ExactSplit(double amt);
    double getAmount(double totalAmount) const override;
};

class PercentSplit : public Split {
    double percentage;
public:
    PercentSplit(double pct);
    double getAmount(double totalAmount) const override;
};
