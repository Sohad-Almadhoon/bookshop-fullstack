import newRequest from "./newRequest"; // Ensure this path is correct and the module exports a 'post' method
const upload = async (imageFile: File, audioFile: File, fileType: string) => {
  const formData = new FormData();
  formData.append('fileType', fileType);

  if (fileType === 'image' && imageFile) {
    formData.append('image', imageFile);
  } else if (fileType === 'audio' && audioFile) {
    formData.append('audio', audioFile);
  }
  try {
    const response = await newRequest.post("api/upload", formData);
    const result = response.data;
    if (fileType === 'image') {
      console.log('Image URL:', result.imageUrl);
    } else if (fileType === 'audio') {
      console.log('Audio URL:', result.audioUrl);
    }
  } catch (error) {
    console.error('Error uploading file:', error);
  }
};

export default upload;
