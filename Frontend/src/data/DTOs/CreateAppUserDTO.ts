import { AppUserType } from "@/types/appUserType"

export type CreateAppUserDTO = {
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string,
    discriminator: AppUserType
    organizationCode?: string
}