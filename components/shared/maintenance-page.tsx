"use client";

import { AlertTriangle, Clock, Wrench } from "lucide-react";

interface MaintenancePageProps {
  message?: string;
  estimatedCompletion?: string;
}

export function MaintenancePage({
  message = "We are currently performing scheduled maintenance. We expect to be back shortly. Thank you for your patience.",
  estimatedCompletion,
}: MaintenancePageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="bg-red-500/20 p-5 rounded-full">
            <AlertTriangle className="w-12 h-12 text-red-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-white mb-4">
          Under Maintenance
        </h1>

        {/* Message */}
        <p className="text-zinc-300 text-base mb-8 leading-relaxed">
          {message}
        </p>

        {/* Estimated Completion */}
        {estimatedCompletion && (
          <div className="inline-flex items-center gap-2 bg-zinc-800/50 border border-zinc-700 rounded-lg px-4 py-3 mb-8">
            <Clock className="w-4 h-4 text-zinc-400" />
            <span className="text-sm text-zinc-300">
              Expected completion:{" "}
              <span className="font-semibold text-zinc-100">
                {new Date(estimatedCompletion).toLocaleString()}
              </span>
            </span>
          </div>
        )}

        {/* Status indicator */}
        <div className="flex items-center justify-center gap-2 text-zinc-500 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500" />
          </span>
          <span>We&apos;ll be back shortly</span>
        </div>

        {/* Footer */}
        <div className="mt-12 flex items-center justify-center gap-2 text-zinc-600 text-xs">
          <Wrench className="w-3.5 h-3.5" />
          <span>NexaFX - Maintenance Mode</span>
        </div>
      </div>
    </div>
  );
}
