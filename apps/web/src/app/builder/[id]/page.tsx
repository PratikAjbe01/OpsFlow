"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useGetFormByIdQuery } from "@/lib/redux/api/formApi";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import {
  setFields,
  addFields,
  selectField,
  removeField,
  updateSettings,
} from "@/lib/redux/slices/builderSlice";
import ResponsesPanel from "@/components/ResponsePannel";
import AiGeneratorModal from "@/components/AiGentratorModel";
import PropertiesPanel from "@/components/PropertiesPanel";
import DesignPanel from "@/components/DesignPanel";
import ShareModal from "@/components/ShareModel";
import {
  Sparkles,
  Save,
  Type,
  Hash,
  List,
  CheckSquare,
  Settings,
  Paintbrush,
  Trash2,
  Share2,
  Mail,
} from "lucide-react";
import AnalyticsPanel from "@/components/AnalyticsPanel";

export default function BuilderPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);

  const { data: form, isLoading } = useGetFormByIdQuery(id as string);
  const { fields, theme, settings, selectedFieldId, isUnsaved } =
    useAppSelector((state) => state.builder);

const [activeTab, setActiveTab] = useState<'properties' | 'design' | 'responses' | 'analytics'>('design');
  const [showAI, setShowAI] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 2. Auto-switch tabs when selecting a field
  useEffect(() => {
    if (selectedFieldId) setActiveTab("properties");
  }, [selectedFieldId]);

  // 3. Sync Database data to Redux on load
  useEffect(() => {
    if (form) {
      dispatch(
        setFields({
          content: form.content || [],
          theme: form.theme || {},
          settings: form.settings || {
            collectEmails: false,
            limitOneResponse: false,
          },
        })
      );
    }
  }, [form, dispatch]);

  const addManualField = (type: string) => {
    const newField = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      label: `New ${type} field`,
      required: false,
      placeholder: "",
      options: type === "select" ? ["Option 1", "Option 2"] : undefined,
    };
    dispatch(addFields([newField]));
    dispatch(selectField(newField.id));
  };

  // 5. Save Functionality
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`http://localhost:8761/api/forms/${id}/content`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // 👇 2. USE THE REDUX TOKEN HERE
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          content: fields,
          theme,
          settings,
        }),
      });

      if (res.ok) {
        alert("Form Saved Successfully!");
      } else {
        throw new Error("Save failed");
      }
    } catch (err) {
      alert("Failed to save form. You might be logged out.");
    } finally {
      setIsSaving(false);
    }
  };

  // 6. Dynamic Theme Styles Generator
  const getContainerStyles = () => ({
    backgroundColor: theme.cardColor || "#ffffff", // Default to White
    color: theme.textColor || "#000000", // Default to Black
    borderColor: theme.borderColor || "#e5e7eb",
    borderWidth:
      theme.borderStyle === "thin"
        ? "1px"
        : theme.borderStyle === "thick"
        ? "3px"
        : theme.borderStyle === "double"
        ? "4px"
        : "0px",
    borderStyle: theme.borderStyle === "double" ? "double" : "solid",
    borderRadius:
      theme.borderRadius === "none"
        ? "0"
        : theme.borderRadius === "full"
        ? "24px"
        : `var(--radius-${theme.borderRadius})`,
    boxShadow:
      theme.shadow === "none"
        ? "none"
        : theme.shadow === "sm"
        ? "0 1px 2px 0 rgb(0 0 0 / 0.05)"
        : theme.shadow === "md"
        ? "0 4px 6px -1px rgb(0 0 0 / 0.1)"
        : theme.shadow === "lg"
        ? "0 10px 15px -3px rgb(0 0 0 / 0.1)"
        : "0 20px 25px -5px rgb(0 0 0 / 0.1)",
  });

  const radiusMap: any = {
    none: "0px",
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    full: "1.5rem",
  };

  if (isLoading)
    return (
      <div className="p-10 flex items-center justify-center min-h-screen text-gray-500">
        Loading Builder...
      </div>
    );

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      {/* Header */}
      <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm z-10">
        <h1 className="text-xl font-bold text-gray-800">
          {form?.name || "Untitled Form"}
        </h1>
        {/* CENTER TABS (New) */}
        <div className="hidden md:flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab("design")} // Design/Edit Mode
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab !== "responses"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }`}>
            Editor
          </button>
          <button
            onClick={() => setActiveTab("responses")} // Response Mode
            className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === "responses"
                ? "bg-white shadow text-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }`}>
            Responses
          </button>
          <button
   onClick={() => setActiveTab('analytics')}
   className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${activeTab === 'analytics' ? 'bg-white shadow text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
>
   Analytics
</button>
        </div>
        <div className="flex space-x-3 items-center">
          {/* SETTINGS TOGGLE */}
          <div className="flex items-center space-x-4 mr-4 border-r pr-4 h-8">
            <label className="flex items-center text-xs font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900">
              <input
                type="checkbox"
                checked={settings.collectEmails}
                onChange={(e) =>
                  dispatch(updateSettings({ collectEmails: e.target.checked }))
                }
                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Collect Emails
            </label>
            <label className="flex items-center text-xs font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900">
              <input
                type="checkbox"
                checked={settings.limitOneResponse}
                onChange={(e) =>
                  dispatch(
                    updateSettings({ limitOneResponse: e.target.checked })
                  )
                }
                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Limit 1 Response
            </label>
          </div>

          <button
            onClick={() => setShowAI(true)}
            className="flex items-center rounded-md bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 hover:bg-purple-200 transition-colors">
            <Sparkles className="mr-2 h-4 w-4" /> AI Magic
          </button>

          <button
            onClick={handleSave}
            disabled={!isUnsaved && !isSaving}
            className="flex items-center rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-white hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <Save className="mr-2 h-4 w-4" /> {isSaving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={() => setShowShare(true)}
            className="flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 shadow-sm transition-colors">
            <Share2 className="mr-2 h-4 w-4" /> Share
          </button>
        </div>
      </header>

      {/* Main Layout */}
    {activeTab === 'analytics' && id ? (
   <AnalyticsPanel formId={id as string} />
):activeTab === "responses" && id  ? (
        <ResponsesPanel formId={id as string} />
      ) : (
        /* THE EXISTING BUILDER LAYOUT (Left Sidebar, Canvas, Right Sidebar) */
        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 border-r bg-white p-4 overflow-y-auto">
            <h3 className="font-semibold text-gray-500 uppercase text-xs mb-4 tracking-wider">
              Toolbox
            </h3>
            <div className="space-y-3">
              <ToolboxBtn
                icon={Type}
                label="Text Input"
                onClick={() => addManualField("text")}
              />
              <ToolboxBtn
                icon={Hash}
                label="Number Input"
                onClick={() => addManualField("number")}
              />
              <ToolboxBtn
                icon={List}
                label="Dropdown"
                onClick={() => addManualField("select")}
              />
              <ToolboxBtn
                icon={CheckSquare}
                label="Checkbox"
                onClick={() => addManualField("checkbox")}
              />
              <ToolboxBtn
                icon={Type}
                label="Text Area"
                onClick={() => addManualField("textarea")}
              />
            </div>
          </div>

          {/* CENTER: CANVAS */}
          <div
            className="flex-1 overflow-y-auto p-10 transition-colors duration-300"
            style={{ backgroundColor: theme.bgColor }}
            onClick={() => {
              dispatch(selectField(null));
              setActiveTab("design");
            }}>
            <div
              className="mx-auto max-w-2xl min-h-[500px] p-8 transition-all duration-300 relative"
              style={{
                ...getContainerStyles(),
                borderRadius: radiusMap[theme.borderRadius],
              }}
              onClick={(e) => e.stopPropagation()}>
              <div className="space-y-6">
                {/* Form Title */}
                <h1
                  className="text-3xl font-bold border-b pb-4 mb-6"
                  style={{
                    borderColor: (theme.textColor || "#000000") + "33",
                    color: theme.textColor || "#000000",
                  }}>
                  {form?.name || "Untitled Form"}
                </h1>

                {/* EMAIL COLLECTION HEADER */}
                {settings.collectEmails && (
                  <div className="border-b pb-6 mb-6 border-dashed border-gray-300">
                    <div className="rounded-md border border-gray-300 p-4 bg-gray-50">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="flex items-center text-gray-700 text-sm">
                        <Mail className="w-4 h-4 mr-2" />
                        <span>Valid email required</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-700 mt-2">
                      * This form collects emails automatically.
                      {settings.limitOneResponse && " (Limited to 1 response)"}
                    </p>
                  </div>
                )}

                {/* FIELDS RENDER LOOP */}
                {fields.length === 0 ? (
                  <div className="text-center text-gray-900 py-20 opacity-40 border-2 border-dashed border-gray-300 rounded-lg">
                    <p>Your form is empty.</p>
                    <p className="text-sm">
                      Click a tool on the left to add fields.
                    </p>
                  </div>
                ) : (
                  fields.map((field: any) => (
                    <div
                      key={field.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(selectField(field.id));
                      }}
                      className={`group relative rounded-md border p-4 cursor-pointer transition-all ${
                        selectedFieldId === field.id
                          ? "border-blue-500 ring-1 ring-blue-500 bg-blue-50/10"
                          : "border-transparent hover:border-gray-300"
                      }`}>
                      {/* Delete Button */}
                      {(selectedFieldId === field.id || true) && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(removeField(field.id));
                          }}
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-all"
                          title="Delete Field">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}

                      <label
                        className="block text-sm font-medium mb-1  pointer-events-none"
                        style={{ color: theme.textColor }}>
                        {field.label}{" "}
                        {field.required && (
                          <span className="text-red-500">*</span>
                        )}
                      </label>

                      <div className="pointer-events-none">
                        {field.type === "textarea" ? (
                          <textarea
                            className="w-full rounded border border-gray-300 p-2 h-20 bg-gray-50 text-black placeholder-gray-500 opacity-100" // Added text-black and placeholder-gray-500
                            placeholder={
                              field.placeholder || "Type your answer here..."
                            } // Ensure placeholder text exists
                            disabled
                          />
                        ) : field.type === "select" ? (
                          <select
                            className="w-full rounded border text-black border-gray-300 p-2 bg-white opacity-80"
                            disabled>
                            <option>Select an option...</option>
                            {field.options?.map((opt: string, i: number) => (
                              <option key={i}>{opt}</option>
                            ))}
                          </select>
                        ) : field.type === "checkbox" ? (
                          <div className="flex items-center pt-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-blue-600"
                              disabled
                            />
                            <span className="ml-2 text-sm text-gray-500">
                              Checkbox Option
                            </span>
                          </div>
                        ) : (
                          <input
                            type={field.type}
                            className="w-full rounded border border-gray-300 p-2 bg-gray-50 text-black placeholder-gray-500 opacity-100" // Added text-black
                            placeholder={
                              field.placeholder || "Short answer text"
                            }
                            disabled
                          />
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* SUBMIT BUTTON PREVIEW */}
                {fields.length > 0 && (
                  <div
                    className="pt-4 border-t mt-6"
                    style={{ borderColor: theme.borderColor }}>
                    <button
                      className={`px-6 py-2.5 ${
                        theme.btnColor === null ? "text-black" : "text-white"
                      } font-medium shadow-sm hover:opacity-90 transition-opacity`}
                      style={{
                        backgroundColor: theme.btnColor,
                        borderRadius: radiusMap[theme.borderRadius],
                      }}>
                      Submit Application
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR: TABS + PANELS */}
          <div className="w-80 border-l bg-white flex flex-col h-full shadow-xl z-20">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("properties")}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                  activeTab === "properties"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                <Settings className="w-4 h-4" /> Fields
              </button>
              <button
                onClick={() => setActiveTab("design")}
                className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                  activeTab === "design"
                    ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                    : "text-gray-500 hover:text-gray-700"
                }`}>
                <Paintbrush className="w-4 h-4" /> Design
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {activeTab === "properties" ? (
                <PropertiesPanel />
              ) : (
                <DesignPanel />
              )}
            </div>
          </div>
        </div>
      )}
      {/* LEFT SIDEBAR: TOOLBOX */}

      {showAI && <AiGeneratorModal onClose={() => setShowAI(false)} />}
      {showShare && (
        <ShareModal formId={id as string} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}

// Simple Helper Component
function ToolboxBtn({ icon: Icon, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all shadow-sm">
      <Icon className="mr-3 h-4 w-4 text-gray-500" />
      {label}
    </button>
  );
}
