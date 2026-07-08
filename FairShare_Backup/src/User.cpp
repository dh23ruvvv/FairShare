#include "User.h"

User::User(int id, std::string name) : id(id), name(std::move(name)) {}

int User::getId() const {
    return id;
}

std::string User::getName() const {
    return name;
}
