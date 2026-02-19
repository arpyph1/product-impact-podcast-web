import { useState, useEffect, useCallback } from "react";
import { CMSContent, defaultCMS } from "@/types/cms";

const STORAGE_KEY = "podcast_cms_content";

export function useCMS() {
  const [content, setContent] = useState<CMSContent>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...defaultCMS, ...JSON.parse(saved) } : defaultCMS;
    } catch {
      return defaultCMS;
    }
  });

  const [isEditing, setIsEditing] = useState(false);

  const update = useCallback((key: keyof CMSContent, value: any) => {
    setContent(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const updateMany = useCallback((updates: Partial<CMSContent>) => {
    setContent(prev => {
      const next = { ...prev, ...updates };
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
