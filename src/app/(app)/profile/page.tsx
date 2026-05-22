"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { ProfileSidebar, type ProfileTab } from "./ProfileSidebar";
import { ProfileDatosTab } from "./ProfileDatosTab";
import { ProfileDireccionesTab } from "./ProfileDireccionesTab";
import { ProfilePedidosTab } from "./ProfilePedidosTab";
import { ProfileEditModal } from "./ProfileEditModal";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading, logout } = useAuth();
  const [activeTab, setActiveTab]       = useState<ProfileTab>("datos");
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight mt-4">Mi Perfil</h1>
        <p className="text-muted-foreground mt-2">
          Gestioná tus datos personales y tus pedidos.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <ProfileSidebar
          user={user ?? null}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={handleLogout}
        />

        <div className="md:col-span-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === "datos" && (
            <ProfileDatosTab
              user={user ?? null}
              onEditClick={() => setEditModalOpen(true)}
            />
          )}

          {activeTab === "direcciones" && <ProfileDireccionesTab />}

          {activeTab === "pedidos" && <ProfilePedidosTab />}
        </div>
      </div>

      <ProfileEditModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialFirstName={user?.firstName ?? ""}
        initialLastName={user?.lastName ?? ""}
      />
    </div>
  );
}
