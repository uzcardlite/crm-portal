import { useCallback, useEffect, useState } from "react";
import { toast } from "../components/ui/Toast";
import { getErrorMessage } from "../utils/apiError";

// Loads one portal endpoint for the currently selected child.
//
// `loader` MUST be wrapped in useCallback by the caller with the active student
// id in its deps — that is what re-runs the request on child switch. A response
// that arrives after the child changed (or after unmount) is discarded, so a
// slow request can never paint the previous child's data.
export function usePortalResource(loader, enabled = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!enabled) {
      setData(null);
      setLoading(false);
      setError(false);
      return undefined;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    loader()
      .then((result) => {
        if (cancelled) return;
        setData(result);
        setLoading(false);
      })
      .catch((requestError) => {
        if (cancelled) return;
        setData(null);
        setError(true);
        setLoading(false);
        // A screen loads several endpoints at once, so an offline device would
        // otherwise stack one identical toast per request. The shared id makes
        // react-hot-toast replace instead of pile up.
        toast.error(getErrorMessage(requestError), { id: "portal-load-error" });
      });

    return () => {
      cancelled = true;
    };
  }, [loader, enabled, attempt]);

  const reload = useCallback(() => setAttempt((count) => count + 1), []);

  return { data, loading, error, reload };
}
