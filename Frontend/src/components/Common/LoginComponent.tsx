import ProfileIcon, { ProfileIconProps } from "../Dashboard/ProfileIcon";

type LoginComponentProps = {
    iconProps: ProfileIconProps;
}

export default function LoginComponent({ iconProps }: LoginComponentProps) {
    return (
      <ProfileIcon {...iconProps} />
    );
}
