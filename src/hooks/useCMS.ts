import { useState, useCallback } from "react";
import { CMSContent, defaultCMS } from "@/types/cms";

const STORAGE_KEY = "podcast_cms_content";

// Current schema version — bump when adding new fields to force a re-merge
const CMS_SCHEMA_VERSION = 2;

/**
 * Deep-merge saved CMS data with defaults so that:
 * 1. Every key in defaultCMS is present (new fields get their defaults).
 * 2. User-customised values are never overwritten.
 * 3. When schema version changes, any *new* default values (like sectionOrder)
 *    are adopted only when the user hasn't explicitly set them.
 */
function mergeSaved(saved: Record<string, any>): CMSContent {
  const merged: Record<string, any> = {};

  for (const key of Object.keys(defaultCMS) as (keyof CMSContent)[]) {
    const savedVal = saved[key];
    const defaultVal = (defaultCMS as Record<string, any>)[key];

    if (savedVal === undefined || savedVal === null) {
      // Field missing from saved data → use default
      merged[key] = defaultVal;
    } else {
      merged[key] = savedVal;
    }
  }

  // Persist the current schema version so future changes are detected
  merged._schemaVersion = CMS_SCHEMA_VERSION;

  return merged as CMSContent;
}

export function useCMS() {
  const [content, setContent] = useState<CMSContent>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultCMS;

      const saved = JSON.parse(raw);
      const savedVersion = saved._schemaVersion || 0;

      if (savedVersion < CMS_SCHEMA_VERSION) {
        // Schema upgraded — re-merge so new defaults apply for missing keys
        const merged = mergeSaved(saved);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }

      return mergeSaved(saved);
    } catch {
      return defaultCMS;
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const update = useCallback((key: keyof CMSContent, value: any) => {
    setContent(prev => {
      const next = { ...prev, [key]: value, _schemaVersion: CMS_SCHEMA_VERSION } as any;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateMany = useCallback((updates: Partial<CMSContent>) => {
    setContent(prev => {
      const next = { ...prev, ...updates, _schemaVersion: CMS_SCHEMA_VERSION } as any;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setContent(defaultCMS);
  }, []);

  return { content, update, updateMany, reset, isEditing, setIsEditing };
}
