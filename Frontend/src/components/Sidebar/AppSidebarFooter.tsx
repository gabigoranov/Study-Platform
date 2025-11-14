import LanguageToggle from "../Common/LanguageToggle"
import { ThemeToggle } from "../Common/ThemeToggle"
import { SidebarFooter } from "../ui/sidebar"

export default function AppSidebarFooter() {
    return (
        <SidebarFooter className="flex flex-row gap-2">
            <LanguageToggle />
            <ThemeToggle />
        </SidebarFooter>
    )
}