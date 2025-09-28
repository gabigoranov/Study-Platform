import { useTheme } from "@/hooks/useThemeProvider";
import { CSSProperties, useState } from "react";
import { BarLoader, CircleLoader, ClipLoader, DotLoader } from "react-spinners";

const override: CSSProperties = {
  margin: "0 auto",
};

type LoadingProps = {
    isLoading: boolean,
    label?: string | null
}

export default function Loading({isLoading, label} : LoadingProps) {
  const { theme } = useTheme()
  let [color, setColor] = useState(theme == 'light' ? '#0a0a0a' : '#fafafa');

  return (
    <div className="w-full h-full flex flex-col gap-12 items-center justify-center">
      <DotLoader
        color={color}
        loading={isLoading}
        cssOverride={override}
        size={100}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <span className="ml-2 text-gray-500">{label}</span>
    </div>
  );
}
