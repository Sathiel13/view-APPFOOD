import { useUpdateUser, useUser } from "@/api/UserApi";
import UserProfileForm from "@/forms/user-profile-form/UserProfileForm";

export default function UserProfilePage(){
    const { getUser, isLoading: isGetLoading } = useUser();
    const { updateUser, isLoading: isUpdateLoading } = useUpdateUser();

    if (isGetLoading){
        return <span>Loading...</span>
    }

    if (!getUser){
        return <span>No se puedieron obtener los datos del perfil del usuario</span>
    }
    return <UserProfileForm
        getUser={getUser}
        onSave={updateUser}
        isLoading={isUpdateLoading}
    />;
}
