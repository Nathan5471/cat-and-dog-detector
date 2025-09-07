import { useState, useEffect } from "react";
import { getUserImages } from "../utils/imageAPIHandler";
import NavBar from "../components/NavBar";
import ImageCard from "../components/ImageCard";

export default function Home() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        const response = await getUserImages();
        console.log("Response:", response);
        setImages(response.images);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserImages();
  }, []);

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

  return (
    <div className="flex flex-col w-screen min-h-screen bg-gray-800 text-white">
      <NavBar />
      <div className="flex flex-col w-screen h-full items-center justify-center">
        <h1 className="text-3xl font-bold ml-2 mt-2">Your images</h1>
        <div className="grid grid-cols-4 gap-4 m-3">
          {images.map((image: { id: string; name: string }) => {
            return <ImageCard key={image.id} image={image} />;
          })}
        </div>
      </div>
    </div>
  );
}
