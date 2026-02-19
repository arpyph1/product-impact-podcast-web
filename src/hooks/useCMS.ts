import { useState, useCallback, useEffect, useRef } from "react";
import { CMSContent, defaultCMS } from "@/types/cms";
import { supabase } from "@/integrations/supabase/client";

/**
 * Deep-merge saved CMS data with defaults so every key in defaultCMS is present.
 * Never overwrites a default with an empty string — preserves defaults if saved value is blank.
 */
function mergeSaved(saved: Record<string, any>): CMSContent {
  const merged: Record<string, any> = {};
  for (const key of Object.keys(defaultCMS) as (keyof CMSContent)[]) {
    const savedVal = saved[key];
    const defaultVal = (defaultCMS as Record<string, any>)[key];
    // If saved is undefined/null, use default
    if (savedVal === undefined || savedVal === null) {
      merged[key] = defaultVal;
    }
    // If saved is an empty string but default has a real value, keep default
    else if (savedVal === "" && typeof defaultVal === "string" && defaultVal !== "") {
      merged[key] = defaultVal;
    }
    else {
      merged[key] = savedVal;
    }
  }
  return merged as CMSContent;
}

export function useCMS() {
  const [content, setContent] = useState<CMSContent>(defaultCMS);
  const [isEditing, setIsEditing] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load CMS data from database on mount
  useEffect(() => {
    supabase.functions
      .invoke("cms", { method: "GET" })
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to load CMS:", error);
          setLoaded(true);
          return;
        }
        if (data?.data && typeof data.data === "object" && Object.keys(data.data).length > 0) {
          setContent(mergeSaved(data.data));
        }
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  // Debounced save to database
  const persistToDb = useCallback((newContent: CMSContent) => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      supabase.functions
        .invoke("cms", { method: "POST", body: { data: newContent } })
        .catch(err => console.error("Failed to save CMS:", err));
    }, 1000);
  }, []);

  const update = useCallback((key: keyof CMSContent, value: any) => {
    setContent(prev => {
      const next = { ...prev, [key]: value };
      persistToDb(next);
      return next;
    });
  }, [persistToDb]);

  const updateMany = useCallback((updates: Partial<CMSContent>) => {
    setContent(prev => {
      const next = { ...prev, ...updates };
      persistToDb(next);
      return next;
    });
  }, [persistToDb]);

  const reset = useCallback(() => {
    setContent(defaultCMS);
    persistToDb(defaultCMS);
  }, [persistToDb]);

  return { content, update, updateMany, reset, isEditing, setIsEditing, loaded };
}
