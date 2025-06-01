import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Dot } from "lucide-react";

type RestaurantInfoProps = {
    restauranteName: string;
    city: string;
    country: string;
    cuisines: string[];
};

const RestaurantInfo = ({ restauranteName, city, country, cuisines }: RestaurantInfoProps) => {
    return (
        <Card className="max-w-md mx-auto">
            {/* Header del Card con el nombre del restaurante */}
            <CardHeader>
                <CardTitle className="text-xl font-bold">{restauranteName}</CardTitle>
                {/* Descripción con la ciudad y país */}
                <CardDescription className="text-gray-600">
                    {city}, {country}
                </CardDescription>
            </CardHeader>

            {/* Contenido del Card para mostrar las cocinas */}
            <CardContent>
                <p className="text-gray-700 font-semibold mb-2">Cocinas:</p>
                <div className="flex flex-wrap gap-1 items-center">
                    {cuisines.map((cuisine, index) => (
                        <div className="flex items-center" key={index}>
                            <span>{cuisine}</span>
                            {/* Agrega un punto separador entre las cocinas excepto en la última */}
                            {index < cuisines.length - 1 && <Dot className="mx-1 text-gray-500" />}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default RestaurantInfo;