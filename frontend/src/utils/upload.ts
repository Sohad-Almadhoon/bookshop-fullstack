import newRequest from "./newRequest";
const upload = async (file:File) => {
  const data = new FormData();
  data.append("file", file);
  console.log(file)
  try {
    const res = await newRequest.post("/api/upload", data);
    const { url } = res.data;
    return url;
  } catch (error) {
    return error;
  }
};

export default upload;
