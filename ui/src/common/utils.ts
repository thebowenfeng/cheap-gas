export const debounce = (timeout: number, func: () => void) => {
    let timeoutId = setTimeout(func, timeout);

    return () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(func, timeout);
    }
}