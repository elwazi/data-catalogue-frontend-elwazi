declare module 'jsonexport/dist' {
    function jsonExport(
        data: any,
        options: any,
        callback: (error: Error | null, csv: string) => void
    ): void;
    
    export default jsonExport;
} 