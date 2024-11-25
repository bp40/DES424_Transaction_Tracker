import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {CloudUploadIcon} from "lucide-react";
import {ChangeEvent, useState} from "react";

async function uploadS3(e: ChangeEvent<HTMLFormElement>) {
    const formData = new FormData(e.target);
    const files = formData.getAll("file"); // Get all files, assuming input name="file" allows multiple files

    // Create an array of promises for each file upload
    const uploadPromises = files.map(async (file) => {
        // @ts-ignore
        const fileType = encodeURIComponent(file.type);

        // Fetch the upload URL for the file
        const response = await fetch(`/api/media?fileType=${fileType}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch data, status: ${response.status}`);
        }

        const data = await response.json();
        const { uploadURL, key } = data;

        // Upload the file to S3
        const s3res = await fetch(uploadURL, {
            method: "PUT",
            body: file,
        });

        if (!s3res.ok) {
            throw new Error(`Failed to upload file, status: ${s3res.status}`);
        }

        console.log(s3res);
        return key;
    });

    // Wait for all uploads to complete
    try {
        const keys = await Promise.all(uploadPromises);
        console.log('All files uploaded successfully:', keys);
        e.target.reset(); // Reset the form after uploading all files
        return keys; // Array of keys for all uploaded files
    } catch (error) {
        console.error('Error uploading files:', error);
        e.target.reset(); // Reset the form if an error occurs
        throw error; // Re-throw the error after logging
    }
}


const UploadImageModal = () => {

    const [fileNames, setFileNames] = useState([]);

    const handleFileChange = (e) => {
        // Get the files selected by the user
        const files = e.target.files;

        // Map through the files and extract their names
        const fileNames = Array.from(files).map(file => file.name);

        // Update the state with the file names
        setFileNames(fileNames);
    };

    const handleFileSubmit = async (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(event.target.files)

        const res = await uploadS3(event)

        console.log("Result",res)
        event.target.reset()
        setFileNames([])
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="px-2 mx-2"> Import QR Payment Slip </Button>
            </DialogTrigger>
            <DialogContent>
                <Card className="m-2">
                    <CardHeader>
                        <CardTitle>Upload Images</CardTitle>
                        <CardDescription>Drag and drop your images or click the button below to select files.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-10 space-y-6">
                        <CloudUploadIcon className="w-16 h-16 text-zinc-500 dark:text-zinc-400" />
                        <form onSubmit={handleFileSubmit}>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-lg p-10 space-y-6">
                                <label
                                    htmlFor="file-upload"
                                    className="cursor-pointer px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-700 focus:outline-none"
                                >
                                    Choose File(s)
                                </label>

                                <input
                                    id="file-upload"
                                    name="file"
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    className="hidden"  // Hide the default input
                                    onChange={handleFileChange}
                                />
                                <Button type="submit" className="w-full mt-4">Confirm Upload</Button>
                            </div>
                        </form>
                        {/* Display the names of the uploaded files */}
                        {fileNames.length > 0 && (
                            <div className="mt-4 space-y-2">
                                <h3 className="text-lg font-semibold">Uploaded Files:</h3>
                                <ul className="list-disc pl-6">
                                    {fileNames.map((name, index) => (
                                        <li key={index} className="text-sm text-zinc-700 dark:text-zinc-300">{name}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </DialogContent>
        </Dialog>
    )
}

export default UploadImageModal