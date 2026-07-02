#include <gtest/gtest.h>
#include "FairShareManager.h"
#include "Split.h"

// Test 1: Equal Split
TEST(FairShareTest, EqualSplitCalculation) {
    FairShareManager manager;
    manager.addUser(1, "Alice");
    manager.addUser(2, "Bob");
    
    // Alice paid 100, split equally with Bob
    Expense exp(1, 100.0, "Lunch");
    exp.addParticipant(1, std::make_shared<EqualSplit>(2));
    exp.addParticipant(2, std::make_shared<EqualSplit>(2));
    
    manager.addExpense(exp);
    manager.simplifyDebts();
    
    auto debts = manager.getLedger().getAllDebts();
    
    // Check results
    ASSERT_EQ(debts.size(), 1);
    EXPECT_EQ(std::get<0>(debts[0]), 2);    // Debtor: Bob
    EXPECT_EQ(std::get<1>(debts[0]), 1);    // Creditor: Alice
    EXPECT_EQ(std::get<2>(debts[0]), 50.0); // Amount: 50
}

// Test 2: Percentage Split
TEST(FairShareTest, PercentSplitCalculation) {
    FairShareManager manager;
    manager.addUser(1, "Alice");
    manager.addUser(2, "Bob");
    
    // Bob pays 200, Alice owes 25%, Bob owes 75%
    Expense exp(2, 200.0, "Dinner");
    exp.addParticipant(1, std::make_shared<PercentSplit>(25.0));
    exp.addParticipant(2, std::make_shared<PercentSplit>(75.0));
    
    manager.addExpense(exp);
    manager.simplifyDebts();
    
    auto debts = manager.getLedger().getAllDebts();
    
    ASSERT_EQ(debts.size(), 1);
    EXPECT_EQ(std::get<0>(debts[0]), 1);    // Debtor: Alice
    EXPECT_EQ(std::get<1>(debts[0]), 2);    // Creditor: Bob
    EXPECT_EQ(std::get<2>(debts[0]), 50.0); // Amount: 50 (25% of 200)
}
