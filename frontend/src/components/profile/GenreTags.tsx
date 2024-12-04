interface GenreTagProps {
  tags: string[];
}

const GenreTags: React.FC<GenreTagProps> = ({ tags }) => (
  <div className="flex gap-2 flex-1 items-end lg:mt-0 mt-8">
    {tags.map((tag, index) => (
      <p
        key={index}
        className="border border-black rounded-md text-black  py-1 px-2 text-sm">
        #{tag}
      </p>
    ))}
  </div>
);
export default GenreTags;
