"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function LogoutButton() {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="p-2 text-red-400 hover:text-red-300 rounded-full hover:bg-red-500/10 transition-colors"
      title="Log out"
    >
      <LogOut className="w-5 h-5" />
    </button>
  );
}
