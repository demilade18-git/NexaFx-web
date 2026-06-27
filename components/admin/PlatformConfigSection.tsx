"use client";

import { useState } from "react";
import { Check, Pencil, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface PlatformConfigSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  onSave: () => Promise<void>;
  savedIndicator?: boolean;
}

export function PlatformConfigSection({
  title,
  description,
  children,
  onSave,
  savedIndicator,
}: PlatformConfigSectionProps) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave();
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-xs text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {savedIndicator && !editing && (
            <span className="inline-flex items-center gap-1 text-xs text-green-600 font-medium">
              <Check className="h-3 w-3" />
              Saved
            </span>
          )}
          {editing ? (
            <>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-1 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditing(false)}
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Pencil className="h-3 w-3" />
              Edit
            </button>
          )}
        </div>
      </div>
      <div className={editing ? "" : "pointer-events-none opacity-60"}>
        {children}
      </div>
    </div>
  );
}
