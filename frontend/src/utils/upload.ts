import newRequest from "./newRequest";
const upload = async (file:File) => {
  const data = new FormData();
  data.append("file", file);
  try {
    const res = await newRequest.post("/upload", data);
    const { url } = res.data;
    console.log(url);
    return url;
  } catch (error) {
    console.log(error);
  }
};

export default upload;
