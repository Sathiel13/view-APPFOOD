import { User } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type CreateUserRequest = {
    auth0Id: string;
    email: string;
}

export const useCreateUser = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createUserRequest = async (user: CreateUserRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(API_BASE_URL + '/api/user', {
            method: "POST",
            headers: {
                Authorization: 'Bearer ' + accessToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            throw new Error ("Error al crear usuario")
        }
    }; //Fin de createUserRequest

    const { mutateAsync: createUser, 
        isLoading, 
        isError, 
        isSuccess 
    } = useMutation(createUserRequest)

    return { 
        createUser, 
        isLoading, 
        isError, 
        isSuccess
    }
}//Fin de useCreateUser 

type UpdateUserRequest = {
    name: string;
    addressLine1: string;
    city: string,
    country: string
}

export const useUpdateUser = () => {
    const { getAccessTokenSilently } = useAuth0();

    const updateUserRequest = async (formData: UpdateUserRequest) => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(API_BASE_URL + '/api/user', {
            method: "PUT",
            headers: {
                Authorization: 'Bearer ' + accessToken,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) {
            throw new Error ("Error al actualizar el perfil del usuario")
        }
    }; //Fin de updateUserRequest

    const { mutateAsync: updateUser, 
        isLoading, 
        isSuccess,
        error,
        reset 
    } = useMutation(updateUserRequest)

    if (isSuccess){
        toast.success("Perfil del usuario actualizado")
    }

    if (error){
        toast.error(error.toString());
        reset();
    }
    return { 
        updateUser, 
        isLoading, 
        isSuccess,
        error,
        reset
    }
}//Fin de useUpdateUser

export const useUser = () => {
    const{ getAccessTokenSilently } = useAuth0();

    const getUserRequest = async (): Promise<User> => {
        const accessToken = await getAccessTokenSilently();
        const res = await fetch(API_BASE_URL + '/api/user', {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + accessToken,
                "Content-Type": "application/json"
            }
        });

        if (!res.ok){
            throw new Error("Error al actualizar el perfil del usuario")
        }//Fin de if

        return res.json();
    }//Fin de getUserRequest

    const {
        data: getUser,
        isLoading,
        error        
    } = useQuery("fetchUser", getUserRequest);

    if (error){
        toast.error(error.toString());
    }

    return {
        getUser,
        isLoading
    }

}//Fin de getUser