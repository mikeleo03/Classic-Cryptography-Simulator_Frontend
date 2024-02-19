import React, { useState } from 'react';
import { Loader2, Download } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl, FormDescription } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileProcessor, TextProcessor } from '@/utils';
import { toast } from "react-toastify";

const FormSchema = z.object({
    input: z.string().min(1, {
        message: "Plain text is required and cannot be empty.",
    }),
    order1: z.number().int().min(1).max(3),
    order2: z.number().int().min(1).max(3),
    order3: z.number().int().min(1).max(3),
    init1: z.number().int().min(1).max(26),
    init2: z.number().int().min(1).max(26),
    init3: z.number().int().min(1).max(26),
    plugboard: z.string().refine(value => {
        const pairs = value.split(" ");
        const characters = pairs.join("").split("");
        const uniqueCharacters = new Set(characters);

        // Check if each character is unique
        if (characters.length !== uniqueCharacters.size) return false;

        // Check if each pair has two characters
        if (pairs.some(pair => pair.length !== 2)) return false;

        return true;
    }, {
        message: "Plugboard must contain unique pairs of characters separated by one space."
    })
        .refine(value => {
            // Check if each character appears only once in the plugboard
            const characters = value.split(" ").join("").split("");
            const uniqueCharacters = new Set(characters);
            return characters.length === uniqueCharacters.size;
        }, {
            message: "Each character in the plugboard must appear only once."
        }),
}).refine(data => {
    // Check if order1, order2, and order3 are distinct
    if (data.order1 === data.order2 || data.order1 === data.order3 || data.order2 === data.order3) {
        toast.error("Order values must be distinct.");
    }
    return data;
});


const EnigmaText: React.FC = () => {
    const [onUpdate, setOnUpdate] = useState<boolean>(false);
    const [result, setResult] = useState<string>("");

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            input: "",
            order1: 1,
            order2: 2,
            order3: 3,
            init1: 1,
            init2: 1,
            init3: 1,
            plugboard: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const payload = {
                input: TextProcessor.cleanFormat(data.input),
                order1: data.order1,
                order2: data.order2,
                order3: data.order3,
                init1: data.init1,
                init2: data.init2,
                init3: data.init3,
                plugboard: data.plugboard
            };
            setOnUpdate(true);
            console.log(payload);
    
            /* const submitResponse: SubmitResponse = await TaskApi.submitTasks(id as string, JSON.stringify(payload));
    
            if (submitResponse.status === 'OK') {
                toast.success('Your submission has been successfully submitted!');
            } */
            setResult(TextProcessor.cleanFormat(data.input));
        } catch (error) {
            toast.error((error as any)?.response?.data?.description || 'Server is unreachable. Please try again later.');
        } finally {
            setOnUpdate(false);
        }
    }

    const handleDownload = () => {
        if (!FileProcessor.download(result, "Enigma-result.txt")) {
            alert("Download failed");
        }
    }

    return (
        <div className='flex flex-col w-full'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 mt-5">
                    <FormField
                        control={form.control}
                        name="input"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xl font-bold mb-1">Input Text</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Place your input text here..."
                                        className="resize-none h-36"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex w-full space-x-5">
                        <div className='flex flex-col mr-8 pt-3'>
                            <h1 className='text-xl font-bold'>Rotor 1</h1>
                            <h3 className='text-base'>EKMFLGDQVZNTOWYHXUSPAIBRCJ (Q)</h3>
                        </div>
                        <FormField
                            control={form.control}
                            name="order1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xl font-bold mb-1">Order</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} className="md:text-sm text-base" onChange={e => field.onChange(parseInt(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="init1"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xl font-bold mb-1">Initial Position</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} className="md:text-sm text-base" onChange={e => field.onChange(parseInt(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex w-full space-x-5">
                        <div className='flex flex-col mr-8 pt-3'>
                            <h1 className='text-xl font-bold'>Rotor 2</h1>
                            <h3 className='text-base'>AJDKSIRUXBLHWTMCQGZNPYFVOE (E)</h3>
                        </div>
                        <FormField
                            control={form.control}
                            name="order2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xl font-bold mb-1">Order</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} className="md:text-sm text-base" onChange={e => field.onChange(parseInt(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="init2"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xl font-bold mb-1">Initial Position</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} className="md:text-sm text-base" onChange={e => field.onChange(parseInt(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex w-full space-x-5">
                        <div className='flex flex-col mr-8 pt-3'>
                            <h1 className='text-xl font-bold'>Rotor 3</h1>
                            <h3 className='text-base'>BDFHJLCPRTXVZNYEIWGAKMUSQO (V)</h3>
                        </div>
                        <FormField
                            control={form.control}
                            name="order3"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xl font-bold mb-1">Order</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} className="md:text-sm text-base" onChange={e => field.onChange(parseInt(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="init3"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xl font-bold mb-1">Initial Position</FormLabel>
                                    <FormControl>
                                        <Input type="number" {...field} className="md:text-sm text-base" onChange={e => field.onChange(parseInt(e.target.value))} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="flex items-center w-full space-x-5">
                        <h1 className='text-xl font-bold'>Reflector</h1>
                        <h3 className='text-base px-0'>YRUHQSLDPXNGOKMIEBFZCWVJAT</h3>
                    </div>
                    <FormField
                        control={form.control}
                        name="plugboard"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xl font-bold mb-1">Plugboard</FormLabel>
                                <FormControl>
                                    <Input placeholder="insert the plugboard here" {...field} className="md:text-sm text-base" />
                                </FormControl>
                                <FormDescription>Separate each pair with single space. example : AE BG YQ</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="mt-5 md:text-sm text-base" disabled={onUpdate}>
                        {onUpdate ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing
                            </>
                        ) : (
                            'Process'
                        )}
                    </Button>
                </form>
            </Form>
            <div className="space-y-2 mt-10 w-full">
                <div className="flex items-center justify-between">
                    <div className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xl font-bold mb-1">Result</div>
                    {result && <div className="flex items-center space-x-5">
                        <Button className="md:text-sm text-base flex justify-center space-x-2" onClick={handleDownload}>
                            <Download className="h-4 w-4" /> <span>Download</span>
                        </Button>
                    </div>}
                </div>
                {result ? 
                    <div className="mx-auto h-40 max-w-[70rem] overflow-y-auto break-words rounded-md border bg-background px-3 py-2 ring-offset-background md:text-sm text-base text-wrap">
                    {TextProcessor.toBase64(result)}</div>
                    : 
                    <div>Please fill the encyption/decription form above first</div>
                }
            </div>
        </div>
    );
};
  
export default EnigmaText;