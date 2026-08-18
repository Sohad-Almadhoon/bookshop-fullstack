import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Modal from "../modals/Modal";
import Button from "../shared/Button";
import CustomInput from "../shared/CustomInput";
import FileUploader from "../modals/components/FileUploader";
import Loader from "../shared/Loader";
import newRequest, { getErrorMessage } from "../../utils/newRequest";
import uploadFile from "../../utils/upload";

interface EditBookModalProps {
  open: boolean;
  onClose: () => void;
  book: {
    id: number;
    title: string;
    author: string;
    description: string;
    generes: string[];
    main_cover: string;
  };
}

/** A book could be created and deleted but never corrected. */
const EditBookModal: React.FC<EditBookModalProps> = ({ open, onClose, book }) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: book.title,
    author: book.author,
    description: book.description,
    main_cover: book.main_cover,
  });
  const [genresInput, setGenresInput] = useState((book.generes ?? []).join(", "));

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
      const { data } = await newRequest.patch(`/api/books/${book.id}`, {
        ...form,
        generes,
      });
      return data;
    },
    onSuccess: () => {
      toast.success("Book updated");
      queryClient.invalidateQueries({ queryKey: ["book", String(book.id)] });
      queryClient.invalidateQueries({ queryKey: ["userBooks"] });
      queryClient.invalidateQueries({ queryKey: ["library"] });
      onClose();
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not save your changes.")),
  });

  const handleCover = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return toast.error("No file selected");
    if (!file.type.startsWith("image/")) return toast.error("Please choose an image file");
    upload.mutate(file);
  };

  return (
    <Modal open={open} onClose={onClose} title="Edit book">
      <div className="w-full max-w-md text-left">
        <label className="mt-2 block text-sm font-medium" htmlFor="edit-title">
          Title
        </label>
        <CustomInput
          id="edit-title"
          className="mt-1 w-full"
          value={form.title}
          maxLength={120}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <label className="mt-4 block text-sm font-medium" htmlFor="edit-author">
          Author
        </label>
        <CustomInput
          id="edit-author"
          className="mt-1 w-full"
          value={form.author}
          maxLength={120}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
        />

        <label className="mt-4 block text-sm font-medium" htmlFor="edit-description">
          Description
        </label>
        <textarea
          id="edit-description"
          value={form.description}
          maxLength={2000}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-1 min-h-24 w-full rounded-2xl border border-black/30 bg-transparent p-3 outline-none focus:border-black"
        />

        <label className="mt-4 block text-sm font-medium" htmlFor="edit-genres">
          Genres (comma separated)
        </label>
        <CustomInput
          id="edit-genres"
          className="mt-1 w-full"
          value={genresInput}
          onChange={(e) => setGenresInput(e.target.value)}
        />

        <span className="mt-4 block text-sm font-medium">Cover</span>
        {upload.isPending ? (
          <Loader minHeight={120} />
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

        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            className="w-fit px-5 py-2 text-sm"
            onClick={onClose}
            disabled={save.isPending}>
            Cancel
          </Button>
          <Button
            className="w-fit px-5 py-2 text-sm"
            disabled={save.isPending || upload.isPending}
            onClick={() => save.mutate()}>
            {save.isPending ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EditBookModal;
