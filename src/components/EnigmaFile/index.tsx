import React, { useState, useRef } from 'react';
import { Loader2, Download } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl, FormDescription } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileProcessor, TextProcessor } from '@/utils';
import { toast } from "react-toastify";
import UploadImage from "@/assets/images/upload.png";
import { EnigmaRequest, EnigmaResponse } from '@/types';
import CipherApi from '@/api';

const FormSchema = z.object({
    input: z.any(),
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

const AffineFile: React.FC = () => {
    const [onUpdate, setOnUpdate] = useState<boolean>(false);
    const [result, setResult] = useState("");
    const [messageData, setMessageData] = useState<string>("");
    const [fileType, setFileType] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");

    const textRefFileInput = useRef<HTMLParagraphElement>(null);
    const infoRefFileInput = useRef<HTMLParagraphElement>(null);

    const showFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
    
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (e.target) {
                    const res = e.target.result as string;
                    setMessageData(res); // Update messageData with file content
                    setFileType(file.type);
                    setFileName(file.name);
                }
            };
            reader.readAsText(file);
    
            if (textRefFileInput.current) {
                textRefFileInput.current.textContent = 'File uploaded successfully!';
            }
            if (infoRefFileInput.current) {
                infoRefFileInput.current.textContent = `${file.name}`;
            }
        } else {
            setMessageData(""); // Reset messageData if no file is selected
        }
    };    

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
            const payload: EnigmaRequest = {
                input: TextProcessor.cleanFormat(messageData),
                order1: data.order1,
                order2: data.order2,
                order3: data.order3,
                pos1: data.init1,
                pos2: data.init2,
                pos3: data.init3,
                plugboard: data.plugboard
            };
            setOnUpdate(true);
    
            const submitResponse: EnigmaResponse = await CipherApi.enigmaCipher(payload);
            if (submitResponse.success) {
                setResult(TextProcessor.cleanFormat(submitResponse.output));
            } else {
                toast.error(submitResponse.output);
            }
        } catch (error) {
            toast.error((error as any)?.message || 'Server is unreachable. Please try again later.');
        } finally {
            setOnUpdate(false);
        }
    }

    const handleDownload = () => {
        if (fileType !== "") {
            const blob = new Blob([result], { type: fileType });
            const file = new File([blob], fileName, { type: fileType });
      
            FileProcessor.downloadFile(file, fileName);
        } else {
            if (!FileProcessor.download(result, "Affine-result.txt")) {
                alert("Download failed");
            }
        }
    }

    return (
        <div className='flex flex-col'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 mt-5">
                    <FormField
                        control={form.control}
                        name="input"
                        render={() => (
                            <FormItem>
                                <h1 className="text-xl font-bold mb-1">Input File</h1>
                                <FormLabel className="text-xl font-bold mb-1">
                                    <div className="border-2 border-dashed border-white-3 rounded-lg p-4 py-2.5 w-full items-center cursor-pointer bg-primaryYellow hover:bg-secondaryYellow duration-200 flex flex-col">
                                        <div className='w-1/5 flex items-center justify-center'>
                                            <img
                                                src={UploadImage}
                                                className="block h-20"
                                                alt=""
                                            />
                                        </div>
                                        <div className='w-4/5'>
                                            <p className="text-base font-bold text-center" ref={textRefFileInput}>
                                                Please upload your input file here...
                                            </p>
                                            <p className="text-sm font-normal text-center mt-1" ref={infoRefFileInput}>
                                                You haven't uploaded any files, yet!
                                            </p>
                                        </div>
                                    </div>
                                </FormLabel>
                                <FormControl>
                                    <Input type="file" accept=".txt" onChange={showFile} className="hidden"/>
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
            <div className="space-y-2 mt-10">
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
  
export default AffineFile;