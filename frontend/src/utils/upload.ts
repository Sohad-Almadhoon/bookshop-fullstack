import newRequest from "./newRequest";

const uploadFile = async (file: File, fileType: "image" | "audio"): Promise<string> => {
  const formData = new FormData();
  formData.append(fileType, file);
  const uploadEndpoint =
    fileType === "image"
      ? "image"
      : "audio";
  try {
    const response = await newRequest.post(`/api/upload/${uploadEndpoint}`, formData, {
      headers: {
      'Content-Type': 'multipart/form-data'
      }
    });
    return response.data.url;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("File upload failed due to server error!");
  }
};
export default uploadFile;