import { useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "../utils/imageAPIHandler";
import NavBar from "../components/NavBar";

export default function UploadImage() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setImage(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  const triggerFileInput = () => {
    inputRef.current?.click();
  };

  const handleUploadImage = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    if (!image) {
      setError("Image is required");
      return;
    }
    const formData = new FormData();
    formData.append("file", image);
    formData.append("name", imageName);
    try {
      const response = await uploadImage(formData);
      const imageId = response.imageId;
      navigate(`/image/${imageId}`);
    } catch (error: unknown) {
      console.error("Image upload error:", error);
      const errorMessage =
        typeof error === "object" &&
        error !== null &&
        "message" in error &&
        typeof error.message === "string"
          ? error.message
          : "An unkown error occured";
      setError(errorMessage);
    }
  };

  return (
    <div className="flex flex-col w-screen min-h-screen bg-gray-800 text-white">
      <NavBar />
      <div className="flex flex-col w-screen h-full items-center justify-center">
        <form
          onSubmit={handleUploadImage}
          className="w-11/12 mt-2 mb-2 sm:w-3/4 md:w-2/3 lg:w-1/2"
        >
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleFileChange(e)}
            ref={inputRef}
            className="hidden"
            required
          ></input>
          {imagePreview ? (
            <div className="relative w-full h-85 group">
              <img
                src={imagePreview}
                alt="Selected Image Preview"
                onClick={triggerFileInput}
                className="w-full h-85 object-cover"
              ></img>
              <div
                onClick={triggerFileInput}
                className="absolute inset-0 bg-black/0 group-hover:bg-black/35 flex cursor-point items-center justify-center"
              >
                <span className="text-gray-200/0 font-medium text-3xl group-hover:text-gray-200">
                  Change Image
                </span>
              </div>
            </div>
          ) : (
            <div
              onClick={triggerFileInput}
              className="flex w-full h-85 bg-gray-700 hover:bg-gray-600 items-center justify-center text-center"
            >
              <p className="text-2xl">Upload Image</p>
            </div>
          )}
          <label className="text-2xl text-left mt-2">Image Name</label>
          <input
            type="text"
            value={imageName}
            onChange={(e) => setImageName(e.target.value)}
            className="w-full p-2 bg-gray-700"
            placeholder="Enter the image's name"
            required
          />
          {error && <p className="text-red-500 text-lg">{error}</p>}
          <button
            type="submit"
            className="mt-3 w-full bg-gray-700 hover:bg-gray-600 p-2"
          >
            Upload
          </button>
        </form>
      </div>
    </div>
  );
}
