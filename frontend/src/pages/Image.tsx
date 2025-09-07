import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  detectImage,
  getImageData,
  removeImage,
} from "../utils/imageAPIHandler";
import NavBar from "../components/NavBar";

export default function Image() {
  const navigate = useNavigate();
  const { imageId } = useParams();
  const [imageUrl, setImageUrl] = useState("");
  const [imageName, setImageName] = useState("");
  const [detect, setDetect] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    const fetchImageData = async () => {
      if (!imageId) {
        return;
      }
      try {
        const response = await getImageData(imageId);
        setImageName(response.imageName);
        setImageUrl(`${window.location.origin}/api/images/image/${imageId}`);
      } catch (error) {
        console.error("Error fetching image data:", error);
        setAccessDenied(true);
      } finally {
        setLoading(false);
      }
    };
    fetchImageData();
  }, [imageId]);

  const runModel = async () => {
    try {
      if (!imageId) {
        return;
      }
      await detectImage(imageId);
      setDetect(true);
      setImageUrl(`${window.location.origin}/api/images/result/${imageId}`);
    } catch (error) {
      console.error("Error running model on image:", error);
    }
  };

  const showOriginal = () => {
    setDetect(false);
    setImageUrl(`${window.location.origin}/api/images/image/${imageId}`);
  };

  const handleRemoveImage = async () => {
    if (!imageId) {
      return;
    }
    await removeImage(imageId);
    navigate("/");
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = imageName;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex flex-col w-screen h-screen bg-gray-800 text-white">
        <NavBar />
        <div className="flex flex-col w-screen h-full items-center justify-center text-center">
          <p className="text-3xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="flex flex-col w-screen h-screen bg-gray-800 text-white">
        <NavBar />
        <div className="flex w-screen h-full items-center justify-center text-center">
          <div className="flex flex-col w-80 h-70 bg-gray-700 rounded-lg justify-center items-center">
            <h1 className="text-4xl m-1">STOP!</h1>
            <p className="text-2xl">
              This image either doesn't exist or you aren't allowed to view it.
            </p>
            <button
              className="w-5/6 bg-gray-600 hover:bg-gray-500 rounded-lg p-2 mt-2"
              onClick={() => navigate("/")}
            >
              Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-screen min-h-screen bg-gray-800 text-white">
      <NavBar />
      <div className="flex flex-col md:flex-row w-screen md:h-[calc(100vh-56px)] mt-2 mb-2">
        <div className="flex w-full md:w-2/3 h-full items-center justify-center">
          <img
            src={imageUrl}
            alt={imageName}
            className="w-3/4 aspect-[1] md:w-[calc(100%-100px)] md:h-[calc(100%-100px)]"
          />
        </div>
        <div className="flex flex-col w-full md:w-1/3 h-full text-center items-center">
          <h1 className="text-4xl font-bold mt-8">{imageName}</h1>
          {detect ? (
            <button
              className="w-3/4 bg-gray-600 hover:bg-gray-500 rounded-lg p-3 mt-1 text-2xl"
              onClick={showOriginal}
            >
              Show Original
            </button>
          ) : (
            <button
              className="w-3/4 bg-gray-600 hover:bg-gray-500 rounded-lg p-3 mt-1 text-2xl"
              onClick={runModel}
            >
              Run Model
            </button>
          )}
          <button
            className="w-3/4 bg-gray-600 hover:bg-gray-500 rounded-lg p-3 mt-1 text-2xl"
            onClick={() => downloadImage()}
          >
            Download
          </button>
          <button
            className="w-3/4 bg-gray-600 hover:bg-gray-500 rounded-lg p-3 mt-1 text-2xl"
            onClick={handleRemoveImage}
          >
            Delete
          </button>
          <button
            className="w-3/4 bg-gray-600 hover:bg-gray-500 rounded-lg p-3 mt-1 text-2xl"
            onClick={() => navigate("/")}
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}
