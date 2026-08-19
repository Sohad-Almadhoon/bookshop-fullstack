import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BsChevronLeft } from "react-icons/bs";
import toast from "react-hot-toast";
import Header from "../components/shared/Header";
import Button from "../components/shared/Button";
import CustomInput from "../components/shared/CustomInput";
import FileUploader from "../components/modals/components/FileUploader";
import Loader from "../components/shared/Loader";
import newRequest, { getErrorMessage } from "../utils/newRequest";
import uploadFile from "../utils/upload";
import useBookStates from "../hooks/useBookStates";

interface BookData {
  id: number;
  title: string;
  author: string;
  description: string;
  main_cover: string;
  generes: string[];
}

/**
 * Editing lives on its own page: the shared modal is a circle on wide screens,
 * which left almost no usable width for a five-field form.
 */
const EditBookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: book,
    isLoading,
    isError,
    error,
  } = useQuery<BookData>({
    queryKey: ["book", id],
    queryFn: async () => (await newRequest.get(`/api/books/${id}`)).data,
    enabled: Boolean(id),
  });

  const { data: states, isLoading: isCheckingOwner } = useBookStates(id);
  const isOwner = Boolean(states?.isOwner);

  const [form, setForm] = useState({
    title: "",
    author: "",
    description: "",
    main_cover: "",
  });
  const [genresInput, setGenresInput] = useState("");

  // Fill the form once the book arrives.
  useEffect(() => {
    if (!book) return;
    setForm({
      title: book.title,
      author: book.author,
      description: book.description,
      main_cover: book.main_cover,
    });
    setGenresInput((book.generes ?? []).join(", "));
  }, [book]);

  const upload = useMutation({
    mutationFn: (file: File) => uploadFile(file, "image"),
    onSuccess: (url) => {
      setForm((prev) => ({ ...prev, main_cover: url }));
      toast.success("Cover uploaded");
    },
    onError: (error: Error) => toast.error(error.message || "Could not upload the cover"),
  });

  const save = useMutation({
    mutationFn: async () => {
      const generes = genresInput
        .split(",")
        .map((genre) => genre.trim())
        .filter(Boolean);

      // Only what actually changed. Sending the whole book back also resent
      // covers that older books store as very long data URIs, which the
      // validator rejects even though the user never touched them.
      const changed: Record<string, unknown> = {};
      if (form.title !== book?.title) changed.title = form.title;
      if (form.author !== book?.author) changed.author = form.author;
      if (form.description !== book?.description) changed.description = form.description;
      if (form.main_cover !== book?.main_cover) changed.main_cover = form.main_cover;
      if (generes.join(",") !== (book?.generes ?? []).join(",")) changed.generes = generes;

      if (Object.keys(changed).length === 0) return null;

      const { data } = await newRequest.patch(`/api/books/${id}`, changed);
      return data;
    },
    onSuccess: (data) => {
      toast.success(data ? "Book updated" : "Nothing changed");
      queryClient.invalidateQueries({ queryKey: ["book", id] });
      queryClient.invalidateQueries({ queryKey: ["userBooks"] });
      queryClient.invalidateQueries({ queryKey: ["library"] });
      navigate(`/books/${id}`);
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not save your changes.")),
  });

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("No file selected");
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    upload.mutate(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return toast.error("Please give the book a title.");
    if (!form.author.trim()) return toast.error("Please name the author.");
    if (!form.description.trim()) return toast.error("Please add a description.");
    if (!genresInput.trim()) return toast.error("Please add at least one genre.");
    if (!form.main_cover) return toast.error("Please keep a cover image.");
    save.mutate();
  };

  if (isLoading || isCheckingOwner) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <Loader minHeight={400} />
      </div>
    );
  }

  if (isError || !book) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
          <p className="text-xl">This book could not be loaded</p>
          <p className="text-sm text-black/60">{getErrorMessage(error, "")}</p>
          <Link to="/profile">
            <Button className="w-fit px-6 py-2 text-sm">Back to your profile</Button>
          </Link>
        </div>
      </div>
    );
  }

  // The API refuses it anyway; this is just a clearer wall than a 403 toast.
  if (!isOwner) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
          <h1 className="font-voyage text-3xl uppercase">Not your book</h1>
          <p className="text-sm text-black/60">
            Only the person who created a book can edit it.
          </p>
          <Link to={`/books/${id}`}>
            <Button className="w-fit px-6 py-2 text-sm">Back to the book</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 border border-black p-4 sm:p-6 lg:p-10">
        <div className="mx-auto w-full max-w-5xl">
          <Link
            to={`/books/${id}`}
            className="inline-flex items-center gap-2 text-sm underline underline-offset-4">
            <BsChevronLeft /> Back to {book.title}
          </Link>

          <h1 className="mt-4 font-voyage text-3xl uppercase sm:text-4xl">Edit book</h1>
          <p className="mt-1 font-baskervville text-sm text-black/60">
            Changes are visible to everyone as soon as you save.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,220px)_minmax(0,1fr)] lg:gap-12">
            {/* the cover gets real room here instead of a sliver of a circle */}
            <div>
              <span className="mb-2 block text-sm font-medium">Cover</span>
              {upload.isPending ? (
                <Loader minHeight={200} />
              ) : (
                <FileUploader
                  type="visual"
                  file={form.main_cover}
                  setFile={(value) => setForm({ ...form, main_cover: value })}
                  onFileChange={handleCover}
                  label="Click to upload"
                  accept="image/*"
                  description="PNG, JPG or WEBP (max 5MB)"
                />
              )}
            </div>

            <div className="min-w-0">
              <label className="block text-sm font-medium" htmlFor="edit-title">
                Title
              </label>
              <CustomInput
                id="edit-title"
                className="mt-1 w-full"
                value={form.title}
                maxLength={120}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <label className="mt-5 block text-sm font-medium" htmlFor="edit-author">
                Author
              </label>
              <CustomInput
                id="edit-author"
                className="mt-1 w-full"
                value={form.author}
                maxLength={120}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
              />

              <label className="mt-5 block text-sm font-medium" htmlFor="edit-description">
                Description
              </label>
              <textarea
                id="edit-description"
                value={form.description}
                maxLength={2000}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1 min-h-40 w-full rounded-2xl border border-black/30 bg-transparent p-3 leading-relaxed outline-none focus:border-black"
              />
              <p className="mt-1 text-right text-xs text-black/40">
                {form.description.length}/2000
              </p>

              <label className="mt-3 block text-sm font-medium" htmlFor="edit-genres">
                Genres (comma separated)
              </label>
              <CustomInput
                id="edit-genres"
                className="mt-1 w-full"
                value={genresInput}
                placeholder="Fiction, Drama"
                onChange={(e) => setGenresInput(e.target.value)}
              />

              <div className="mt-8 flex flex-wrap justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-fit px-6 py-2 text-sm"
                  disabled={save.isPending}
                  onClick={() => navigate(`/books/${id}`)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="w-fit px-6 py-2 text-sm"
                  disabled={save.isPending || upload.isPending}>
                  {save.isPending ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default EditBookPage;
