import React, { useState, useRef } from 'react';
import { Loader2, Download } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormMessage, FormControl } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { FileProcessor, TextProcessor } from '@/utils';
import { toast } from "react-toastify";
import UploadImage from "@/assets/images/upload.png";

const FormSchema = z.object({
    input: z.any(),
    key: z.string().min(1, {
        message: "Key is required and cannot be empty.",
    }),
    encrypt: z.boolean().default(true).optional(),
});

const AutoKeyVigenereFile: React.FC = () => {
    const [onUpdate, setOnUpdate] = useState<boolean>(false);
    const [result, setResult] = useState("");
    const [messageData, setMessageData] = useState<string>("");
    const [fileType, setFileType] = useState<string>("");
    const [fileName, setFileName] = useState<string>("");

    const textRefFakultas = useRef<HTMLParagraphElement>(null);
    const infoRefFakultas = useRef<HTMLParagraphElement>(null);

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
    
            if (textRefFakultas.current) {
                textRefFakultas.current.textContent = 'File uploaded successfully!';
            }
            if (infoRefFakultas.current) {
                infoRefFakultas.current.textContent = `${file.name}`;
            }
        } else {
            setMessageData(""); // Reset messageData if no file is selected
        }
    };    

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            input: null as any,
            key: "",
            encrypt: true,
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const payload = {
                input: TextProcessor.cleanFormat(messageData),
                key: data.key,
                encrypt: data.encrypt
            };
            setOnUpdate(true);
            console.log(payload);
    
            /* const submitResponse: SubmitResponse = await TaskApi.submitTasks(id as string, JSON.stringify(payload));
    
            if (submitResponse.status === 'OK') {
                toast.success('Your submission has been successfully submitted!');
            } */
            setResult(TextProcessor.cleanFormat(messageData));
        } catch (error) {
            toast.error((error as any)?.response?.data?.description || 'Server is unreachable. Please try again later.');
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
            if (!FileProcessor.download(result, "cipher-result.txt")) {
                alert("Download failed");
            }
        }
    }

    return (
        <div className='flex flex-col'>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4 mt-5">
                    <div className='flex justify-between items-center'>
                        <div className='flex items-center'>
                            <h1 className="text-xl font-bold">Input File</h1>
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
                        render={() => (
                            <FormItem>
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
                                            <p className="text-base font-bold text-center" ref={textRefFakultas}>
                                                Please upload your input file here...
                                            </p>
                                            <p className="text-sm font-normal text-center mt-1" ref={infoRefFakultas}>
                                                You haven't uploaded any files, yet!
                                            </p>
                                        </div>
                                    </div>
                                </FormLabel>
                                <FormControl>
                                    <Input type="file" onChange={showFile} className="hidden"/>
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
  
export default AutoKeyVigenereFile;