"use client";

import { Switch } from "@/components/ui/switch";

interface Currency {
  id: string;
  name: string;
  symbol: string;
  enabled: boolean;
}

interface CurrencyToggleProps {
  currencies: Currency[];
  onToggle: (currencyId: string, enabled: boolean) => void;
}

export function CurrencyToggle({ currencies, onToggle }: CurrencyToggleProps) {
  return (
    <div className="space-y-3">
      {currencies.map((currency) => (
        <div
          key={currency.id}
          className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-700">
              {currency.symbol}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{currency.name}</p>
              <p className="text-xs text-gray-400">{currency.id}</p>
            </div>
          </div>
          <Switch
            checked={currency.enabled}
            onCheckedChange={(checked) => onToggle(currency.id, checked)}
          />
        </div>
      ))}
    </div>
  );
}
