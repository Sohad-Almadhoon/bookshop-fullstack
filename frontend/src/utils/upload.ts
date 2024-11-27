import newRequest from "./newRequest"; // Ensure this path is correct and the module exports a 'post' method
const upload = async (file: File) => {
  const data = new FormData();
  data.append("file", file);
  try {
    const res = await newRequest.post("/api/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data", // Ensure the correct header is set
      },
    });
    const { url } = res.data;
    return url;
  } catch (error: any) {
    console.error("Upload error:", error.response?.data || error.message);

    return null;
  }
};

export default upload;
