import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div className="w-screen h-14 flex flex-row bg-gray-700 items-center p-1">
      <Link
        className="text-3xl ml-2 font-bold text-white hover:text-gray-300 hover:underline"
        to="/"
      >
        Cat and Dog Detector
      </Link>
      <Link
        className="text-xl ml-auto bg-gray-600 text-white rounded-lg hover:bg-gray-500 p-1"
        to="/upload"
      >
        Upload
      </Link>
    </div>
  );
}
