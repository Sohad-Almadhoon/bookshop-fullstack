import { Link } from "react-router-dom";

const BookCard = ({url}:{url:string}) => {
  return (
    <Link to="/books/2" className="border border-black border-opacity-30 rounded-md p-5">
      <div className="relative">
        <img src={url} alt="" />
        <div className="absolute bottom-6 left-4 flex flex-col gap-1">
          <span className="rounded-xl border-2 border-black bg-white flex px-1">
            +1 <img src="/assets/music-note.svg" alt="music-note" />
          </span>
          <span className="rounded-xl border-2 border-black bg-white flex px-1">
            +2 <img src="/assets/photos.svg" alt="photos" />
          </span>
          <span className="rounded-xl border-2 border-black bg-white flex px-1">
            +1 <img src="/assets/pencil.svg" alt="pencil" />
          </span>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
