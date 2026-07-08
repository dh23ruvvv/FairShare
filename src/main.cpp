#include "FairShareManager.h"
#include "FileManager.h"
#include "Split.h"
#include <httplib.h>
#include <nlohmann/json.hpp>
#include <iostream>
#include <memory>
#include <vector>

using json = nlohmann::json;

#define SET_CORS(res) \
    res.set_header("Access-Control-Allow-Origin", "*"); \
    res.set_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS"); \
    res.set_header("Access-Control-Allow-Headers", "Content-Type");

int main() {
    FairShareManager manager;
    httplib::Server svr;

    if (!svr.set_mount_point("/", "./frontend/dist")) {
        std::cerr << "Warning: The frontend/dist directory doesn't exist. Serving API only." << std::endl;
    }

    svr.Options(R"(.*)", [](const httplib::Request&, httplib::Response& res) {
        SET_CORS(res);
    });

    svr.Get("/api/users", [&manager](const httplib::Request&, httplib::Response& res) {
        SET_CORS(res);
        json j = json::array();
        for (const auto& [id, user] : manager.getLedger().getUsers()) {
            j.push_back({{"id", id}, {"name", user.getName()}});
        }
        res.set_content(j.dump(), "application/json");
    });

    svr.Post("/api/users", [&manager](const httplib::Request& req, httplib::Response& res) {
        SET_CORS(res);
        try {
            auto body = json::parse(req.body);
            int id = body["id"];
            std::string name = body["name"];
            manager.addUser(id, name);
            res.set_content("{\"status\":\"success\"}", "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(e.what(), "text/plain");
        }
    });

    svr.Delete(R"(/api/users/(\d+))", [&manager](const httplib::Request& req, httplib::Response& res) {
        SET_CORS(res);
        try {
            int id = std::stoi(req.matches[1]);
            manager.removeUser(id);
            res.set_content("{\"status\":\"success\"}", "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(e.what(), "text/plain");
        }
    });


    svr.Get("/api/activity", [&manager](const httplib::Request&, httplib::Response& res) {
        SET_CORS(res);
        json j = json::array();
        int i = 0;
        for (const auto& expense : manager.getLedger().getExpenses()) {
            j.push_back({
                {"id", i++},
                {"description", expense.getDescription()},
                {"payer_id", expense.getPayerId()},
                {"amount", expense.getTotalAmount()}
            });
        }
        res.set_content(j.dump(), "application/json");
    });

    svr.Get("/api/debts", [&manager](const httplib::Request&, httplib::Response& res) {
        SET_CORS(res);
        json j = json::array();
        auto users = manager.getLedger().getUsers();
        for (const auto& debt : manager.getLedger().getAllDebts()) {
            int debtorId = std::get<0>(debt);
            int creditorId = std::get<1>(debt);
            double amt = std::get<2>(debt);
            if (amt <= 0) continue;
            
            std::string debtorName = users.count(debtorId) ? users.at(debtorId).getName() : "Unknown";
            std::string creditorName = users.count(creditorId) ? users.at(creditorId).getName() : "Unknown";
            j.push_back({
                {"debtor_id", debtorId},
                {"debtor_name", debtorName},
                {"creditor_id", creditorId},
                {"creditor_name", creditorName},
                {"amount", amt}
            });
        }
        res.set_content(j.dump(), "application/json");
    });

    svr.Post("/api/simplify", [&manager](const httplib::Request&, httplib::Response& res) {
        SET_CORS(res);
        manager.simplifyDebts();
        res.set_content("{\"status\":\"success\"}", "application/json");
    });

    svr.Post("/api/expenses", [&manager](const httplib::Request& req, httplib::Response& res) {
        SET_CORS(res);
        try {
            auto body = json::parse(req.body);
            std::string desc = body["description"];
            double amount = body["amount"];
            int payerId = body["payerId"];
            std::string type = body["type"]; 
            
            Expense e(payerId, amount, desc);

            if (type == "EQUAL") {
                auto partList = body["participants"].get<std::vector<int>>();
                auto split = std::make_shared<EqualSplit>(partList.size());
                for (int pId : partList) {
                    e.addParticipant(pId, split);
                }
            } else if (type == "EXACT") {
                for (const auto& p : body["participants"]) {
                    int pId = p["id"];
                    double val = p["val"];
                    e.addParticipant(pId, std::make_shared<ExactSplit>(val));
                }
            } else if (type == "PERCENT") {
                for (const auto& p : body["participants"]) {
                    int pId = p["id"];
                    double val = p["val"];
                    e.addParticipant(pId, std::make_shared<PercentSplit>(val));
                }
            } else {
                throw std::runtime_error("Invalid split type");
            }

            manager.addExpense(e);
            res.set_content("{\"status\":\"success\"}", "application/json");
        } catch (const std::exception& e) {
            res.status = 400;
            res.set_content(std::string("{\"error\":\"") + e.what() + "\"}", "application/json");
        }
    });

    std::cout << "Server starting at http://localhost:8080\n";
    svr.listen("0.0.0.0", 8080);
    return 0;
}
