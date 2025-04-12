

export function toBase64(file: File): Promise<string> {
    return new Promise((resolve,rejects) => {
        const lector = new FileReader();
        lector.readAsDataURL(file);
        lector.onload = () => resolve(lector.result as string);
        lector.onerror = (error) => rejects(error);
    });
}