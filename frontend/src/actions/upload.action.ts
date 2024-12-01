import uploadFile from "../utils/upload";

const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setFile: React.Dispatch<React.SetStateAction<string>>,
    toast: { error: (message: string) => void }
) => {
    const uploadedFile = e.target.files?.[0];
    setIsLoading(true);

    if (uploadedFile) {
        try {
            const fileType = uploadedFile.type.split("/")[0];
            if (fileType === "image" || fileType === "audio") {
                const fileUrl = await uploadFile(uploadedFile, fileType);
                setFile(fileUrl);
            } else {
                toast.error(
                    "Unsupported file type! Only images and audio files are allowed."
                );
            }
        } catch (error) {
            const errorMessage =
                error instanceof Error ? error.message : "Error uploading file!";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    } else {
        toast.error("No file selected!");
        setIsLoading(false);
    }
};

export default handleFileUpload;
