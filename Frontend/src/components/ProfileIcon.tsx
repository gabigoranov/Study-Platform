import { useAuth } from "../hooks/useAuth";
import { useTranslation } from "react-i18next";
import { keys } from "../types/keys";

export type ProfileIconProps = {
    imgUrl?: string;
    notifications: number;
}

export default function ProfileIcon({imgUrl, notifications} : ProfileIconProps) {
    const {signOut} = useAuth();
    const { t } = useTranslation();

    return (
        <div className={`relative rounded-full`}>
            <a onClick={signOut}>{t(keys.signOut)}</a>
            <img src={imgUrl ?? 'https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png'} className="w-14 h-14 rounded-full"></img>
            <p className="absolute bottom-[-0.8rem] left-1/2 translate-x-[-50%] text-xs text-white font-bold bg-neutral-500 px-4 py-1 rounded-full">{notifications}</p>
        </div>
    )
}