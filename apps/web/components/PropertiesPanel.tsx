"use client";

import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { updateField, removeField } from "@/lib/redux/slices/builderSlice";
import { Trash2, Plus, X } from "lucide-react";

export default function PropertiesPanel() {
  const dispatch = useAppDispatch();
  const { fields, selectedFieldId } = useAppSelector((state) => state.builder);

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  if (!selectedField) {
    return (
      <div className="flex h-full items-center justify-center p-6 text-center">
        <div className="rounded-xl bg-muted/60 px-6 py-8 text-sm text-muted-foreground">
          Select a field on the canvas to edit its properties.
        </div>
      </div>
    );
  }

  const handleChange = (key: string, value: any) => {
    dispatch(updateField({ id: selectedField.id, changes: { [key]: value } }));
  };

  const handleOptionChange = (idx: number, value: string) => {
    const newOptions = [...(selectedField.options || [])];
    newOptions[idx] = value;
    handleChange("options", newOptions);
  };

  const addOption = () => {
    handleChange("options", [...(selectedField.options || []), "New Option"]);
  };

  const removeOption = (idx: number) => {
    handleChange(
      "options",
      (selectedField.options || []).filter((_, i) => i !== idx)
    );
  };

  return (
    <div className="flex h-full flex-col gap-6 p-5">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-wide text-foreground">
          Field Properties
        </h3>

        <button
          onClick={() => dispatch(removeField(selectedField.id))}
          className="rounded-md p-1.5 text-red-500 hover:bg-red-500/10 transition"
          title="Delete Field">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* CONTENT */}
      <div className="space-y-5 rounded-xl bg-muted/50 p-4">
        {/* Label */}
        <div>
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Label
          </label>
          <input
            type="text"
            value={selectedField.label}
            onChange={(e) => handleChange("label", e.target.value)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
          />
        </div>

        {/* Placeholder */}
        {selectedField.type !== "checkbox" &&
          selectedField.type !== "select" && (
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                Placeholder
              </label>
              <input
                type="text"
                value={selectedField.placeholder || ""}
                onChange={(e) => handleChange("placeholder", e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-violet-500 focus:outline-none"
              />
            </div>
          )}

        {/* Required Toggle */}
        <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={selectedField.required}
            onChange={(e) => handleChange("required", e.target.checked)}
            className="h-4 w-4 rounded border-border text-violet-600 focus:ring-violet-500"
          />
          Required field
        </label>
      </div>

      {/* SELECT OPTIONS */}
      {selectedField.type === "select" && (
        <div className="rounded-xl bg-muted/50 p-4 space-y-3">
          <label className="block text-xs font-medium text-muted-foreground">
            Dropdown Options
          </label>

          <div className="space-y-2">
            {selectedField.options?.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  value={opt}
                  onChange={(e) => handleOptionChange(idx, e.target.value)}
                  className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-sm focus:border-violet-500 focus:outline-none"
                />
                <button
                  onClick={() => removeOption(idx)}
                  className="rounded-md p-1 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={addOption}
            className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700">
            <Plus className="h-3 w-3" />
            Add option
          </button>
        </div>
      )}
    </div>
  );
}
