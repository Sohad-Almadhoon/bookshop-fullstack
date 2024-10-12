interface GenreTagProps {
  tags: string[];
}

const GenreTags: React.FC<GenreTagProps> = ({ tags }) => (
  <div className="flex gap-2 flex-1 items-end ">
    {tags.map((tag, index) => (
      <p
        key={index}
        className="border border-gray-400  rounded-md text-gray-500 py-1 px-2 text-sm">
        {tag}
      </p>
    ))}
  </div>
);
export default GenreTags;
