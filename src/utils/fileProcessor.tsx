class FileProcessor {
    /**
     * Reads text from a File object.
     */
    static async readTxtFile(file: File) {
        if (file.type !== "text/plain") {
            throw new Error("Unsupported file type. Only text/plain files are supported.");
        }
    
        const fileReader = new FileReader();
        return new Promise<string>((resolve, reject) => {
            fileReader.onload = (e) => {
                resolve(e.target?.result as string);
            };
            fileReader.onerror = (error) => {
                reject(error);
            };
            fileReader.readAsText(file);
        });
    }
  
    /**
     * Downloads data as a file.
     */
    static download(data: string, filename: string, mimeType = "text/plain"): boolean {
        if (!document) {
            return false;
        }
    
        const element = document.createElement("a");
        const file = this.createBlob(data, mimeType);
        element.style.display = "none";
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    
        return true;
    }

    /**
     * Downloads a real file.
     */
    static downloadFile(file: Blob | MediaSource, filename: string): boolean {
        if (!document) {
            return false;
        }
    
        const element = document.createElement("a");
        element.style.display = "none";
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    
        return true;
    }

    /**
     * Creates a Blob object from data.
     */
    static createBlob(data: string, type: string) {
        return new Blob([data], { type });
    }
}
  
export default FileProcessor;
