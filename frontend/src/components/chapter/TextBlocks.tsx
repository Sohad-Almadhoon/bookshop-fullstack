import { useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BsCheck2, BsPencil, BsTrash, BsX } from "react-icons/bs";
import toast from "react-hot-toast";
import Button from "../shared/Button";
import ConfirmDialog from "../shared/ConfirmDialog";
import newRequest, { getErrorMessage } from "../../utils/newRequest";

const MAX_LENGTH = 2000;

interface TextBlocksProps {
  chapterId: string;
  blocks: string[];
  canWrite: boolean;
  isOwner: boolean;
}

/** Grows to fit its content so a long paragraph is never edited through a slit. */
const AutoTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({
  value,
  className = "",
  ...props
}) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 520)}px`;
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      maxLength={MAX_LENGTH}
      className={`w-full resize-none rounded-lg border border-black/30 bg-transparent p-3 leading-relaxed outline-none placeholder:text-black/30 focus:border-black ${className}`}
      {...props}
    />
  );
};

const TextBlocks: React.FC<TextBlocksProps> = ({
  chapterId,
  blocks,
  canWrite,
  isOwner,
}) => {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [pendingDelete, setPendingDelete] = useState<number | null>(null);

  const refresh = () => queryClient.invalidateQueries({ queryKey: ["chapter", chapterId] });

  const addBlock = useMutation({
    mutationFn: (text: string) =>
      newRequest.post(`/api/chapters/${chapterId}/content`, { text }),
    onSuccess: () => {
      setDraft("");
      refresh();
      toast.success("Paragraph added");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not add the paragraph.")),
  });

  const updateBlock = useMutation({
    mutationFn: ({ index, text }: { index: number; text: string }) =>
      newRequest.patch(`/api/chapters/${chapterId}/content/text/${index}`, { text }),
    onSuccess: () => {
      setEditingIndex(null);
      refresh();
      toast.success("Paragraph updated");
    },
    onError: (error) => toast.error(getErrorMessage(error, "Could not save your changes.")),
  });

  const deleteBlock = useMutation({
    mutationFn: (index: number) =>
      newRequest.delete(`/api/chapters/${chapterId}/content/text/${index}`),
    onSuccess: () => {
      setPendingDelete(null);
      refresh();
      toast.success("Paragraph deleted");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not delete the paragraph."));
      setPendingDelete(null);
    },
  });

  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditingValue(blocks[index]);
  };

  const submitDraft = () => {
    const text = draft.trim();
    if (!text) return toast.error("Write something first.");
    addBlock.mutate(text);
  };

  return (
    <div className="flex flex-col gap-4">
      {blocks.length === 0 && !canWrite && (
        <p className="font-baskervville text-black/60">
          No text content available for this chapter.
        </p>
      )}

      {blocks.map((block, index) =>
        editingIndex === index ? (
          <div key={index} className="rounded-lg border border-black bg-black/[0.03] p-3">
            <AutoTextarea
              value={editingValue}
              autoFocus
              onChange={(e) => setEditingValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setEditingIndex(null);
              }}
            />
            <div className="mt-2 flex items-center justify-between gap-3">
              <span className="text-xs text-black/50">
                {editingValue.length}/{MAX_LENGTH}
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex w-fit items-center gap-1 px-3 py-1.5 text-xs"
                  onClick={() => setEditingIndex(null)}>
                  <BsX className="text-base" /> Cancel
                </Button>
                <Button
                  className="flex w-fit items-center gap-1 px-3 py-1.5 text-xs"
                  disabled={updateBlock.isPending || !editingValue.trim()}
                  onClick={() =>
                    updateBlock.mutate({ index, text: editingValue.trim() })
                  }>
                  <BsCheck2 className="text-base" />
                  {updateBlock.isPending ? "Saving…" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <article
            key={index}
            className="group relative rounded-lg border border-black/40 p-4 pr-4 sm:pr-24">
            <p className="whitespace-pre-wrap break-words font-baskervville leading-relaxed">
              {block}
            </p>

            {isOwner && (
              // always visible on touch screens, on hover for pointer devices
              <div className="mt-3 flex gap-2 sm:absolute sm:right-3 sm:top-3 sm:mt-0 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100 sm:focus-within:opacity-100">
                <button
                  type="button"
                  aria-label={`Edit paragraph ${index + 1}`}
                  onClick={() => startEditing(index)}
                  className="rounded-full border border-black/30 bg-[#DDD1BB] p-2 hover:bg-black hover:text-white">
                  <BsPencil />
                </button>
                <button
                  type="button"
                  aria-label={`Delete paragraph ${index + 1}`}
                  onClick={() => setPendingDelete(index)}
                  className="rounded-full border border-black/30 bg-[#DDD1BB] p-2 hover:bg-red-800 hover:text-white">
                  <BsTrash />
                </button>
              </div>
            )}
          </article>
        )
      )}

      {canWrite && (
        // writing happens right where the text lives, instead of in a modal
        <div className="rounded-lg border border-dashed border-black/40 p-3">
          <AutoTextarea
            value={draft}
            rows={3}
            placeholder="Write the next paragraph…"
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submitDraft();
            }}
          />
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="text-xs text-black/50">
              {draft.length}/{MAX_LENGTH} · Ctrl+Enter to add
            </span>
            <Button
              className="w-fit px-5 py-1.5 text-xs"
              disabled={addBlock.isPending || !draft.trim()}
              onClick={submitDraft}>
              {addBlock.isPending ? "Adding…" : "Add paragraph"}
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={pendingDelete !== null}
        loading={deleteBlock.isPending}
        title="Delete this paragraph?"
        description="The paragraph will be removed from this chapter permanently."
        confirmLabel="Delete paragraph"
        onConfirm={() => pendingDelete !== null && deleteBlock.mutate(pendingDelete)}
        onClose={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default TextBlocks;
