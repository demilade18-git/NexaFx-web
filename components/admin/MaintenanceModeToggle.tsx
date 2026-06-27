"use client";

import { useState } from "react";
import {
  Loader2,
  AlertTriangle,
  Clock,
  Calendar,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";

interface MaintenanceState {
  enabled: boolean;
  message: string;
  estimatedCompletion: string;
  createdAt: string;
}

interface MaintenanceModeToggleProps {
  currentState: MaintenanceState | null;
  loading: boolean;
  onToggle: (enabled: boolean, message: string, estimatedCompletion: string) => Promise<void>;
}

export function MaintenanceModeToggle({
  currentState,
  loading: initialLoading,
  onToggle,
}: MaintenanceModeToggleProps) {
  const [enabled, setEnabled] = useState(currentState?.enabled ?? false);
  const [message, setMessage] = useState(
    currentState?.message ??
      "We are currently performing scheduled maintenance. We expect to be back shortly. Thank you for your patience.",
  );
  const [estimatedCompletion, setEstimatedCompletion] = useState(
    currentState?.estimatedCompletion ?? "",
  );
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [scheduleTime, setScheduleTime] = useState("");

  const isCurrentlyEnabled = currentState?.enabled ?? false;

  const handleToggleChange = (newEnabled: boolean) => {
    if (newEnabled && !isCurrentlyEnabled) {
      setShowConfirmation(true);
    } else {
      setEnabled(newEnabled);
    }
  };

  const handleConfirmEnable = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);
    setError(null);
    try {
      await onToggle(true, message, estimatedCompletion);
      setEnabled(true);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to enable maintenance mode.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSchedule = async () => {
    if (!scheduleTime) {
      setError("Please select a scheduled time.");
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await onToggle(true, message, scheduleTime);
      setEnabled(true);
      setScheduleTime("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to schedule maintenance.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDisable = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      await onToggle(false, "", "");
      setEnabled(false);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to disable maintenance mode.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Status Indicator */}
      <div
        className={`rounded-2xl border p-6 ${
          isCurrentlyEnabled
            ? "bg-red-50 border-red-200"
            : "bg-green-50 border-green-200"
        }`}
      >
        <div className="flex items-center gap-4">
          <div
            className={`p-3 rounded-full ${
              isCurrentlyEnabled ? "bg-red-100" : "bg-green-100"
            }`}
          >
            {isCurrentlyEnabled ? (
              <ShieldAlert className="w-6 h-6 text-red-600" />
            ) : (
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            )}
          </div>
          <div>
            <p
              className={`text-lg font-semibold ${
                isCurrentlyEnabled ? "text-red-900" : "text-green-900"
              }`}
            >
              {isCurrentlyEnabled
                ? "Maintenance Mode is Active"
                : "System is Live"}
            </p>
            <p
              className={`text-sm ${
                isCurrentlyEnabled ? "text-red-700" : "text-green-700"
              }`}
            >
              {isCurrentlyEnabled
                ? "Users are seeing the maintenance page."
                : "All users can access the platform normally."}
            </p>
          </div>
        </div>
        {currentState?.createdAt && (
          <p className="mt-3 text-xs text-gray-500">
            Enabled on: {currentState.createdAt}
          </p>
        )}
      </div>

      {/* Toggle Switch */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              Maintenance Mode
            </h3>
            <p className="text-sm text-gray-500">
              Toggle maintenance mode on/off for the platform
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={enabled}
              onChange={(e) => handleToggleChange(e.target.checked)}
              disabled={isSubmitting}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500" />
          </label>
        </div>

        {/* Custom Message */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Custom Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            placeholder="Enter the message shown to users during maintenance..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent resize-y"
            disabled={isSubmitting}
          />
        </div>

        {/* Estimated Completion */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Estimated Completion Time
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="datetime-local"
              value={estimatedCompletion}
              onChange={(e) => setEstimatedCompletion(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Schedule Time */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Schedule Maintenance
          </label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="datetime-local"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {!isCurrentlyEnabled ? (
            <>
              <button
                onClick={handleConfirmEnable}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                Enable Now
              </button>
              <button
                onClick={handleSchedule}
                disabled={isSubmitting || !scheduleTime}
                className="inline-flex items-center gap-2 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Clock className="w-4 h-4" />
                Schedule
              </button>
            </>
          ) : (
            <button
              onClick={handleDisable}
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              Disable Maintenance Mode
            </button>
          )}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          Preview - What Users Will See
        </h3>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          {/* Browser chrome mockup */}
          <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b border-gray-200">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 max-w-md mx-auto bg-white rounded px-3 py-1 text-xs text-gray-400 text-center truncate">
              nexafx.com
            </div>
          </div>
          {/* Preview content */}
          <div className="bg-gradient-to-br from-zinc-900 to-zinc-800 p-8 flex flex-col items-center justify-center min-h-[250px] text-center">
            <div className="bg-red-500/20 p-4 rounded-full mb-4">
              <AlertTriangle className="w-10 h-10 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">
              Under Maintenance
            </h1>
            <p className="text-zinc-300 max-w-md text-sm mb-4">
              {message ||
                "We are currently performing scheduled maintenance. We expect to be back shortly."}
            </p>
            {estimatedCompletion && (
              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <Clock className="w-4 h-4" />
                <span>
                  Estimated completion:{" "}
                  {new Date(estimatedCompletion).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={() => setShowConfirmation(false)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 mx-4 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Enable Maintenance Mode
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to enable maintenance mode? All users will
              see the maintenance page and will not be able to access the
              platform until maintenance mode is disabled.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmEnable}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors"
              >
                Confirm Enable
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
