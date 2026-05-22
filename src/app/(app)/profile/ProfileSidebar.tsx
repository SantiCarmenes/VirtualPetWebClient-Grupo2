import type { ElementType } from "react";
import { User, MapPin, Package, LogOut, ChevronRight } from "lucide-react";
import type { User as UserType } from "@/lib/types";

export type ProfileTab = "datos" | "direcciones" | "pedidos";

interface Props {
  user: UserType | null;
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  onLogout: () => void;
}

const TABS: { id: ProfileTab; icon: ElementType; label: string }[] = [
  { id: "datos",       icon: User,    label: "Datos Personales" },
  { id: "direcciones", icon: MapPin,  label: "Direcciones" },
  { id: "pedidos",     icon: Package, label: "Mis Pedidos" },
];

export function ProfileSidebar({ user, activeTab, onTabChange, onLogout }: Props) {
  return (
    <div className="md:col-span-1 space-y-2">
      {user && (
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shrink-0">
            {user.firstName[0]}{user.lastName[0]}
          </div>
          <div className="min-w-0">
            <p className="font-bold truncate">{user.firstName} {user.lastName}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        </div>
      )}

      {TABS.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
            activeTab === id
              ? "bg-primary/10 text-primary font-bold border border-primary/20"
              : "text-foreground/80 hover:bg-muted hover:text-foreground font-medium"
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 ${activeTab === id ? "" : "text-muted-foreground group-hover:text-foreground transition-colors"}`} />
            {label}
          </div>
          <ChevronRight className={`w-4 h-4 ${activeTab === id ? "" : "opacity-0 group-hover:opacity-100 transition-opacity"}`} />
        </button>
      ))}

      <div className="pt-4 mt-4 border-t border-border">
        <button
          id="profile-logout"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-500/10 font-medium rounded-xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
}
