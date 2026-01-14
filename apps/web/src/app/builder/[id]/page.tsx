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
import AiGeneratorModal from "@/components/AiGentratorModel";
import PropertiesPanel from "@/components/PropertiesPanel";
import DesignPanel from "@/components/DesignPanel";
import ShareModal from "@/components/ShareModel";
import ResponsesPanel from "@/components/ResponsePannel";
import AnalyticsPanel from "@/components/AnalyticsPanel";
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
  Lock,
} from "lucide-react";

/* ------------------ THEME FALLBACK ------------------ */

const defaultTheme = {
  bgColor: "#f9fafb",
  cardColor: "#ffffff",
  textColor: "#1f2937",
  btnColor: "#2563eb",
  borderColor: "#e5e7eb",
  borderRadius: "md",
  borderStyle: "thin",
  shadow: "md",
};

const radiusMap: Record<string, string> = {
  none: "0px",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  full: "1.5rem",
};

/* ------------------ PAGE ------------------ */

export default function BuilderPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { accessToken, user } = useAppSelector((state) => state.auth);

  const { data: form, isLoading } = useGetFormByIdQuery(id as string);

  const {
    fields,
    theme: reduxTheme,
    settings,
    selectedFieldId,
    isUnsaved,
  } = useAppSelector((state) => state.builder);

  const { currentWorkspace } = useAppSelector((state) => state.workspace);

  const [activeTab, setActiveTab] = useState<
    "design" | "properties" | "responses" | "analytics"
  >("design");

  const [showAI, setShowAI] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  /* ------------------ PERMISSIONS ------------------ */

  let myRole = "viewer";

  if (currentWorkspace && user) {
    if (currentWorkspace.ownerId === user.id) {
      myRole = "owner";
    } else {
      const member = currentWorkspace.members?.find(
        (m: any) => m.userId === user.id
      );
      if (member) myRole = member.role;
    }
  }

  if (form?.creatorId === user?.id) myRole = "owner";

  const canEdit = ["owner", "admin", "editor"].includes(myRole);
  const canViewData = ["owner", "admin"].includes(myRole);

  /* ------------------ EFFECTS ------------------ */

  useEffect(() => {
    if (selectedFieldId) setActiveTab("properties");
  }, [selectedFieldId]);

  useEffect(() => {
    if (!form) return;
    dispatch(
      setFields({
        content: form.content || [],
        theme: form.theme || defaultTheme,
        settings: form.settings || {
          collectEmails: false,
          limitOneResponse: false,
        },
      })
    );
  }, [form, dispatch]);

  /* ------------------ HELPERS ------------------ */

  const addManualField = (type: string) => {
    const newField = {
      id: crypto.randomUUID(),
      type,
      label: `New ${type} field`,
      required: false,
      placeholder: "",
      options: type === "select" ? ["Option 1", "Option 2"] : undefined,
    };
    dispatch(addFields([newField]));
    dispatch(selectField(newField.id));
  };

  const handleSave = async () => {
    if (!canEdit) return;
    setIsSaving(true);
    try {
      await fetch(`http://localhost:8761/api/forms/${id}/content`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          content: fields,
          theme: reduxTheme,
          settings,
        }),
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  /* ------------------ RENDER ------------------ */

  return (
    <div className="flex h-screen flex-col bg-muted/40">
      {/* ------------------ HEADER ------------------ */}
      <header className="sticky top-0 z-20 h-14 border-b bg-background px-4 sm:px-6 flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-2 min-w-0">
          <h1 className="truncate text-sm font-medium text-foreground">
            {form?.name || "Untitled Form"}
          </h1>

          {!canEdit && (
            <span className="flex items-center gap-1 rounded bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              <Lock className="h-3 w-3" />
              Read only
            </span>
          )}
        </div>

        {/* CENTER TABS (Desktop) */}
        <div className="hidden md:flex items-center gap-1 rounded-lg bg-muted p-1">
          <TabButton
            active={activeTab === "design" || activeTab === "properties"}
            onClick={() => setActiveTab("design")}
            label={!canEdit ? "Preview" : "Editor"}
          />

          {canViewData && (
            <>
              <TabButton
                active={activeTab === "responses"}
                onClick={() => setActiveTab("responses")}
                label="Responses"
              />
              <TabButton
                active={activeTab === "analytics"}
                onClick={() => setActiveTab("analytics")}
                label="Analytics"
              />
            </>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2 ">
          {/* controls here */}

          {/* Settings toggles (desktop only) */}
          {canEdit && (
            <div className="hidden lg:flex items-center gap-4 pr-4 border-r">
              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-muted-foreground/40 text-violet-600 focus:ring-violet-500"
                />
                Collect Emails
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground transition">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-muted-foreground/40 text-violet-600 focus:ring-violet-500"
                />
                Limit 1
              </label>
            </div>
          )}

          {canEdit && (
            <button
              onClick={() => setShowAI(true)}
              className="flex items-center gap-2 rounded-lg bg-violet-500/10 px-3 py-2 text-sm font-medium text-violet-700 hover:bg-violet-500/20 transition">
              <Sparkles className="h-4 w-4" />
              AI
            </button>
          )}

          {canEdit && (
            <button
              onClick={handleSave}
              disabled={!isUnsaved || isSaving}
              className="flex items-center gap-2 rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 transition disabled:opacity-50">
              {isSaving ? "Saving…" : "Save"}
            </button>
          )}

          <button
            onClick={() => setShowShare(true)}
            className="flex items-center gap-2 rounded-lg border border-muted-foreground/30 bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted transition">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </header>
      {canViewData && (
        <div className="md:hidden border-b bg-background">
          <div className="flex">
            <MobileTab
              active={activeTab === "design" || activeTab === "properties"}
              onClick={() => setActiveTab("design")}
              label={!canEdit ? "Preview" : "Editor"}
            />
            <MobileTab
              active={activeTab === "responses"}
              onClick={() => setActiveTab("responses")}
              label="Responses"
            />
            <MobileTab
              active={activeTab === "analytics"}
              onClick={() => setActiveTab("analytics")}
              label="Analytics"
            />
          </div>
        </div>
      )}

      {/* ------------------ MAIN ------------------ */}
      {activeTab === "responses" && canViewData ? (
        <ResponsesPanel formId={id as string} />
      ) : activeTab === "analytics" && canViewData ? (
        <AnalyticsPanel formId={id as string} />
      ) : (
        <div className="flex flex-1 overflow-hidden">
          {/* TOOLBOX */}
          {canEdit && (
            <aside className="hidden md:block w-60 border-r bg-background p-3">
              <p className="text-[11px] uppercase tracking-wide text-muted-foreground mb-3">
                Toolbox
              </p>
              <div className="space-y-1">
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
            </aside>
          )}

          {/* CANVAS */}
          <main
            className="flex-1 overflow-y-auto px-4 sm:px-10 py-8"
            style={{ backgroundColor: reduxTheme.bgColor }}
            onClick={() => {
              dispatch(selectField(null));
              setActiveTab("design");
            }}>
            <div
              className="mx-auto max-w-xl p-8"
              style={{
                backgroundColor: reduxTheme.cardColor,
                borderRadius: radiusMap[reduxTheme.borderRadius],
                color: reduxTheme.textColor,
              }}
              onClick={(e) => e.stopPropagation()}>
              <div className="space-y-6">
                {fields.length === 0 && (
                  <div className="text-center py-16 text-sm text-muted-foreground">
                    Add fields from the toolbox
                  </div>
                )}

                {fields.map((field: any) => (
                  <div
                    key={field.id}
                    onClick={() => dispatch(selectField(field.id))}
                    className={`relative group rounded-md p-4 ${
                      selectedFieldId === field.id
                        ? "ring-2 ring-foreground/20"
                        : "hover:bg-muted/50"
                    }`}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(removeField(field.id));
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </button>

                    <label className="block text-sm font-medium mb-1">
                      {field.label}
                      {field.required && (
                        <span className="text-red-500">*</span>
                      )}
                    </label>

                    <input
                      disabled
                      className="w-full rounded-md border p-2 text-sm"
                    />
                  </div>
                ))}
              </div>
            </div>
          </main>

          {/* RIGHT PANEL */}
          {canEdit && (
            <aside className="hidden lg:flex w-80 border-l bg-background flex-col">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab("properties")}
                  className={`flex-1 py-3 text-sm ${
                    activeTab === "properties"
                      ? "border-b-2 border-foreground"
                      : "text-muted-foreground"
                  }`}>
                  <Settings className="h-4 w-4 inline mr-2" />
                  Fields
                </button>
                <button
                  onClick={() => setActiveTab("design")}
                  className={`flex-1 py-3 text-sm ${
                    activeTab === "design"
                      ? "border-b-2 border-foreground"
                      : "text-muted-foreground"
                  }`}>
                  <Paintbrush className="h-4 w-4 inline mr-2" />
                  Design
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">
                {activeTab === "properties" ? (
                  <PropertiesPanel />
                ) : (
                  <DesignPanel />
                )}
              </div>
            </aside>
          )}
        </div>
      )}

      {showAI && <AiGeneratorModal onClose={() => setShowAI(false)} />}
      {showShare && (
        <ShareModal formId={id as string} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}

/* ------------------ TOOLBOX BUTTON ------------------ */

function ToolboxBtn({ icon: Icon, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition">
      <Icon className="h-4 w-4" />
      {label}
    </button>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-1.5 text-sm rounded-md transition ${
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground"
      }`}>
      {label}
    </button>
  );
}

function MobileTab({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 text-sm ${
        active
          ? "border-b-2 border-foreground text-foreground"
          : "text-muted-foreground"
      }`}>
      {label}
    </button>
  );
}
