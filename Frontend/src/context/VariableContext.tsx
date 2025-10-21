import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type VariableState = {
  selectedSubjectId: number | null;
  setSelectedSubjectId: (id: number | null) => void;

  selectedGroupId: number | null;
  setSelectedGroupId: (id: number | null) => void;

  selectedFlashcardId: number | null;
  setSelectedFlashcardId: (id: number | null) => void;

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
    number | null
  >("selectedSubjectId", null);
  const [selectedGroupId, setSelectedGroupId] = usePersistedState<
    number | null
  >("selectedGroupId", null);
  const [selectedFlashcardId, setSelectedFlashcardId] = usePersistedState<
    number | null
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
