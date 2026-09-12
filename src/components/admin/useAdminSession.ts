"use client";

import { useCallback, useEffect, useState } from "react";

export const ADMIN_STORAGE_KEY = "onda-admin-key";

export function useAdminSession() {
  const [adminKey, setAdminKey] = useState("");
  const [inputKey, setInputKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem(ADMIN_STORAGE_KEY);
    if (saved) {
      setAdminKey(saved);
      setAuthed(true);
    }
  }, []);

  const verifyKey = useCallback(async (key: string, endpoint: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(endpoint, {
        headers: { "x-admin-key": key },
      });
      if (!res.ok) throw new Error("unauthorized");
      setAuthed(true);
      return true;
    } catch {
      setError("Giriş başarısız. Şifrenizi kontrol edin.");
      setAuthed(false);
      sessionStorage.removeItem(ADMIN_STORAGE_KEY);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (e: React.FormEvent, verifyEndpoint: string) => {
    e.preventDefault();
    sessionStorage.setItem(ADMIN_STORAGE_KEY, inputKey);
    setAdminKey(inputKey);
    return verifyKey(inputKey, verifyEndpoint);
  };

  const logout = () => {
    sessionStorage.removeItem(ADMIN_STORAGE_KEY);
    setAdminKey("");
    setAuthed(false);
    setInputKey("");
  };

  return {
    adminKey,
    inputKey,
    setInputKey,
    authed,
    loading,
    error,
    setError,
    login,
    logout,
    verifyKey,
  };
}
