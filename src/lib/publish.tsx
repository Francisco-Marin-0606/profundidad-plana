import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { api } from "./api";

interface PublishContextValue {
  isDirty: boolean;
  markDirty: () => void;
  publish: () => Promise<void>;
  publishing: boolean;
}

const PublishContext = createContext<PublishContextValue>({
  isDirty: false,
  markDirty: () => {},
  publish: async () => {},
  publishing: false,
});

export function PublishProvider({ children }: { children: ReactNode }) {
  const [isDirty, setIsDirty] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const markDirty = useCallback(() => setIsDirty(true), []);

  const publish = useCallback(async () => {
    setPublishing(true);
    try {
      await api.post("/api/admin/publish", {});
      setIsDirty(false);
    } finally {
      setPublishing(false);
    }
  }, []);

  return (
    <PublishContext.Provider value={{ isDirty, markDirty, publish, publishing }}>
      {children}
    </PublishContext.Provider>
  );
}

export function usePublish() {
  return useContext(PublishContext);
}
