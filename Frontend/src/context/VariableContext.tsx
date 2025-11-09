import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type VariableState = {
  selectedSubjectId: string | null;
  setSelectedSubjectId: (id: string | null) => void;

  selectedGroupId: string | null;
  setSelectedGroupId: (id: string | null) => void;

  selectedFlashcardId: string | null;
  setSelectedFlashcardId: (id: string | null) => void;

  selectedMindmapId: string | null;
  setSelectedMindmapId: (id: string | null) => void;
};

const VariableContext = createContext<VariableState | undefined>(undefined);

// helper hook for persistence
function usePersistedState<T>(key: string, defaultValue: T) {
  const [state, setState] = useState<T>(() => {
    const saved = localStorage.getItem(key);
    return saved ? (JSON.parse(saved) as T) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState] as const;
}

export const VariableProvider = ({ children }: { children: ReactNode }) => {
  const [selectedSubjectId, setSelectedSubjectId] = usePersistedState<
    string | null
  >("selectedSubjectId", null);
  const [selectedGroupId, setSelectedGroupId] = usePersistedState<
    string | null
  >("selectedGroupId", null);
  const [selectedFlashcardId, setSelectedFlashcardId] = usePersistedState<
    string | null
  >("selectedFlashcardId", null);
  const [selectedMindmapId, setSelectedMindmapId] = usePersistedState<
    string | null
  >("selectedMindmapId", null);

  return (
    <VariableContext.Provider
      value={{
        selectedSubjectId,
        setSelectedSubjectId,
        selectedGroupId,
        setSelectedGroupId,
        selectedFlashcardId,
        setSelectedFlashcardId,
        selectedMindmapId,
        setSelectedMindmapId,
      }}
    >
      {children}
    </VariableContext.Provider>
  );
};

export const useVariableContext = () => {
  const ctx = useContext(VariableContext);
  if (!ctx)
    throw new Error("useVariableContext must be inside VariableProvider");
  return ctx;
};
