import { z } from "zod";

const url = z.string().trim().url("Must be a valid URL").max(2048);

// A genre has to contain an actual word: the comma-separated input happily
// produced entries like "." before this.
const genre = z
  .string()
  .trim()
  .min(2, "A genre needs at least two characters")
  .max(40)
  .regex(/[a-zA-Z؀-ۿ]/, "A genre must contain letters");

export const createBookSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Title is required").max(120),
    author: z.string().trim().min(1, "Author is required").max(120),
    description: z.string().trim().min(1, "Description is required").max(2000),
    generes: z.array(genre).min(1, "At least one genre is required").max(20),
    main_cover: url,
  }),
});

export const createChapterSchema = z.object({
  body: z.object({
    title: z.string().trim().min(1, "Chapter title is required").max(120),
    cover_image: url,
  }),
});

// A paragraph of a chapter. The old 400 character cap forced authors to split
// a single thought across several blocks.
const paragraph = z
  .string()
  .trim()
  .min(1, "Write something first")
  .max(2000, "A paragraph can be at most 2000 characters");

export const chapterContentSchema = z.object({
  body: z
    .object({
      text: paragraph.optional(),
      audio: url.optional(),
    })
    .refine((data) => data.text || data.audio, {
      message: "Either text or audio must be provided",
    }),
});

export const updateTextBlockSchema = z.object({
  body: z.object({ text: paragraph }),
});

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1, "Comment cannot be empty").max(1000),
  }),
});

export const sendMessageSchema = z.object({
  body: z.object({
    content: z.string().trim().min(1, "Message cannot be empty").max(2000),
  }),
});
