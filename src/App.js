import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [image, setImage] = useState(null);
  const [allImage, setAllImage] = useState(null);

  useEffect(() => {
    getImage();
  }, []);

  const submitImage = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("image", image);

    try {
      const result = await axios.post(
        "http://localhost:5000/upload-image",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Refresh the displayed images after upload
      getImage();
    } catch (error) {
      console.error("Error submitting image:", error);
    }
  };

  const onInputChange = (e) => {
    setImage(e.target.files[0]);
  };

  const getImage = async () => {
    try {
      const result = await axios.get("http://localhost:5000/get-image");
      setAllImage(result.data.data);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  const downloadFile = async (fileName) => {
    try {
      const result = await axios.get(`http://localhost:5000/download/${fileName}`, {
        responseType: 'blob', // Important for handling binary data
      });

      // Create a download link
      const url = window.URL.createObjectURL(new Blob([result.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <div>
      <form onSubmit={submitImage}>
        <input type="file" onChange={onInputChange}></input>
        <button type="submit">Submit</button>
      </form>
      {allImage == null
        ? ""
        : allImage.map((data) => (
            <div key={data._id}>
              <p>{data.image}</p>
              <img
                src={require(`./images/${data.image}`)}
                key={data._id}
                height={100}
                width={100}
                alt={data.image}
              />
              <button onClick={() => downloadFile(data.image)}>
                Download
              </button>
            </div>
          ))}
    </div>
  );
}

export default App;