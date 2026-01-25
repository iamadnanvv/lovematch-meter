import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface SupportersState {
  count: number;
  loading: boolean;
  thanked: boolean;
}

export function useSupporters() {
  const [state, setState] = useState<SupportersState>({
    count: 0,
    loading: true,
    thanked: false,
  });

  // Fetch current count on mount
  useEffect(() => {
    async function fetchCount() {
      try {
        const { data, error } = await supabase.functions.invoke("supporters", {
          method: "GET",
        });
        if (!error && typeof data?.count === "number") {
          setState((s) => ({ ...s, count: data.count, loading: false }));
        } else {
          setState((s) => ({ ...s, loading: false }));
        }
      } catch {
        setState((s) => ({ ...s, loading: false }));
      }
    }
    fetchCount();
  }, []);

  // Record supporter event
  const recordSupporter = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke("supporters", {
        method: "POST",
      });
      if (!error && data) {
        setState((s) => ({
          ...s,
          count: data.count ?? s.count,
          thanked: data.thanked ?? false,
        }));
        return data.thanked as boolean;
      }
    } catch {
      /* ignore */
    }
    return false;
  }, []);

  return { ...state, recordSupporter };
}
