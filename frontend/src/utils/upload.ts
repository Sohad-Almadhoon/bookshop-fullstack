import newRequest, { getErrorMessage } from "./newRequest";

const uploadFile = async (file: File, fileType: "image" | "audio"): Promise<string> => {
  const formData = new FormData();
  formData.append(fileType, file);

  try {
    const response = await newRequest.post(`/api/upload/${fileType}`, formData, {
      // Let the browser set the multipart boundary itself.
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data.url;
  } catch (error) {
    throw new Error(getErrorMessage(error, "File upload failed due to server error!"));
  }
};

export default uploadFile;
