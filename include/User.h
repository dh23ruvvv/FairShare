#pragma once

#include <string>

class User {
    int id;
    std::string name;
public:
    User(int id, std::string name);
    int getId() const;
    std::string getName() const;
};
