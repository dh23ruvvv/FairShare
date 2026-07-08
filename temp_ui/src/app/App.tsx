import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Plus,
  Zap,
  TrendingDown,
  TrendingUp,
  ArrowRight,
  X,
  Check,
  ChevronDown,
  Receipt,
  Utensils,
  Car,
  Home,
  Plane,
  ShoppingCart,
  CircleDollarSign,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SplitType = "equal" | "exact" | "percent";
type Screen = "dashboard" | "friends";

interface User {
  id: number;
  name: string;
  initials: string;
  color: string;
}

interface Balance {
  from: User;
  to: User;
  amount: number;
}

interface Activity {
  id: number;
  description: string;
  payer: User;
  amount: number;
  date: string;
  icon: React.ReactNode;
  participants: User[];
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

const USERS: User[] = [
  { id: 1, name: "Alice Chen",    initials: "AC", color: "#10B981" },
  { id: 2, name: "Bob Patel",     initials: "BP", color: "#10B981" },
  { id: 3, name: "Clara Kim",     initials: "CK", color: "#10B981" },
  { id: 4, name: "David Torres",  initials: "DT", color: "#10B981" },
  { id: 5, name: "Esha Gupta",    initials: "EG", color: "#10B981" },
];

const CURRENT_USER = USERS[0];

const INITIAL_BALANCES: Balance[] = [
  { from: USERS[1], to: USERS[0], amount: 142.50 },
  { from: USERS[2], to: USERS[0], amount:  87.00 },
  { from: USERS[0], to: USERS[3], amount:  55.00 },
  { from: USERS[4], to: USERS[1], amount:  30.25 },
  { from: USERS[3], to: USERS[2], amount: 200.00 },
];

const INITIAL_ACTIVITY: Activity[] = [
  { id: 1, description: "Dinner at Nobu",    payer: USERS[0], amount: 320.00, date: "Jul 1",  icon: <Utensils    size={13} />, participants: [USERS[0], USERS[1], USERS[2]] },
  { id: 2, description: "Uber to Airport",   payer: USERS[1], amount:  68.50, date: "Jun 29", icon: <Car         size={13} />, participants: [USERS[1], USERS[3]] },
  { id: 3, description: "Airbnb – Lisbon",   payer: USERS[3], amount: 1100.00,date: "Jun 25", icon: <Plane       size={13} />, participants: USERS.slice(0, 4) },
  { id: 4, description: "Weekly Groceries",  payer: USERS[2], amount: 145.80, date: "Jun 22", icon: <ShoppingCart size={13} />, participants: [USERS[0], USERS[2], USERS[4]] },
  { id: 5, description: "June Rent",         payer: USERS[0], amount: 2400.00,date: "Jun 1",  icon: <Home        size={13} />, participants: [USERS[0], USERS[1]] },
];

const COLORS = ["#10B981"];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD" });

function Avatar({ user, size = "md" }: { user: User; size?: "sm" | "md" | "lg" }) {
  const dims = size === "sm" ? "h-6 w-6 text-[9px]" : size === "lg" ? "h-10 w-10 text-sm" : "h-8 w-8 text-xs";
  return (
    <div
      className={`${dims} rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0`}
      style={{ backgroundColor: user.color + "33", color: user.color, border: `1.5px solid ${user.color}55` }}
    >
      {user.initials}
    </div>
  );
}

function Badge({ children, color }: { children: React.ReactNode; color: "green" | "red" | "indigo" | "slate" }) {
  const styles = {
    green:  { background: "#10B98115", color: "#34D399", border: "1px solid #10B98130" },
    red:    { background: "#EF444415", color: "#F87171", border: "1px solid #EF444430" },
    indigo: { background: "#6366F115", color: "#818CF8", border: "1px solid #6366F130" },
    slate:  { background: "#33415510", color: "#64748B", border: "1px solid #33415530" },
  }[color];
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium" style={styles}>
      {children}
    </span>
  );
}

function Divider() {
  return <div className="h-px w-full" style={{ background: "rgba(51,65,85,0.5)" }} />;
}

// ─── Card ────────────────────────────────────────────────────────────────────

function Card({ children, className = "", noPad = false }: { children: React.ReactNode; className?: string; noPad?: boolean }) {
  return (
    <div
      className={`rounded-xl ${noPad ? "" : "p-5"} ${className}`}
      style={{ background: "#131C2E", border: "1px solid #1E2D45" }}
    >
      {children}
    </div>
  );
}

