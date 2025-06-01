import { SearchState } from "@/Pages/SearchPage";
import { Restaurant, RestauranteSearchResponse } from "@/types";
import { useAuth0 } from "@auth0/auth0-react";
import { useMutation, useQuery } from "react-query";
import { toast } from "sonner";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Hook para obtener un restaurante por su ID
export const useGetRestaurantById = (id: string) => {
    const { getAccessTokenSilently } = useAuth0();

    const getRestaurantByIdRequest = async (): Promise<Restaurant> => {
        if (!id) {
            throw new Error("ID de restaurante no proporcionado");
        }

        console.log("Solicitando restaurante con ID:", id);

        // Obtenemos el token de acceso
        const accessToken = await getAccessTokenSilently();
        console.log("Solicitando restaurante con ID:", id);
        // Hacemos la solicitud al backend
        const response = await fetch(`${API_BASE_URL}/api/restaurante/${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        // Validamos la respuesta
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error("Restaurante no encontrado");
            }
            throw new Error("Error al obtener el restaurante");
        }

        // Parseamos la respuesta JSON
        return response.json();
    };

    // Utilizamos `useQuery` para manejar la petición
    const { data: restaurant, isLoading, isError, error } = useQuery(
        ["getRestaurantById", id],
        getRestaurantByIdRequest,
        {
            enabled: !!id, // Solo ejecuta la consulta si se proporciona ID
        }
    );

    // Manejo de errores con notificaciones
    if (isError && error instanceof Error) {
        toast.error(error.message);
    }

    return { restaurant, isLoading };
};




//Hook para obtener los datos de un restaurante del backend
export const useGetRestaurant = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getRestaurantRequest = async (): Promise<Restaurant> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(API_BASE_URL + '/api/restaurante', {
            method: 'GET',
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
        });

        if (!response.ok) {
            throw new Error("Error al obtener los datos del restaurante")
        }

        return response.json();

    }//Fin de getRestaurantRequest

    const { data: restaurant, isLoading } = useQuery(
        "getRestaurant",
        getRestaurantRequest
    )

    return {
        restaurant,
        isLoading
    }

}//Fin de useGetRestaurant

export const useCreateRestaurant = () => {
    const { getAccessTokenSilently } = useAuth0();

    const createRestaurantRequest = async (restaurantFormData: FormData):Promise<Restaurant> => {
        const accessToken = await getAccessTokenSilently();

        const res = await fetch(API_BASE_URL + "/api/restaurante", {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
            body: restaurantFormData
        });

        if (!res.ok) {
            throw new Error("Error al crear el Restaurante")
        }

        return res.json();
    }//Fin de createRestaurantRequest

    const {
        mutate: createRestaurant,
        isLoading,
        isSuccess,
        isError
    } = useMutation(createRestaurantRequest);

    if (isSuccess) {
        toast.success("Restaurante creado correctamente")
    }

    if (isError) {
        toast.error("Error al crear el restaurante")
    }

    return { createRestaurant, isLoading };

}//Fin de useCreateRestaurant

//Hook para actualizar un Restaurante
export const useUpdateRestaurant = () => {
    const { getAccessTokenSilently } = useAuth0();

    const updateRestaurantRequest = async (restaurantFormData: FormData): Promise<Restaurant> => {
        const accessToken = await getAccessTokenSilently();
        const response = await fetch(API_BASE_URL + '/api/restaurante', {
            method: "PUT",
            headers: {
                Authorization: 'Bearer ' + accessToken,
            },
            body: restaurantFormData,
        });

        if (!response.ok) {
            throw new Error("Error al actualizar el restaurante")
        }

        return response.json();
    }//Fin de updateRestaurantRequest

    const {
        mutate: updateRestaurant,
        isLoading,
        isSuccess,
        isError
    } = useMutation(updateRestaurantRequest);

    if (isSuccess) {
        toast.success("Restaurante actualizado correctamente")
    }

    if (isError) {
        toast.error("Error al actualizar el restaurante")
    }

    return { updateRestaurant, isLoading };
}//Fin de useUpdateRestaurant

export const useSearchRestaurants = (searchState:SearchState, city?: string) => {
    const createSearchRequest = async (): Promise<RestauranteSearchResponse> => {
        const params = new URLSearchParams();
        params.set("searchQuery", searchState.searchQuery);
        params.set("page", searchState.page.toString());
        params.set("selectedCuisines", searchState.selectedCuisines.join(",") );
        params.set("sortOptions", searchState.sortOptions)

        const url = API_BASE_URL 
                  + '/api/restaurante/search/' 
                  + city
                  + '?'
                  + params.toString();

        console.log(url);          

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("Error al actualizar el Restaurante")
        }

        return response.json();
    }//Fin de createSearchRequest

    const {
        data: results,
        isLoading
    } = useQuery(
        ["searchRestaurants", searchState],
        createSearchRequest,
        { enabled: !!city }
    );

    return { results, isLoading };

}//Fin de useSearchRestaurants