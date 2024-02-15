import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

// Navbar component
const Navbar: React.FC = () => {
    const [currentDate, setCurrentDate] = useState<string>("");
    const [currentDateShort, setCurrentDateShort] = useState<string>("");

    useEffect(() => {
        const currentDate = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        };
        const formattedDate = new Intl.DateTimeFormat("en-US", options).format(currentDate);
        setCurrentDate(formattedDate);
    }, []);

    useEffect(() => {
        const currentDateShort = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: "short", // Change to short for 3-letter weekday abbreviation
            month: "short", // Change to short for 3-letter month abbreviation
            day: "numeric",
            year: "numeric",
        };
        const formattedDate = new Intl.DateTimeFormat("en-US", options).format(currentDateShort);
        setCurrentDateShort(formattedDate);
    }, []);
    

    return (
        <div className="flex items-center justify-between md:p-5 p-4 md:px-8 px-6 sticky top-0 z-50">
            <div className="flex items-center justify-start md:space-x-10">
                <div className="text-black font-semibold md:block hidden">{currentDate}</div>
                <div className="text-black font-semibold md:hidden block">{currentDateShort}</div>
            </div>

            {/* Right Side Links */}
            <div className="flex items-center space-x-5">
                <a href='https://github.com/mikeleo03/Classic-Cryptography-Simulator-Frontend' target="_blank" rel="noopener noreferrer">
                    <Button className="md:text-sm text-base flex justify-center">
                        <Github className="h-5 w-5" />
                    </Button>
                </a>
            </div>
        </div>
    );
};

export default Navbar;
