import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useEffect } from "react";

const formSchema = z.object({
    searchQuery: z.string({
        required_error:"Nombre del restaurante es requerido"
    }),
});

export type SearchForm = z.infer<typeof formSchema>
type Props = {
    onSubmit: (formData: SearchForm) => void;
    placeHolder: string;
    onReset?: ()=>void;
    searchQuery?: string
}
export default function SearchBar({ onSubmit, onReset, placeHolder, searchQuery}: Props) {
    const form = useForm<SearchForm>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            searchQuery: ""
        }
    })

    useEffect(() => {
        form.reset({searchQuery})
    }, [form, searchQuery])

    const handleReset = () => {
        form.reset({
            searchQuery: ""
        });

        if (onReset) {
            onReset();
        }
    }//Fin de handleReset
    
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}
                className={
                `flex items-center flex-1 gap-3 justify-between flex-row
                 border-2 rounded-full p-3
                 ${form.formState.errors.searchQuery && "border-red-500"}
                 `
                }
            >
                <Search 
                    strokeWidth={2.5}
                    size={30}
                    className="ml-1 text-orange-500 hidden md:block"
                />
                <FormField 
                    control={form.control}
                    name="searchQuery"
                    render={({field}) => (
                        <FormItem className="flex-1">
                            <FormControl>
                                <Input
                                    {...field}
                                    className="border-none shadow-none text-x1 focus-visible:ring-0"
                                    placeholder={placeHolder}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button onClick={handleReset}
                        type="button"
                        variant="outline"
                        className="rounded-full"
                >
                    Limpiar
                </Button>

                <Button
                    type="submit"
                    className="rounded-full bg-orange-500"
                >
                    Buscar
                </Button>    
            </form>
        </Form>
  )
}
