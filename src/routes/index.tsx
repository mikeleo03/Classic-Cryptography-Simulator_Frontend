import { Outlet, RouteObject, createBrowserRouter } from "react-router-dom";
import { NotFound, StandardVigenerePage } from "../pages";
import { Navbar, Sidebar } from "@/components";

const PageLayout = () => {
    return (
        <div className="flex">
            <Sidebar />
            <main className="bg-background flex flex-col md:w-full w-screen h-screen">
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
                path: "*",
                element: <NotFound />,
            },
        ],
    },
];

const router = createBrowserRouter(routes);

export default router;