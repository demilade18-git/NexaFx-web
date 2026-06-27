/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Loader2 } from "lucide-react";
import { MaintenanceModeToggle } from "@/components/admin/MaintenanceModeToggle";
import { getRequestErrorMessage, isOfflineError } from "@/lib/api-client";

interface MaintenanceState {
  enabled: boolean;
  message: string;
  estimatedCompletion: string;
  createdAt: string;
}

export default function MaintenancePage() {
  const [maintenanceState, setMaintenanceState] = useState<MaintenanceState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMaintenanceState = async () => {
    try {
      setLoading(true);
      setError(null);
      // Try fetching from API, fall back to offline state
      const response = await fetch("/api/admin/maintenance", {
        headers: {
          "x-client-token":
            typeof window !== "undefined"
              ? localStorage.getItem("access_token") ?? ""
              : "",
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMaintenanceState(data);
      } else {
        // Default to disabled if endpoint doesn't exist
        setMaintenanceState({
          enabled: false,
          message: "",
          estimatedCompletion: "",
          createdAt: "",
        });
      }
    } catch (err: any) {
      console.warn("Failed to fetch maintenance state, using defaults:", err);
      setMaintenanceState({
        enabled: false,
        message: "",
        estimatedCompletion: "",
        createdAt: "",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaintenanceState();
  }, []);

  const handleToggle = async (
    enabled: boolean,
    message: string,
    estimatedCompletion: string,
  ) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token") ?? ""
        : "";

    const response = await fetch("/api/admin/maintenance", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-client-token": token,
      },
      body: JSON.stringify({ enabled, message, estimatedCompletion }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data?.message || "Failed to update maintenance mode.");
    }

    const data = await response.json();
    setMaintenanceState(data);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-amber-100 rounded-xl">
          <ShieldAlert className="w-6 h-6 text-amber-700" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Maintenance Mode
          </h1>
          <p className="text-sm text-gray-500">
            Control platform maintenance and downtime
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <MaintenanceModeToggle
        currentState={maintenanceState}
        loading={loading}
        onToggle={handleToggle}
      />
    </div>
  );
}
