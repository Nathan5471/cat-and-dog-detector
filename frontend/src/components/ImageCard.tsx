import { useNavigate } from "react-router-dom";

export default function ImageCard({
  image,
}: {
  image: { id: string; name: string };
}) {
  const navigate = useNavigate();
  const imageUrl = `${window.location.origin}/api/images/image/${image.id}`;

  return (
    <div className="flex flex-col bg-gray-700 w-full aspect-[1] items-center">
      <img
        src={imageUrl}
        className="w-full h-2/3 text-center items-center justify-center"
      />
      <h3 className="text-2xl font-bold text-center">{image.name}</h3>
      <button
        className="w-3/4 bg-gray-600 hover:bg-gray-500 rounded-lg text-2xl"
        onClick={() => navigate(`/image/${image.id}`)}
      >
        Open
      </button>
    </div>
  );
}
