import { useTranslation } from "react-i18next";
import LoginComponent from "../Common/LoginComponent";
import { SidebarTrigger } from "../ui/sidebar";
import { storageService } from "@/services/storageService";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";

export default function Header() {
    const { t } = useTranslation();
    const userId = useAuth().user?.id!;
    const [ profileImage, setProfileImage ] = useState<string | ''>('');

    useEffect(() => {
      if (!userId) return;
    
      const fetchImage = async () => {
        try {
          const url = await storageService.getPublicUrl(`${userId}/avatar`, "avatars");
          setProfileImage(url);
        } catch (err) {
          console.error("Failed to fetch avatar:", err);
        }
      };
    
      fetchImage();
    }, [userId]);

    return (
        <header className="w-full h-15 p-4 flex justify-between items-center">
            <SidebarTrigger size="icon" className="[&_svg]:size-6" />
            <div className="">
                <LoginComponent iconProps={{imgUrl: profileImage}}/>
            </div>
        </header>   
    )
}