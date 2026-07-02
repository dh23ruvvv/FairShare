#include "FairShareManager.h"
#include "FileManager.h"
#include <iostream>
#include <sstream>
#include <string>
#include <vector>

int main() {
    FairShareManager manager;
    std::string dataFile = "data/fairshare_snapshot.txt";

    Ledger initialLedger;
    FileManager::loadFromFile(initialLedger, dataFile);
    manager.loadLedger(initialLedger);

    std::cout << "Welcome to FairShare! Type EXIT to quit.\n";
    std::string line;
    while (true) {
        std::cout << "> ";
        if (!std::getline(std::cin, line)) break;
        if (line.empty()) continue;

        std::stringstream ss(line);
        std::string command;
        ss >> command;

        try {
            if (command == "ADD_USER") {
                int id;
                std::string name;
                if (ss >> id >> name) {
                    manager.addUser(id, name);
                    std::cout << "Added user " << name << "\n";
                }
            } else if (command == "EXPENSE") {
                int payerId;
                double amount;
                int numParticipants;
                std::string desc;

                if (ss >> payerId >> amount >> numParticipants) {
                    std::vector<int> participants(numParticipants);
                    for (int i = 0; i < numParticipants; ++i) {
                        ss >> participants[i];
                    }

                    std::string splitType;
                    ss >> splitType;

                    Expense exp(payerId, amount, "Expense");
                    
                    if (splitType == "EQUAL") {
                        for (int pid : participants) {
                            exp.addParticipant(pid, std::make_shared<EqualSplit>(numParticipants));
                        }
                        manager.addExpense(exp);
                        std::cout << "Added equal expense.\n";
                    } else if (splitType == "EXACT") {
                        for (int pid : participants) {
                            double exactAmount;
                            ss >> exactAmount;
                            exp.addParticipant(pid, std::make_shared<ExactSplit>(exactAmount));
                        }
                        manager.addExpense(exp);
                        std::cout << "Added exact expense.\n";
                    } else if (splitType == "PERCENT") {
                        for (int pid : participants) {
                            double percent;
                            ss >> percent;
                            exp.addParticipant(pid, std::make_shared<PercentSplit>(percent));
                        }
                        manager.addExpense(exp);
                        std::cout << "Added percent expense.\n";
                    }
                }
            } else if (command == "SHOW") {
                manager.showBalances();
            } else if (command == "SIMPLIFY") {
                manager.simplifyDebts();
                std::cout << "Debts simplified.\n";
            } else if (command == "HISTORY") {
                manager.showHistory();
            } else if (command == "EXIT") {
                break;
            } else {
                std::cout << "Unknown command.\n";
            }
        } catch (const std::exception& e) {
            std::cerr << "Error: " << e.what() << "\n";
        }
    }

    FileManager::saveToFile(manager.getLedger(), dataFile);
    return 0;
}
