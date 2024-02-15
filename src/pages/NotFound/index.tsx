import React from "react";
import { useNavigate } from "react-router-dom";
import { setPage } from "@/utils";

import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        setPage("", navigate);
    };

    return (
        <div className="relative h-screen justify-center flex flex-col items-center w-full overflow-y-auto overflow-x-hidden md:px-7 px-6">
            <h1 className="text-8xl font-bold mb-3">404</h1>
            <h3 className="text-2xl mb-1">Uh oh, looks like you took a wrong turn in the internet maze!</h3>
            <h3 className="text-lg mb-5">Don't worry, we'll help you find your way out. ➡️</h3>
            <Button onClick={handleBack}>Back to Home</Button>
        </div>
    );
};

export default NotFound;
