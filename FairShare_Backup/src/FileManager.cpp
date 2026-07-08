#include "FileManager.h"
#include <fstream>
#include <sstream>

void FileManager::saveToFile(const Ledger& ledger, const std::string& filename) {
    std::ofstream out(filename);
    if (!out) return;

    out << "USERS\n";
    for (const auto& [id, user] : ledger.getUsers()) {
        out << user.getId() << "," << user.getName() << "\n";
    }

    out << "DEBTS\n";
    for (const auto& debt : ledger.getAllDebts()) {
        out << std::get<0>(debt) << "," << std::get<1>(debt) << "," << std::get<2>(debt) << "\n";
    }
}

void FileManager::loadFromFile(Ledger& ledger, const std::string& filename) {
    std::ifstream in(filename);
    if (!in) return;

    std::string line;
    std::string section;

    while (std::getline(in, line)) {
        if (line == "USERS" || line == "DEBTS") {
            section = line;
            continue;
        }

        if (section == "USERS") {
            std::stringstream ss(line);
            std::string idStr, name;
            if (std::getline(ss, idStr, ',') && std::getline(ss, name, ',')) {
                ledger.addUser(User(std::stoi(idStr), name));
            }
        } else if (section == "DEBTS") {
            std::stringstream ss(line);
            std::string dStr, cStr, aStr;
            if (std::getline(ss, dStr, ',') && std::getline(ss, cStr, ',') && std::getline(ss, aStr, ',')) {
                ledger.updateDebt(std::stoi(dStr), std::stoi(cStr), std::stod(aStr));
            }
        }
    }
}
