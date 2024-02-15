import React /* { useState, useEffect } */ from "react";
/* import { toast } from "react-toastify"; */
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"

const StandardVigenerePage: React.FC = () => {

    return (
        <div className="relative h-screen w-full overflow-y-auto overflow-x-hidden md:px-7 px-6">
            {/* Title section */}
            <div className="z-200 relative">
                <h1 className="text-3xl font-bold mb-1">Standard Vigènere Cipher</h1>
                <h3 className="text-lg mb-5">Polyalpabetic substitution cipher based on vigènere square</h3>
            </div>
            
            {/* Encryption and Decription Section */}
            <div className="w-full mt-6 mb-8">
                <Tabs defaultValue="text" className="w-full mb-10">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="text">
                            Plain Text
                        </TabsTrigger>
                        <TabsTrigger value="file">
                            File Upload
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="text">
                        ini text
                    </TabsContent>
                    <TabsContent value="file">
                        ini file
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default StandardVigenerePage;
