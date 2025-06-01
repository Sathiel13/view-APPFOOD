import { Link } from "react-router-dom";

type Props = {
    total: number;
    city: string;
}
export default function SearchResultsInfo({total, city}: Props) {
  return (
    <div className="text-xl font-bold flex flex-col gap-3 justify-between
                    lg:items-center lg:flex-row">
      <span>
          {total} Restaurante(s) encontrado(s) en {city}
          <Link to="/"
              className="ml-2 text-sm font-semibold underline
                         cursor-pointer text-blue-500"
            >Cambiar ubicación</Link>  
      </span>                 
    </div>
  )
}
