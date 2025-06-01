import { useAuth0 } from "@auth0/auth0-react"
import { ArrowRightFromLine, CircleUserRound } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, 
  DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu"
import { Link } from "react-router-dom"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"

export default function UserNameMenu() {
  const {user, logout} = useAuth0();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger 
              className="flex items-center px-3 font-bold hover:text-orange-500 gap-2">
        <CircleUserRound 
              className="text-orange-500"/>
        {user?.email}
      </DropdownMenuTrigger>
      <DropdownMenuContent>

       <DropdownMenuItem>
           <Link to="/manage-restaurant"
               className="font-bold hover:text-orange-500" 
            >Administar Restaurante</Link>   
       </DropdownMenuItem>

        <DropdownMenuItem>
            <Link to="/user-profile" 
                className="font-bold hover:text-orange-500"
            >Perfil</Link>
        </DropdownMenuItem>
        
        <Separator></Separator>
        <DropdownMenuItem>
          <Button className="flex flex-1 font-bold bg-orange-500"
          onClick = { ()=>logout()}
          ><ArrowRightFromLine/>Salir</Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
