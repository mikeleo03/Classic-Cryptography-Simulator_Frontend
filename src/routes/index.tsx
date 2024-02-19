import { Outlet, RouteObject, createBrowserRouter } from "react-router-dom";
import { 
    NotFound, 
    StandardVigenerePage, 
    AutoKeyVigenerePage, 
    ExtendedVigenerePage, 
    PlayfairPage,
    AffinePage ,
    HillPage,
    SuperEncryptionPage,
    EnigmaPage
} from "../pages";
import { Navbar, Sidebar } from "@/components";

const PageLayout = () => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="bg-background flex flex-col md:w-full w-4/5 h-screen">
                <Navbar />
                <Outlet />
            </main>
        </div>
    );
};

const routes: RouteObject[] = [
    {
        path: "/",
        element: <PageLayout />,
        children: [
            {
                path: "",
                element: <StandardVigenerePage />,
            },
            {
                path: "/auto-key-vigenere",
                element: <AutoKeyVigenerePage />,
            },
            {
                path: "/extended-vigenere",
                element: <ExtendedVigenerePage />,
            },
            {
                path: "/playfair",
                element: <PlayfairPage />,
            },
            {
                path: "/affine",
                element: <AffinePage />,
            },
            {
                path: "/hill",
                element: <HillPage />,
            },
            {
                path: "/super",
                element: <SuperEncryptionPage />,
            },
            {
                path: "/enigma",
                element: <EnigmaPage />,
            },
            {
                path: "*",
                element: <NotFound />,
            },
        ],
    },
];

const router = createBrowserRouter(routes);

export default router;