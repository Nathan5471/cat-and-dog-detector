import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUserImages } from "../utils/imageAPIHandler";
import NavBar from "../components/NavBar";

export default function Home() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserImages = async () => {
      try {
        const response = await getUserImages();
        setImages(response.images);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserImages();
  }, [setImages]);

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
    <div className="flex flex-col w-screen h-screen bg-gray-800 text-white">
      <NavBar />
      <div className="flex flex-col w-screen h-full">
        <h1 className="text-3xl text-left ml-2">Your images</h1>
      </div>
    </div>
  );
}
