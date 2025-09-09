import { ThemeToggle } from "@/components/Common/ThemeToggle";

export default function ThemeSettings() {
    function toggleTheme() {
        document.documentElement.classList.toggle("dark");
    }

    return (
        <ThemeToggle />
    )
}