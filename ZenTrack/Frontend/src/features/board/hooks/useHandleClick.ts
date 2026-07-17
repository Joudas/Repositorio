import { useEffect } from 'react'

export const useHandleClick = (containerRef: React.RefObject<HTMLDivElement | null>, setClose: () => void) => {
    useEffect(() => {
    const handleClick = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setClose();
        }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
}, []);
    return {}
}
