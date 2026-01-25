import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

interface QuizSession {
  id: string;
  share_code: string;
  player1_name: string;
  player2_name: string | null;
  selected_categories: string[];
  player1_answers: number[];
  player2_answers: number[] | null;
  status: "waiting" | "completed";
  created_at: string;
  completed_at: string | null;
}

interface CreateSessionParams {
  player1_name: string;
  selected_categories: string[];
  player1_answers: number[];
}

interface JoinSessionParams {
  share_code: string;
  player2_name: string;
  player2_answers: number[];
}

export function useQuizSession() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSession = useCallback(async (params: CreateSessionParams): Promise<QuizSession | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke("quiz-sessions", {
        method: "POST",
        body: params,
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      return data.session as QuizSession;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to create session";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getSession = useCallback(async (shareCode: string): Promise<QuizSession | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(`quiz-sessions/${shareCode}`, {
        method: "GET",
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      return data.session as QuizSession;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Session not found";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const joinSession = useCallback(async (params: JoinSessionParams): Promise<QuizSession | null> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(`quiz-sessions/${params.share_code}`, {
        method: "PATCH",
        body: {
          player2_name: params.player2_name,
          player2_answers: params.player2_answers,
        },
      });

      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);

      return data.session as QuizSession;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to join session";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getShareUrl = useCallback((shareCode: string): string => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/?join=${shareCode}`;
  }, []);

  return {
    loading,
    error,
    createSession,
    getSession,
    joinSession,
    getShareUrl,
  };
}
