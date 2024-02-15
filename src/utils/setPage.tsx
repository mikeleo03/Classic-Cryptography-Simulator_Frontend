export const setPage = (pagename: string, navigate: (to: string) => void) => {
    navigate("/" + pagename);

    // Save the current page to localStorage
    localStorage.setItem('currentPage', pagename);
};