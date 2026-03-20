import { CreateAdminDTO } from "@/data/DTOs/CreateAdminDTO";
import { CreateAppUserDTO } from "@/data/DTOs/CreateAppUserDTO";
import { CreateOrganizationDTO } from "@/data/DTOs/CreateOrganizationDTO";

type UseSignUpType = {
    signUp: (data: CreateAppUserDTO) => void;
    signUpAdmin: (data: CreateAdminDTO) => void;
    signUpOrganization: (organization: CreateOrganizationDTO, admin: CreateAdminDTO) => void;
}

export default function useSignUp(){

}