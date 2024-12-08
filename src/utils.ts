import { useEffect, useState } from "react";

export function makeImagePath(id: string, format?: string) {
    return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}


// 창의 넓이를 계속 추적 //
function getWindowDimensions() {
    const { innerWidth: width } = window;
    return width;
}
export function useWindowDimensions() {
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    );
    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return windowDimensions;
}
