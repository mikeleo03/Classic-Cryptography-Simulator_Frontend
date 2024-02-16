import React from "react";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import { HillText, HillFile } from "@/components";

const HillPage: React.FC = () => {

    return (
        <div className="relative h-screen w-full overflow-y-auto overflow-x-hidden md:px-7 px-6">
            {/* Title section */}
            <div className="z-200 relative">
                <h1 className="text-3xl font-bold mb-1">Hill Cipher</h1>
                <h3 className="text-lg mb-5">Matrices make messages mysterious as they undergo encryption magic.</h3>
            </div>
            
            {/* Encryption and Decription Section */}
            <div className="w-full mt-6 mb-8">
                <Tabs defaultValue="text" className="w-full mb-10">
                    <TabsList className="grid w-full grid-cols-2 h-full">
                        <TabsTrigger value="text" className="text-base">
                            Plain Text
                        </TabsTrigger>
                        <TabsTrigger value="file" className="text-base">
                            File Upload
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="text" className="w-full">
                        <HillText />
                    </TabsContent>
                    <TabsContent value="file">
                        <HillFile />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default HillPage;
