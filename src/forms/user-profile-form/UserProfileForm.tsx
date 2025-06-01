import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { User } from "@/types";
import { useEffect } from "react";

const formSchema = z.object({
    email: z.string().optional(),
    name: z.string().min(1, "Nombre es requerido"),
    addressLine1: z.string().min(1, "Dirección es requerida"),
    city: z.string().min(1, "Ciudad es requerida"),
    country: z.string().min(1, "País es requerido"),
});

export type UserFormData = z.infer<typeof formSchema>;

type Props = {
    getUser: User
    onSave: (userProfileData: UserFormData) => void;
    isLoading: boolean;
}
export default function UserProfileForm({ onSave, isLoading, getUser }: Props) {
  const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: getUser
  });

  useEffect(() => {
    form.reset(getUser)
  }, [getUser, form]);
  
  return(
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSave)}
              className='space-y-4 bg-gray-50 rounded-lg md:p-10'
        >
            <div>
                <h2 className='text-2xl font-bold'
                >
                    Formulario de perfil del usuario
                </h2>
                <FormDescription>
                    Consulta y cambia la información de tu perfil aquí.
                </FormDescription>
            </div>
            <FormField control={form.control}
                name="email"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input {...field} disabled
                                   className='bg-white'/>
                        </FormControl>
                    </FormItem>
                )}
            />

            <FormField control={form.control}
                name="name"
                render={({field}) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input {...field} 
                                   className='bg-white'/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <div className='flex flex-col md:flex-row gap-4'>
            <FormField control={form.control}
                name="addressLine1"
                render={({field}) => (
                    <FormItem className='flex-1'>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                            <Input {...field} 
                                   className='bg-white'/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField control={form.control}
                name="city"
                render={({field}) => (
                    <FormItem className='flex-1'>
                        <FormLabel>Ciudad</FormLabel>
                        <FormControl>
                            <Input {...field} 
                                   className='bg-white'/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />

            <FormField control={form.control}
                name="country"
                render={({field}) => (
                    <FormItem className='flex-1'>
                        <FormLabel>País</FormLabel>
                        <FormControl>
                            <Input {...field} 
                                   className='bg-white'/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            </div>
            {
                isLoading ? (
                    <LoadingButton />
                ): (
                    <Button type="submit" className="bg-orange-500"
                    >
                        Actualizar
                    </Button>
                )
            }
        </form>
    </Form>
  )
}
