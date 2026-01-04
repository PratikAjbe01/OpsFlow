"use client";

import { useState } from "react";
import { Sparkles, X } from "lucide-react"; // Removed 'Form' (likely invalid)
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"; // Combined imports
import { addFields } from "@/lib/redux/slices/builderSlice";

export default function AiGeneratorModal({ onClose }: { onClose: () => void }) {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);

    try {
      const res = await fetch("http://localhost:8761/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ description: prompt }),
      });

      const data = await res.json();

      if (data.success) {
        dispatch(addFields(data.content));
        onClose();
      } else {
        alert("AI Failed: " + data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-blue-600">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-lg font-bold">AI Form Generator</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Describe your form...
          </label>
          <textarea
            className="w-full rounded-md border text-gray-700 border-gray-300 p-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="e.g., A job application form for a Senior React Developer with 5 years experience..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm text-gray-600 hover:bg-gray-100">
            Cancel
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt}
            className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" /> Generate Form
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
