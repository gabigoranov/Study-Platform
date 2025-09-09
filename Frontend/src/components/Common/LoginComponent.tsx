import { useTranslation } from "react-i18next";
import { useAuth } from "../../hooks/useAuth";
import ProfileIcon, { ProfileIconProps } from "../Dashboard/ProfileIcon";
import { keys } from "../../types/keys";

type LoginComponentProps = {
    iconProps: ProfileIconProps;
}

export default function LoginComponent({ iconProps }: LoginComponentProps) {
    const { user } = useAuth();
    const { t } = useTranslation();

    return (
        user ? (
            <ProfileIcon {...iconProps} />
        ) : (
            <div className="flex gap-2 items-center">
                <a href="/signin"className="text-lg text-text-muted hover:text-text hover:cursor-pointer">{t(keys.signInButton)}</a>
            </div>
        )
    );
}