// ─── Summary Cards ────────────────────────────────────────────────────────────

function SummaryCards({ balances, currentUser }: { balances: Balance[]; currentUser: User }) {
  const owedToYou = balances.filter(b => b.to.id === currentUser.id).reduce((s, b) => s + b.amount, 0);
  const youOwe    = balances.filter(b => b.from.id === currentUser.id).reduce((s, b) => s + b.amount, 0);
  const net = owedToYou - youOwe;

  const cards = [
    {
      label: "Net Balance",
      value: (net >= 0 ? "+" : "") + fmt(net),
      sub: net >= 0 ? "You're ahead overall" : "You owe overall",
      color: net >= 0 ? "#10B981" : "#EF4444",
      icon: <CircleDollarSign size={16} />,
    },
    {
      label: "Owed to You",
      value: fmt(owedToYou),
      sub: `from ${balances.filter(b => b.to.id === currentUser.id).length} people`,
      color: "#10B981",
      icon: <TrendingUp size={16} />,
    },
    {
      label: "You Owe",
      value: fmt(youOwe),
      sub: `to ${balances.filter(b => b.from.id === currentUser.id).length} people`,
      color: "#EF4444",
      icon: <TrendingDown size={16} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <Card key={i} className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{c.label}</span>
            <span style={{ color: c.color + "99" }}>{c.icon}</span>
          </div>
          <div>
            <p className="text-2xl font-bold font-['Outfit'] tracking-tight" style={{ color: c.color }}>
              {c.value}
            </p>
            <p className="text-xs text-slate-600 mt-1">{c.sub}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── Balance Row ──────────────────────────────────────────────────────────────

function BalanceRow({ balance, currentUser }: { balance: Balance; currentUser: User }) {
  const isOwedToYou = balance.to.id === currentUser.id;
  const isYouOwe    = balance.from.id === currentUser.id;

  return (
    <div className="flex items-center justify-between py-3 group hover:bg-slate-800/20 -mx-5 px-5 transition-colors duration-100 cursor-default">
      <div className="flex items-center gap-3">
        <Avatar user={balance.from} size="md" />
        <ArrowRight size={12} className="text-slate-700" />
        <Avatar user={balance.to} size="md" />
        <p className="text-sm text-slate-300 ml-1">
          <span className="font-semibold text-slate-200">
            {balance.from.id === currentUser.id ? "You" : balance.from.name.split(" ")[0]}
          </span>
          <span className="text-slate-600 mx-1.5">owes</span>
          <span className="font-semibold text-slate-200">
            {balance.to.id === currentUser.id ? "you" : balance.to.name.split(" ")[0]}
          </span>
        </p>
      </div>
      <span
        className="text-sm font-semibold tabular-nums"
        style={{ color: isOwedToYou ? "#34D399" : isYouOwe ? "#F87171" : "#94A3B8" }}
      >
        {fmt(balance.amount)}
      </span>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard({
  balances, setBalances, activity, currentUser, onAddExpense,
}: {
  balances: Balance[];
  setBalances: (b: Balance[]) => void;
  activity: Activity[];
  currentUser: User;
  onAddExpense: () => void;
}) {
  const [simplified, setSimplified] = useState(false);

  function simplifyDebts() {
    const net: Record<number, number> = {};
    balances.forEach(b => {
      net[b.from.id] = (net[b.from.id] || 0) - b.amount;
      net[b.to.id]   = (net[b.to.id]   || 0) + b.amount;
    });
    const creditors: { user: User; amount: number }[] = [];
    const debtors:   { user: User; amount: number }[] = [];
    USERS.forEach(u => {
      const n = net[u.id] || 0;
      if (n > 0.01) creditors.push({ user: u, amount: n });
      else if (n < -0.01) debtors.push({ user: u, amount: -n });
    });
    const result: Balance[] = [];
    let ci = 0, di = 0;
    while (ci < creditors.length && di < debtors.length) {
      const settle = Math.min(creditors[ci].amount, debtors[di].amount);
      result.push({ from: debtors[di].user, to: creditors[ci].user, amount: +settle.toFixed(2) });
      creditors[ci].amount -= settle;
      debtors[di].amount   -= settle;
      if (creditors[ci].amount < 0.01) ci++;
      if (debtors[di].amount   < 0.01) di++;
    }
    setBalances(result);
    setSimplified(true);
  }

  return (
    <div className="space-y-5">
      <SummaryCards balances={balances} currentUser={currentUser} />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Balances */}
        <Card noPad className="lg:col-span-3">
          <div className="flex items-center justify-between px-5 pt-5 pb-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-100 font-['Outfit']">Balances</h2>
              <p className="text-xs text-slate-600 mt-0.5">
                {simplified ? "Optimised — minimum transactions" : `${balances.length} active debts`}
              </p>
            </div>
            <button
              onClick={simplifyDebts}
              disabled={simplified}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150"
              style={simplified
                ? { background: "#10B98112", color: "#34D399", border: "1px solid #10B98125" }
                : { background: "#6366F1", color: "#fff", border: "1px solid #6366F1" }}
            >
              {simplified ? <><Check size={11} /> Simplified</> : <><Zap size={11} /> Simplify Debts</>}
            </button>
          </div>
          <Divider />
          <div className="px-5 pb-2">
            {balances.length === 0
              ? <p className="text-center text-slate-600 py-10 text-sm">All settled up!</p>
              : balances.map((b, i) => <BalanceRow key={i} balance={b} currentUser={currentUser} />)
            }
          </div>
        </Card>

        {/* Activity */}
        <Card noPad className="lg:col-span-2">
          <div className="px-5 pt-5 pb-4">
            <h2 className="text-sm font-semibold text-slate-100 font-['Outfit']">Recent Activity</h2>
            <p className="text-xs text-slate-600 mt-0.5">Latest expenses</p>
          </div>
          <Divider />
          <div className="px-5 py-2">
            {activity.map((item, i) => (
              <div key={item.id}>
                <div className="flex items-start gap-3 py-3">
                  <div
                    className="h-7 w-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: "#1E2D45", color: "#64748B" }}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-200 truncate">{item.description}</p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {item.payer.name.split(" ")[0]} paid · {item.date}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400 tabular-nums flex-shrink-0 mt-0.5">
                    {fmt(item.amount)}
                  </span>
                </div>
                {i < activity.length - 1 && <Divider />}
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* FAB */}
      <button
        onClick={onAddExpense}
        className="fixed bottom-7 right-7 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:opacity-90 active:scale-95"
        style={{ background: "#6366F1", border: "1px solid #818CF8" }}
      >
        <Plus size={15} />
        Add Expense
      </button>
    </div>
  );
}

// ─── Add Expense Modal ────────────────────────────────────────────────────────

function Input({
  value, onChange, placeholder, type = "text", right = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  right?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3 py-2.5 rounded-lg text-sm text-slate-100 placeholder-slate-600 outline-none transition-colors ${right ? "text-right" : ""}`}
      style={{ background: "#0D1626", border: "1px solid #1E2D45" }}
      onFocus={e => (e.target.style.borderColor = "#6366F1")}
      onBlur={e => (e.target.style.borderColor = "#1E2D45")}
    />
  );
}

function AddExpenseModal({
  users, currentUser, onClose, onSave,
}: {
  users: User[];
  currentUser: User;
  onClose: () => void;
  onSave: (a: Activity) => void;
}) {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [payerId, setPayerId] = useState(currentUser.id);
  const [splitType, setSplitType] = useState<SplitType>("equal");
  const [selected, setSelected] = useState<Set<number>>(new Set(users.map(u => u.id)));
  const [exactAmounts, setExactAmounts] = useState<Record<number, string>>({});
  const [percentAmounts, setPercentAmounts] = useState<Record<number, string>>({});
  const [payerOpen, setPayerOpen] = useState(false);

  const total = parseFloat(amount) || 0;
  const selectedUsers = users.filter(u => selected.has(u.id));
  const equalShare = selectedUsers.length > 0 ? total / selectedUsers.length : 0;
  const exactSum   = Object.values(exactAmounts).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const percentSum = Object.values(percentAmounts).reduce((s, v) => s + (parseFloat(v) || 0), 0);
  const exactValid   = total > 0 && Math.abs(exactSum - total) < 0.01;
  const percentValid = Math.abs(percentSum - 100) < 0.01;
  const canSave = description.trim() && total > 0 && selectedUsers.length > 0 &&
    (splitType === "equal" || (splitType === "exact" && exactValid) || (splitType === "percent" && percentValid));

  function toggleUser(id: number) {
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  }

  function handleSave() {
    onSave({
      id: Date.now(),
      description,
      payer: users.find(u => u.id === payerId)!,
      amount: total,
      date: "Jul 2",
      icon: <Receipt size={13} />,
      participants: selectedUsers,
    });
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: "#0D1626", border: "1px solid #1E2D45" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #1E2D45" }}>
          <h2 className="text-base font-semibold font-['Outfit'] text-slate-100">Add Expense</h2>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-slate-600 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Description</label>
            <Input value={description} onChange={setDescription} placeholder="e.g. Dinner at Luigi's" />
          </div>

          {/* Amount + Payer */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Amount</label>
              <Input value={amount} onChange={setAmount} placeholder="0.00" type="number" />
            </div>
            <div className="relative">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Paid by</label>
              <button
                onClick={() => setPayerOpen(o => !o)}
                className="w-full px-3 py-2.5 rounded-lg text-sm text-slate-200 flex items-center justify-between transition-colors"
                style={{ background: "#0D1626", border: "1px solid #1E2D45" }}
              >
                <span>{users.find(u => u.id === payerId)?.name.split(" ")[0]}</span>
                <ChevronDown size={13} className="text-slate-600" />
              </button>
              {payerOpen && (
                <div
                  className="absolute top-full mt-1 w-full rounded-xl overflow-hidden z-10 shadow-xl"
                  style={{ background: "#131C2E", border: "1px solid #1E2D45" }}
                >
                  {users.map(u => (
                    <button
                      key={u.id}
                      onClick={() => { setPayerId(u.id); setPayerOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-slate-300 hover:bg-slate-800/40 transition-colors"
                    >
                      <Avatar user={u} size="sm" />
                      {u.name.split(" ")[0]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Participants */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Split Between</label>
            <div className="flex flex-wrap gap-2">
              {users.map(u => {
                const active = selected.has(u.id);
                return (
                  <button
                    key={u.id}
                    onClick={() => toggleUser(u.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-100"
                    style={{
                      background: active ? u.color + "18" : "#0D1626",
                      border: `1px solid ${active ? u.color + "50" : "#1E2D45"}`,
                      color: active ? u.color : "#475569",
                    }}
                  >
                    {active && <Check size={10} />}
                    {u.name.split(" ")[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Split type */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">Split Method</label>
            <div className="flex rounded-lg p-0.5 mb-4" style={{ background: "#0D1626", border: "1px solid #1E2D45" }}>
              {(["equal", "exact", "percent"] as SplitType[]).map(type => (
                <button
                  key={type}
                  onClick={() => setSplitType(type)}
                  className="flex-1 py-1.5 rounded-md text-xs font-semibold capitalize transition-all duration-150"
                  style={splitType === type
                    ? { background: "#6366F1", color: "#fff" }
                    : { color: "#475569" }}
                >
                  {type === "equal" ? "Equal" : type === "exact" ? "Exact $" : "Percent %"}
                </button>
              ))}
            </div>

            {splitType === "equal" && (
              <div className="space-y-1">
                {selectedUsers.map(u => (
                  <div key={u.id} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: "#0D1626", border: "1px solid #1E2D45" }}>
                    <div className="flex items-center gap-2">
                      <Avatar user={u} size="sm" />
                      <span className="text-sm text-slate-300">{u.name.split(" ")[0]}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-300 tabular-nums">{fmt(equalShare)}</span>
                  </div>
                ))}
              </div>
            )}

            {splitType === "exact" && (
              <div className="space-y-2">
                {selectedUsers.map(u => (
                  <div key={u.id} className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <Avatar user={u} size="sm" />
                      <span className="text-sm text-slate-300">{u.name.split(" ")[0]}</span>
                    </div>
                    <div className="w-28">
                      <Input
                        value={exactAmounts[u.id] || ""}
                        onChange={v => setExactAmounts(p => ({ ...p, [u.id]: v }))}
                        placeholder="0.00"
                        type="number"
                        right
                      />
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-1 text-xs">
                  <span className="text-slate-600">Allocated</span>
                  <span className="font-semibold tabular-nums" style={{ color: exactValid ? "#34D399" : exactSum > 0 ? "#F87171" : "#475569" }}>
                    {fmt(exactSum)} / {fmt(total)}
                  </span>
                </div>
              </div>
            )}

            {splitType === "percent" && (
              <div className="space-y-2">
                {selectedUsers.map(u => (
                  <div key={u.id} className="flex items-center gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <Avatar user={u} size="sm" />
                      <span className="text-sm text-slate-300">{u.name.split(" ")[0]}</span>
                    </div>
                    <div className="flex items-center gap-1.5 w-28">
                      <Input
                        value={percentAmounts[u.id] || ""}
                        onChange={v => setPercentAmounts(p => ({ ...p, [u.id]: v }))}
                        placeholder="0"
                        type="number"
                        right
                      />
                      <span className="text-slate-600 text-sm flex-shrink-0">%</span>
                    </div>
                  </div>
                ))}
                <div className="flex justify-between pt-1 text-xs">
                  <span className="text-slate-600">Total</span>
                  <span className="font-semibold tabular-nums" style={{ color: percentValid ? "#34D399" : percentSum > 0 ? "#F87171" : "#475569" }}>
                    {percentSum.toFixed(1)}% / 100%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-6 py-4" style={{ borderTop: "1px solid #1E2D45" }}>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:text-slate-300 transition-colors"
            style={{ background: "#131C2E", border: "1px solid #1E2D45" }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!canSave}
            className="flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150"
            style={{
              background: canSave ? "#6366F1" : "#6366F120",
              color: canSave ? "#fff" : "#6366F160",
              border: `1px solid ${canSave ? "#6366F1" : "#6366F130"}`,
            }}
          >
            Save Expense
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Friends Screen ───────────────────────────────────────────────────────────

function FriendsScreen({
  users, onAddUser, balances, currentUser,
}: {
  users: User[];
  onAddUser: (name: string) => void;
  balances: Balance[];
  currentUser: User;
}) {
  const [name, setName] = useState("");

  function handleAdd() {
    if (!name.trim()) return;
    onAddUser(name.trim());
    setName("");
  }

  function netForUser(user: User) {
    let n = 0;
    balances.forEach(b => {
      if (b.from.id === user.id && b.to.id === currentUser.id) n += b.amount;
      if (b.to.id === user.id && b.from.id === currentUser.id) n -= b.amount;
    });
    return n;
  }

  return (
    <div className="space-y-5 max-w-xl">
      <Card>
        <h2 className="text-sm font-semibold text-slate-100 font-['Outfit'] mb-4">Add a Friend</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAdd()}
            placeholder="Full name"
            className="flex-1 px-3 py-2.5 rounded-lg text-sm text-slate-100 placeholder-slate-600 outline-none"
            style={{ background: "#0D1626", border: "1px solid #1E2D45" }}
            onFocus={e => (e.target.style.borderColor = "#6366F1")}
            onBlur={e => (e.target.style.borderColor = "#1E2D45")}
          />
          <button
            onClick={handleAdd}
            disabled={!name.trim()}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-1.5 transition-all duration-100"
            style={{
              background: name.trim() ? "#6366F1" : "#6366F120",
              color: name.trim() ? "#fff" : "#6366F160",
              border: `1px solid ${name.trim() ? "#6366F1" : "#6366F130"}`,
            }}
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </Card>

      <Card noPad>
        <div className="px-5 pt-5 pb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-100 font-['Outfit']">Members</h2>
          <Badge color="slate">{users.length} people</Badge>
        </div>
        <Divider />
        <div className="px-5 py-2">
          {users.map((user, i) => {
            const net = netForUser(user);
            const isCurrentUser = user.id === currentUser.id;
            return (
              <div key={user.id}>
                <div className="flex items-center justify-between py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar user={user} size="lg" />
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-200">{user.name}</p>
                        {isCurrentUser && <Badge color="indigo">you</Badge>}
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5 font-mono">{user.initials}</p>
                    </div>
                  </div>
                  {!isCurrentUser && (
                    <div className="text-right">
                      {net === 0
                        ? <Badge color="slate">Settled</Badge>
                        : <>
                            <p className="text-sm font-semibold tabular-nums" style={{ color: net > 0 ? "#34D399" : "#F87171" }}>
                              {net > 0 ? "+" : ""}{fmt(Math.abs(net))}
                            </p>
                            <p className="text-xs text-slate-600 mt-0.5">{net > 0 ? "owes you" : "you owe"}</p>
                          </>
                      }
                    </div>
                  )}
                </div>
                {i < users.length - 1 && <Divider />}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

// ─── App Root ─────────────────────────────────────────────────────────────────

const NAV: { id: Screen; label: string; icon: React.ReactNode }[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={15} /> },
  { id: "friends",   label: "Friends",   icon: <Users size={15} /> },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("dashboard");
  const [showModal, setShowModal] = useState(false);
  const [users, setUsers] = useState<User[]>(USERS);
  const [balances, setBalances] = useState<Balance[]>(INITIAL_BALANCES);
  const [activity, setActivity] = useState<Activity[]>(INITIAL_ACTIVITY);

  function handleAddUser(name: string) {
    const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
    setUsers(prev => [...prev, {
      id: Date.now(), name, initials,
      color: COLORS[prev.length % COLORS.length],
    }]);
  }

  return (
    <div className="min-h-screen font-['Inter']" style={{ background: "#0A1120" }}>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside
          className="w-56 flex-shrink-0 hidden md:flex flex-col sticky top-0 h-screen"
          style={{ background: "#0D1626", borderRight: "1px solid #1E2D45" }}
        >
          {/* Logo */}
          <div className="px-5 h-14 flex items-center" style={{ borderBottom: "1px solid #1E2D45" }}>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: "#6366F1" }}>
                <Receipt size={14} className="text-white" />
              </div>
              <span className="text-base font-bold font-['Outfit'] text-slate-100 tracking-tight">FairShare</span>
            </div>
          </div>

          {/* User */}
          <div className="px-3 py-3" style={{ borderBottom: "1px solid #1E2D45" }}>
            <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg" style={{ background: "#131C2E" }}>
              <Avatar user={CURRENT_USER} size="md" />
              <div>
                <p className="text-xs font-semibold text-slate-200">{CURRENT_USER.name}</p>
                <p className="text-[10px] text-slate-600">Active session</p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="p-2 flex-1">
            {NAV.map(item => {
              const active = screen === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id)}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-100 mb-0.5"
                  style={{
                    background: active ? "#6366F118" : "transparent",
                    color: active ? "#818CF8" : "#475569",
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Add expense */}
          <div className="p-3" style={{ borderTop: "1px solid #1E2D45" }}>
            <button
              onClick={() => setShowModal(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold text-white transition-opacity duration-100 hover:opacity-90"
              style={{ background: "#6366F1" }}
            >
              <Plus size={13} />
              Add Expense
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0 flex flex-col">
          {/* Top bar */}
          <header
            className="h-14 px-8 flex items-center justify-between flex-shrink-0 sticky top-0 z-20"
            style={{ background: "rgba(10,17,32,0.9)", borderBottom: "1px solid #1E2D45", backdropFilter: "blur(8px)" }}
          >
            <div>
              <h1 className="text-sm font-semibold font-['Outfit'] text-slate-100">
                {screen === "dashboard" ? "Dashboard" : "Friends"}
              </h1>
              <p className="text-xs text-slate-600">
                {screen === "dashboard" ? "Group finances overview" : "Manage group members"}
              </p>
            </div>
            {/* Mobile nav */}
            <div className="flex gap-1 md:hidden">
              {NAV.map(item => (
                <button
                  key={item.id}
                  onClick={() => setScreen(item.id)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ background: screen === item.id ? "#6366F118" : "transparent", color: screen === item.id ? "#818CF8" : "#475569" }}
                >
                  {item.icon}
                </button>
              ))}
            </div>
          </header>

          <div className="flex-1 px-6 md:px-8 py-7">
            {screen === "dashboard" && (
              <Dashboard
                balances={balances}
                setBalances={setBalances}
                activity={activity}
                currentUser={CURRENT_USER}
                onAddExpense={() => setShowModal(true)}
              />
            )}
            {screen === "friends" && (
              <FriendsScreen
                users={users}
                onAddUser={handleAddUser}
                balances={balances}
                currentUser={CURRENT_USER}
              />
            )}
          </div>
        </main>
      </div>

      {showModal && (
        <AddExpenseModal
          users={users}
          currentUser={CURRENT_USER}
          onClose={() => setShowModal(false)}
          onSave={item => setActivity(prev => [item, ...prev])}
        />
      )}
    </div>
  );
}
