
const BookCard = () => {
  return (
    <div className="border rounded-md p-5">
      <div className="relative">
        <img src="/assets/book-1.png" alt="" />
        <div className="absolute bottom-0 left-0">
          <span className="rounded-xl border-2 border-black">
            +1 <img src="/assets/music-note.svg" alt="music-note" />
          </span>
          <span className="rounded-xl border-2 border-black">
            +2 <img src="/assets/photos.svg" alt="photos" />
          </span>
          <span className="rounded-xl border-2 border-black">
            +1 <img src="/assets/pencil.svg" alt="pencil" />
          </span>
        </div>
      </div>
      <div className="flex flex-col text-center">
        {" "}
        <p className="mt-1 font-medium truncate">IP INPUT 800</p>
        <p className="font-light">FUND: $4,000</p>
      </div>
    </div>
  );
};

export default BookCard;
