#pragma once

#include "Ledger.h"
#include <string>

class FileManager {
public:
    static void saveToFile(const Ledger& ledger, const std::string& filename);
    static void loadFromFile(Ledger& ledger, const std::string& filename);
};
