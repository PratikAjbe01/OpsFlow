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
  Menu,
  X,
} from "lucide-react";

// Default Theme Fallback
const defaultTheme = {
  bgColor: "hsl(var(--background))",
  cardColor: "hsl(var(--card))",
  textColor: "hsl(var(--foreground))",
  btnColor: "hsl(var(--sidebar-primary))",
  borderColor: "hsl(var(--border))",
  borderRadius: "md",
  borderStyle: "thin",
  shadow: "md",
};

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
    "properties" | "design" | "responses" | "analytics"
  >("design");
  const [showAI, setShowAI] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    if (selectedFieldId) setActiveTab("properties");
  }, [selectedFieldId]);

  useEffect(() => {
    if (form) {
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

  const handleSave = async () => {
    if (!canEdit) return alert("Read-only mode");
    setIsSaving(true);
    try {
      const res = await fetch(`http://localhost:8761/api/forms/${id}/content`, {
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
      if (res.ok) alert("Form Saved Successfully!");
      else throw new Error("Save failed");
    } catch (err) {
      alert("Failed to save form.");
    } finally {
      setIsSaving(false);
    }
  };

  const getContainerStyles = () => ({
    backgroundColor: reduxTheme.cardColor || "hsl(var(--card))",
    color: reduxTheme.textColor || "hsl(var(--foreground))",
    borderColor: reduxTheme.borderColor || "hsl(var(--border))",
    borderWidth:
      reduxTheme.borderStyle === "thin"
        ? "1px"
        : reduxTheme.borderStyle === "thick"
        ? "3px"
        : reduxTheme.borderStyle === "double"
        ? "4px"
        : "0px",
    borderStyle: reduxTheme.borderStyle === "double" ? "double" : "solid",
    borderRadius:
      reduxTheme.borderRadius === "none"
        ? "0"
        : reduxTheme.borderRadius === "full"
        ? "24px"
        : `var(--radius-${reduxTheme.borderRadius})`,
    boxShadow:
      reduxTheme.shadow === "none"
        ? "none"
        : reduxTheme.shadow === "sm"
        ? "0 1px 2px 0 rgb(0 0 0 / 0.05)"
        : reduxTheme.shadow === "md"
        ? "0 4px 6px -1px rgb(0 0 0 / 0.1)"
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
      <div className="p-10 flex items-center justify-center min-h-screen bg-background text-muted-foreground">
        Loading...
      </div>
    );

  return (
    <div className="flex h-screen flex-col bg-background overflow-hidden">
      {/* HEADER */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-6 shadow-sm z-20">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -ml-2 text-muted-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>

          <h1 className="text-lg md:text-xl font-bold text-foreground flex items-center font-mono tracking-tighter truncate max-w-[150px] md:max-w-none">
            {form?.name || "Untitled Form"}
            {!canEdit && (
              <span className="hidden md:flex ml-2 text-xs bg-sidebar-primary/20 text-sidebar-primary px-2 py-1 rounded items-center border border-sidebar-primary/30">
                <Lock className="w-3 h-3 mr-1" /> Read Only
              </span>
            )}
          </h1>
        </div>

        {/* Desktop Navigation Tabs */}
        <div className="hidden md:flex items-center space-x-1 bg-secondary/30 p-1 rounded-lg border border-border/30">
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

        {/* Actions Toolbar */}
        <div className="flex items-center gap-2 md:gap-3">
          {canEdit && (
            <div className="hidden lg:flex items-center space-x-4 mr-2 border-r border-border/30 pr-4 h-8">
              <label className="flex items-center text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors">
                <input
                  type="checkbox"
                  checked={settings.collectEmails}
                  onChange={(e) =>
                    dispatch(
                      updateSettings({ collectEmails: e.target.checked })
                    )
                  }
                  className="mr-2 rounded border-input"
                />
                Collect Emails
              </label>
              <label className="flex items-center text-xs font-medium text-muted-foreground cursor-pointer select-none hover:text-foreground transition-colors">
                <input
                  type="checkbox"
                  checked={settings.limitOneResponse}
                  onChange={(e) =>
                    dispatch(
                      updateSettings({ limitOneResponse: e.target.checked })
                    )
                  }
                  className="mr-2 rounded border-input"
                />
                Limit 1
              </label>
            </div>
          )}

          {canEdit && (
            <>
              <button
                onClick={() => setShowAI(true)}
                className="hidden md:flex items-center rounded-lg bg-chart-3/10 px-3 py-2 text-xs md:text-sm font-medium text-chart-3 hover:bg-chart-3/20 border border-chart-3/20 transition-all whitespace-nowrap">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                AI Magic
              </button>
              <button
                onClick={handleSave}
                disabled={!isUnsaved && !isSaving}
                className="flex items-center rounded-lg bg-sidebar-primary px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-sidebar-primary-foreground hover:bg-sidebar-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm whitespace-nowrap">
                <Save className="mr-1.5 h-3.5 w-3.5" />{" "}
                {isSaving ? "Saving" : "Save"}
              </button>
            </>
          )}

          <button
            onClick={() => setShowShare(true)}
            className="flex items-center rounded-lg bg-secondary px-3 md:px-4 py-2 text-xs md:text-sm font-medium text-secondary-foreground hover:bg-secondary/80 border border-border transition-all whitespace-nowrap">
            <Share2 className="mr-1.5 h-3.5 w-3.5" />{" "}
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </header>

      {/* MOBILE NAV DROPDOWN (Visible only on small screens) */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border z-30 p-4 shadow-xl animate-accordion-down">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveTab("design");
                setIsMobileMenuOpen(false);
              }}
              className="text-left px-4 py-3 rounded-lg hover:bg-secondary">
              Editor
            </button>
            {canViewData && (
              <>
                <button
                  onClick={() => {
                    setActiveTab("responses");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-lg hover:bg-secondary">
                  Responses
                </button>
                <button
                  onClick={() => {
                    setActiveTab("analytics");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left px-4 py-3 rounded-lg hover:bg-secondary">
                  Analytics
                </button>
              </>
            )}
            {canEdit && (
              <div className="border-t border-border mt-2 pt-3 px-4 space-y-3">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={settings.collectEmails}
                    onChange={(e) =>
                      dispatch(
                        updateSettings({ collectEmails: e.target.checked })
                      )
                    }
                    className="mr-2"
                  />{" "}
                  Collect Emails
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={settings.limitOneResponse}
                    onChange={(e) =>
                      dispatch(
                        updateSettings({ limitOneResponse: e.target.checked })
                      )
                    }
                    className="mr-2"
                  />{" "}
                  Limit 1 Response
                </label>
                <button
                  onClick={() => setShowAI(true)}
                  className="hidden md:flex items-center rounded-lg bg-secondary px-3 py-2 text-xs md:text-sm font-medium text-foreground hover:bg-foreground hover:text-background border border-border transition-all whitespace-nowrap">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  AI Agent
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden relative">
        {activeTab === "responses" && id && canViewData ? (
          <div className="w-full h-full overflow-y-auto bg-background">
            <ResponsesPanel formId={id as string} />
          </div>
        ) : activeTab === "analytics" && id && canViewData ? (
          <div className="w-full h-full overflow-y-auto bg-background">
            <AnalyticsPanel formId={id as string} />
          </div>
        ) : (
          /* BUILDER LAYOUT */
          <>
            {/* LEFT TOOLBOX (Hidden on Mobile, Visible on Desktop) */}
            {canEdit && (
              <div className="hidden lg:flex w-64 flex-col border-r border-border bg-background p-4 overflow-y-auto shrink-0">
                <h3 className="font-semibold text-muted-foreground uppercase text-xs mb-4 tracking-widest pl-1">
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
            )}

            {/* CENTER CANVAS */}
            <div
              className="flex-1 overflow-y-auto bg-secondary/10 p-4 md:p-8 lg:p-12 transition-colors duration-300 relative"
              style={{
                backgroundColor: reduxTheme.bgColor || "hsl(var(--background))",
              }}
              onClick={() => {
                if (canEdit) {
                  dispatch(selectField(null));
                  setActiveTab("design");
                }
              }}>
              <div
                className="mx-auto w-full max-w-2xl min-h-[400px] md:min-h-[600px] p-6 md:p-10 transition-all duration-300 relative border shadow-sm"
                style={{
                  ...getContainerStyles(),
                  borderRadius: radiusMap[reduxTheme.borderRadius],
                }}
                onClick={(e) => e.stopPropagation()}>
                <div className="space-y-6">
                  {/* Form Title */}
                  <h1
                    className="text-2xl md:text-3xl font-bold border-b pb-4 mb-6 tracking-tighter break-words"
                    style={{
                      borderColor:
                        (reduxTheme.textColor || "hsl(var(--foreground))") +
                        "33",
                      color: reduxTheme.textColor || "hsl(var(--foreground))",
                    }}>
                    {form?.name || "Untitled Form"}
                  </h1>

                  {/* Email Warning */}
                  {settings.collectEmails && (
                    <div className="border-b pb-6 mb-6 border-dashed border-border/50">
                      <div className="rounded-lg border border-border bg-secondary/20 p-4">
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Email Address{" "}
                          <span className="text-destructive">*</span>
                        </label>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Mail className="w-4 h-4 mr-2" />
                          <span>Valid email required</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {fields.length === 0 ? (
                    <div className="text-center py-16 md:py-24 opacity-50 border-2 border-dashed border-border rounded-lg bg-background/50">
                      <p className="text-foreground font-medium">
                        Your form is empty.
                      </p>
                      {canEdit && (
                        <p className="text-sm text-muted-foreground mt-2">
                          Select tools from the sidebar to add fields.
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Fields Loop */
                    fields.map((field: any) => (
                      <div
                        key={field.id}
                        onClick={(e) => {
                          if (canEdit) {
                            e.stopPropagation();
                            dispatch(selectField(field.id));
                          }
                        }}
                        className={`group relative rounded-lg border p-4 md:p-5 transition-all ${
                          canEdit ? "cursor-pointer" : ""
                        } ${
                          selectedFieldId === field.id && canEdit
                            ? "border-sidebar-primary ring-1 ring-sidebar-primary bg-sidebar-primary/5"
                            : "border-transparent hover:border-border hover:bg-secondary/30"
                        }`}>
                        {/* Delete Button (Desktop Hover / Mobile Always Visible if Selected) */}
                        {canEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              dispatch(removeField(field.id));
                            }}
                            className={`absolute top-2 right-2 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-all ${
                              selectedFieldId === field.id
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            }`}>
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}

                        <label
                          className="block text-sm font-medium mb-2 pointer-events-none break-words"
                          style={{
                            color:
                              reduxTheme.textColor || "hsl(var(--foreground))",
                          }}>
                          {field.label}{" "}
                          {field.required && (
                            <span className="text-destructive">*</span>
                          )}
                        </label>

                        <div className="pointer-events-none opacity-90">
                          {field.type === "textarea" ? (
                            <textarea
                              className="w-full rounded-lg border border-border p-3 h-24 bg-background/50 text-foreground resize-none"
                              disabled
                            />
                          ) : field.type === "select" ? (
                            <select
                              className="w-full rounded-lg border border-border p-2.5 bg-background/50 text-foreground"
                              disabled>
                              <option>Select Option...</option>
                            </select>
                          ) : (
                            <input
                              type="text"
                              className="w-full rounded-lg border border-border p-2.5 bg-background/50 text-foreground"
                              disabled
                            />
                          )}
                        </div>
                      </div>
                    ))
                  )}

                  {/* Submit Button Preview */}
                  {fields.length > 0 && (
                    <div
                      className="pt-6 border-t mt-8"
                      style={{ borderColor: reduxTheme.borderColor }}>
                      <button
                        className="w-full md:w-auto px-8 py-3 text-sidebar-primary-foreground font-medium rounded-lg transition-all shadow-sm hover:opacity-90"
                        style={{
                          backgroundColor: reduxTheme.btnColor,
                          borderRadius: radiusMap[reduxTheme.borderRadius],
                        }}>
                        Submit Application
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT SIDEBAR (Desktop Only - Tabs for Properties/Design) */}
            {canEdit && (
              <div className="hidden lg:flex w-80 border-l border-border bg-background flex-col h-full shadow-lg z-10 shrink-0">
                <div className="flex border-b border-border bg-secondary/10">
                  <button
                    onClick={() => setActiveTab("properties")}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                      activeTab === "properties"
                        ? "text-sidebar-primary border-b-2 border-sidebar-primary bg-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
                    }`}>
                    <Settings className="w-4 h-4" /> Fields
                  </button>
                  <button
                    onClick={() => setActiveTab("design")}
                    className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                      activeTab === "design"
                        ? "text-sidebar-primary border-b-2 border-sidebar-primary bg-background"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
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
            )}
          </>
        )}
      </div>

      {showAI && <AiGeneratorModal onClose={() => setShowAI(false)} />}
      {showShare && (
        <ShareModal formId={id as string} onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Helper Components for Cleaner Code
// ----------------------------------------------------------------------

function ToolboxBtn({ icon: Icon, label, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center px-4 py-3 text-sm font-medium text-foreground bg-card hover:bg-secondary/50 border border-border/60 hover:border-sidebar-primary/40 rounded-lg hover:text-sidebar-primary transition-all shadow-sm group">
      <Icon className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-sidebar-primary transition-colors" />
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
      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
        active
          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-background/50"
      }`}>
      {label}
    </button>
  );
}
