import { useState } from "react";
import { Bell, Search, Settings, Menu, ChevronDown, Wifi } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

interface TopBarProps {
  onMenuToggle: () => void;
}

const NOTIFICATIONS = [
  { id: 1, type: "warning", text: "5 patients awaiting triage", time: "2m ago" },
  { id: 2, type: "info",    text: "Lab results ready for P-2041", time: "8m ago" },
  { id: 3, type: "success", text: "Insurance claim #C-881 approved", time: "15m ago" },
  { id: 4, type: "danger",  text: "ICU bed capacity at 92%", time: "22m ago" },
];

export function TopBar({ onMenuToggle }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });

  return (
    <header className="h-16 bg-card border-b border-border flex items-center gap-4 px-4 lg:px-6 shrink-0 z-30 relative">
      {/* Hamburger */}
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Search bar */}
      <div
        className={cn(
          "hidden sm:flex items-center gap-2 flex-1 max-w-sm h-9 px-3 rounded-lg border transition-all duration-200",
          searchFocused
            ? "border-primary bg-primary-light/30 ring-2 ring-primary/20"
            : "border-border bg-muted/40 hover:bg-muted/70"
        )}
      >
        <Search className="h-4 w-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="Search patients, records, staff…"
          className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground outline-none text-foreground min-w-0"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <kbd className="hidden md:inline text-[10px] text-muted-foreground border border-border rounded px-1.5 py-0.5">⌘K</kbd>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Date & time */}
      <div className="hidden md:flex flex-col items-end leading-tight">
        <span className="text-xs font-semibold text-foreground">{timeStr}</span>
        <span className="text-[10px] text-muted-foreground">{dateStr}</span>
      </div>

      {/* PWA / Online indicator */}
      <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
        <Wifi className="h-3 w-3" />
        <span>Online</span>
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
          className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card animate-pulse-soft" />
        </button>

        {showNotifications && (
          <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-card-lg z-50 animate-fade-in overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <span className="text-sm font-semibold text-foreground">Notifications</span>
              <span className="badge-danger">{NOTIFICATIONS.length} new</span>
            </div>
            <div className="divide-y divide-border max-h-72 overflow-y-auto">
              {NOTIFICATIONS.map((n) => (
                <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer">
                  <span
                    className={cn(
                      "mt-0.5 h-2 w-2 rounded-full shrink-0",
                      n.type === "warning" ? "bg-warning" :
                      n.type === "success" ? "bg-success" :
                      n.type === "danger"  ? "bg-destructive" : "bg-primary"
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground leading-snug">{n.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-border">
              <button className="w-full text-xs text-center text-primary font-medium hover:underline">View all notifications</button>
            </div>
          </div>
        )}
      </div>

      {/* Theme toggle */}
      <ThemeToggle />

      {/* Settings */}
      <button className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
        <Settings className="h-5 w-5" />
      </button>

      {/* Profile */}
      <div className="relative">
        <button
          onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-muted transition-colors"
        >
          <div className="h-8 w-8 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
            SA
          </div>
          <div className="hidden md:flex flex-col items-start leading-tight">
            <span className="text-xs font-semibold text-foreground">Super Admin</span>
            <span className="text-[10px] text-muted-foreground">Platform Operator</span>
          </div>
          <ChevronDown className="hidden md:block h-3.5 w-3.5 text-muted-foreground" />
        </button>

        {showProfile && (
          <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl shadow-card-lg z-50 animate-fade-in overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Super Admin</p>
              <p className="text-xs text-muted-foreground">admin@besaplus.health</p>
            </div>
            {[
              "My Profile", "Account Settings", "Security", "Help & Support"
            ].map((item) => (
              <button
                key={item}
                className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
              >
                {item}
              </button>
            ))}
            <div className="border-t border-border">
              <button className="w-full text-left px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors">
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
