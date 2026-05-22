import { User, Edit3 } from "lucide-react";
import type { User as UserType } from "@/lib/types";

interface Props {
  user: UserType | null;
  onEditClick: () => void;
}

export function ProfileDatosTab({ user, onEditClick }: Props) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <User className="w-5 h-5 text-primary" />
          Información Personal
        </h2>
        <button
          onClick={onEditClick}
          className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover transition-colors"
        >
          <Edit3 className="w-4 h-4" />
          Editar
        </button>
      </div>

      {user ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[
            { label: "Nombre",   value: user.firstName },
            { label: "Apellido", value: user.lastName },
            { label: "Email",    value: user.email },
          ].map(({ label, value }) => (
            <div key={label} className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {label}
              </label>
              <p className="font-semibold text-lg">{value}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">No hay datos disponibles.</p>
      )}
    </div>
  );
}
