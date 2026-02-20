import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { UserPlus, Trash2, Shield, Pencil } from "lucide-react";

interface EditorEntry {
  id: string;
  user_id: string;
  role: "admin" | "editor";
  email?: string;
}

export default function EditorManager() {
  const [editors, setEditors] = useState<EditorEntry[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"editor" | "admin">("editor");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    // Fetch roles with profile emails
    const { data: roles } = await supabase
      .from("user_roles")
      .select("id, user_id, role");

    if (!roles) return;

    // Fetch corresponding profiles
    const userIds = roles.map(r => r.user_id);
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, email")
      .in("user_id", userIds);

    const profileMap = new Map((profiles || []).map(p => [p.user_id, p.email]));

    setEditors(roles.map(r => ({
      ...r,
      role: r.role as "admin" | "editor",
      email: profileMap.get(r.user_id) || "Unknown",
    })));
  };

  useEffect(() => { load(); }, []);

  const addEditor = async () => {
    if (!newEmail.trim()) return;
    setAdding(true);
    setError("");

    // Find user by email in profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", newEmail.trim())
      .limit(1)
      .single();

    if (!profile) {
      setError("User not found. They must sign in with Google first.");
      setAdding(false);
      return;
    }

    const { error: insertErr } = await supabase
      .from("user_roles")
      .insert({ user_id: profile.user_id, role: newRole });

    if (insertErr) {
      setError(insertErr.message.includes("duplicate") ? "User already has this role." : insertErr.message);
    } else {
      setNewEmail("");
      load();
    }
    setAdding(false);
  };

  const removeEditor = async (id: string) => {
    await supabase.from("user_roles").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Team Access</p>

      {/* Existing editors */}
      <div className="space-y-2">
        {editors.map(e => (
          <div key={e.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-muted border border-border">
            <div className="flex items-center gap-2 min-w-0">
              {e.role === "admin" ? (
                <Shield className="w-3.5 h-3.5 text-primary shrink-0" />
              ) : (
                <Pencil className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              )}
              <span className="text-sm text-foreground truncate">{e.email}</span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{e.role}</span>
            </div>
            <button
              onClick={() => removeEditor(e.id)}
              className="p-1 text-muted-foreground hover:text-destructive transition-colors shrink-0"
              title="Remove access"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {editors.length === 0 && (
          <p className="text-xs text-muted-foreground">No editors added yet.</p>
        )}
      </div>

      {/* Add new editor */}
      <div className="space-y-2 pt-2 border-t border-border">
        <p className="text-xs text-muted-foreground">Add a team member (they must sign in with Google first)</p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="email@example.com"
            className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary"
            value={newEmail}
            onChange={e => setNewEmail(e.target.value)}
          />
          <select
            className="bg-muted border border-border rounded-lg px-2 py-2 text-xs text-foreground focus:outline-none"
            value={newRole}
            onChange={e => setNewRole(e.target.value as "editor" | "admin")}
          >
            <option value="editor">Editor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button
          onClick={addEditor}
          disabled={adding || !newEmail.trim()}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-50 transition-all"
        >
          <UserPlus className="w-3.5 h-3.5" />
          {adding ? "Adding…" : "Add Editor"}
        </button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    </div>
  );
}
