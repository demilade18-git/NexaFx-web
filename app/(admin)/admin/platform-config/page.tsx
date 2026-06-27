"use client";

import { useState } from "react";
import { PlatformConfigSection } from "@/components/admin/PlatformConfigSection";
import { CurrencyToggle } from "@/components/admin/CurrencyToggle";
import { Switch } from "@/components/ui/switch";

interface Currency {
  id: string;
  name: string;
  symbol: string;
  enabled: boolean;
}

interface KYCRequirement {
  level: string;
  required: boolean;
  documentTypes: string[];
}

interface PlatformConfig {
  currencies: Currency[];
  kycRequirements: KYCRequirement[];
  registrationOpen: boolean;
  supportEmail: string;
  platformName: string;
  maintenanceMessage: string;
}

const DEFAULT_CONFIG: PlatformConfig = {
  currencies: [
    { id: "USD", name: "US Dollar", symbol: "$", enabled: true },
    { id: "NGN", name: "Nigerian Naira", symbol: "₦", enabled: true },
    { id: "EUR", name: "Euro", symbol: "€", enabled: true },
    { id: "GBP", name: "British Pound", symbol: "£", enabled: true },
    { id: "USDC", name: "USD Coin", symbol: "USDC", enabled: false },
    { id: "ETH", name: "Ethereum", symbol: "ETH", enabled: false },
  ],
  kycRequirements: [
    {
      level: "Level 1",
      required: false,
      documentTypes: ["Government ID"],
    },
    {
      level: "Level 2",
      required: true,
      documentTypes: ["Government ID", "Proof of Address"],
    },
    {
      level: "Level 3",
      required: true,
      documentTypes: ["Government ID", "Proof of Address", "Source of Funds"],
    },
  ],
  registrationOpen: true,
  supportEmail: "support@nexafx.com",
  platformName: "NexaFX",
  maintenanceMessage: "",
};

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="rounded-lg border border-gray-200 bg-white p-5 space-y-4">
          <div className="h-4 w-32 bg-gray-200 rounded" />
          <div className="h-8 w-full bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function PlatformConfigPage() {
  const [config, setConfig] = useState<PlatformConfig>(DEFAULT_CONFIG);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaved(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setSaved(true);
    } catch {
      // handle error
    }
  };

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Platform Configuration</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage global platform settings and preferences
        </p>
      </div>

      {/* Currencies */}
      <PlatformConfigSection
        title="Currencies"
        description="Enable or disable supported currencies"
        onSave={handleSave}
        savedIndicator={saved}
      >
        <CurrencyToggle
          currencies={config.currencies}
          onToggle={(id, enabled) =>
            setConfig((prev) => ({
              ...prev,
              currencies: prev.currencies.map((c) =>
                c.id === id ? { ...c, enabled } : c
              ),
            }))
          }
        />
      </PlatformConfigSection>

      {/* KYC Requirements */}
      <PlatformConfigSection
        title="KYC Requirements"
        description="Configure KYC levels and required documents"
        onSave={handleSave}
        savedIndicator={saved}
      >
        <div className="space-y-4">
          {config.kycRequirements.map((kyc) => (
            <div
              key={kyc.level}
              className="rounded-lg border border-gray-100 p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{kyc.level}</span>
                <Switch
                  checked={kyc.required}
                  onCheckedChange={(checked) =>
                    setConfig((prev) => ({
                      ...prev,
                      kycRequirements: prev.kycRequirements.map((k) =>
                        k.level === kyc.level ? { ...k, required: checked } : k
                      ),
                    }))
                  }
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {kyc.documentTypes.map((doc) => (
                  <span
                    key={doc}
                    className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-600"
                  >
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </PlatformConfigSection>

      {/* Registration */}
      <PlatformConfigSection
        title="Registration"
        description="Open or close new user registration"
        onSave={handleSave}
        savedIndicator={saved}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">Open Registration</p>
            <p className="text-xs text-gray-500">
              {config.registrationOpen
                ? "New users can sign up"
                : "Registration is closed"}
            </p>
          </div>
          <Switch
            checked={config.registrationOpen}
            onCheckedChange={(checked) =>
              setConfig((prev) => ({ ...prev, registrationOpen: checked }))
            }
          />
        </div>
      </PlatformConfigSection>

      {/* Support Email */}
      <PlatformConfigSection
        title="Support Email"
        description="Set the email address for customer support"
        onSave={handleSave}
        savedIndicator={saved}
      >
        <input
          type="email"
          value={config.supportEmail}
          onChange={(e) =>
            setConfig((prev) => ({ ...prev, supportEmail: e.target.value }))
          }
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
          placeholder="support@example.com"
        />
      </PlatformConfigSection>

      {/* Platform Name */}
      <PlatformConfigSection
        title="Platform Name"
        description="Set the platform name displayed to users"
        onSave={handleSave}
        savedIndicator={saved}
      >
        <input
          type="text"
          value={config.platformName}
          onChange={(e) =>
            setConfig((prev) => ({ ...prev, platformName: e.target.value }))
          }
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20"
          placeholder="Platform name"
        />
      </PlatformConfigSection>

      {/* Maintenance Message */}
      <PlatformConfigSection
        title="Maintenance Message"
        description="Set a global maintenance message shown to all users"
        onSave={handleSave}
        savedIndicator={saved}
      >
        <textarea
          value={config.maintenanceMessage}
          onChange={(e) =>
            setConfig((prev) => ({ ...prev, maintenanceMessage: e.target.value }))
          }
          rows={3}
          className="w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/20 resize-none"
          placeholder="Enter maintenance message (leave empty for no message)"
        />
      </PlatformConfigSection>
    </div>
  );
}
