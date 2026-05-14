"use client";

import { useAuth } from "./context/AuthContext";
import AuthModal from "./AuthModal";

export default function AuthModalGlobal() {
  const { isModalOpen, closeModal } = useAuth();
  return <AuthModal isOpen={isModalOpen} onClose={closeModal} />;
}