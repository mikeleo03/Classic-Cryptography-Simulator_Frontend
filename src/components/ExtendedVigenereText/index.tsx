import React, { useState } from 'react';
import { Loader2, Download } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FileProcessor, TextProcessor } from '@/utils';
import { toast } from "react-toastify";
import { ExtendedVigenereRequest, ExtendedVigenereResponse } from '@/types';
import CipherApi from '@/api';

const FormSchema = z.object({
    input: z.string().min(1, {
        message: "Plain text is required and cannot be empty.",
    }),
    key: z.string().min(1, {
        message: "Key is required and cannot be empty.",
    }),
    encrypt: z.boolean().default(true).optional(),
});

const ExtendedVigenereText: React.FC = () => {
    const [onUpdate, setOnUpdate] = useState<boolean>(false);
    const [result, setResult] = useState<string>("");

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            input: "",
            key: "",
            encrypt: true,
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const payload: ExtendedVigenereRequest = {
                input: Object.values(TextProcessor.toUint8Array(data.input)),
                key: Object.values(TextProcessor.toUint8Array(data.key)),
                encrypt: data.encrypt as boolean
            };
            setOnUpdate(true);
            console.log(JSON.stringify(payload));
    
            const submitResponse: ExtendedVigenereResponse = await CipherApi.extendedVigenereCipher(payload);
            console.log(submitResponse);
            if (submitResponse.success) {
                console.log(submitResponse.output);
                setResult(TextProcessor.toStringFromUint8Array(TextProcessor.toUint8FromBase64(submitResponse.output)));
            }
        } catch (error) {
            toast.error((error as any)?.message || 'Server is unreachable. Please try again later.');
        } finally {
            setOnUpdate(false);
        }
    }

    const handleDownload = () => {
        if (!FileProcessor.download(result, "Extended-vigenere-result.txt")) {
            alert("Download failed");
        }
    }

    return (
        <div className='flex flex-col w-full'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 mt-5">
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center'>
                            <h1 className="text-xl font-bold">Input Text</h1>
                        </div>
                        <FormField
                            control={form.control}
                            name="encrypt"
                            render={({ field }) => (
                                <FormItem className="flex text-xl space-y-0 space-x-3 items-center p-0">
                                    <div className="space-y-0.5">
                                        <FormLabel className="text-base"></FormLabel>
                                    </div>
                                    <FormControl>
                                        <>
                                            <span className='text-base font-semibold'>Decrypt  </span>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <span className='text-base font-semibold'>  Encrypt</span>
                                        </>
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name="input"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xl font-bold mb-1"></FormLabel>
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
                    <FormField
                        control={form.control}
                        name="key"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-xl font-bold mb-1">Key</FormLabel>
                                <FormControl>
                                    <Input placeholder="insert the key here" {...field} className="md:text-sm text-base" />
                                </FormControl>
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
                    {result}</div>
                    : 
                    <div>Please fill the encyption/decription form above first</div>
                }
            </div>
        </div>
    );
};
  
export default ExtendedVigenereText;