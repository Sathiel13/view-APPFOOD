import { Restaurant } from "@/types";
import { AspectRatio } from "@radix-ui/react-aspect-ratio";
import { Link } from "react-router-dom";

type Props = {
    restaurant: Restaurant;
};

export default function SearchResultCard({ restaurant }: Props) {
    return (
        <Link
            to={`/restaurantes/${restaurant._id}`}
            className="grid lg:grid-cols-[2fr_3fr] gap-5 group"
        >

        <AspectRatio ratio={16 / 6}>
                <img src={restaurant.imageUrl}
                     alt={restaurant.restauranteName}
                     className="rounded-md object-cover h-full w-full"
                />
            </AspectRatio>
            <div>
                <h3 className="text-2xl font-bold tracking-tight mb-2
                           group-hover:underline"
                >
                    {restaurant.restauranteName}
                </h3>
                <div id="card-content" className="grid md:grid-cols-2 gap2">
                    <div className="flex flex-row flex-wrap">
                        {
                            restaurant.cuisines.map((item, index) => (
                                <span className="flex" key={index}>
                                    <span>{item}</span>
                                    {
                                        index < restaurant.cuisines.length - 1 && " | "
                                    }
                                </span>
                            ))
                        }
                    </div>
                </div>
            </div>
        </Link>
    );
}