// Central place for the exact columns that may leave the server.
// Never `include: { user: true }` — that ships the bcrypt hash to the client.

export const publicUserSelect = {
  id: true,
  name: true,
  role: true,
  generes: true,
  created_at: true,
};

// The owner of the account gets a little more (their own email + paid flag).
export const selfUserSelect = {
  ...publicUserSelect,
  email: true,
  has_paid: true,
};

export const bookSelect = {
  id: true,
  title: true,
  author: true,
  description: true,
  generes: true,
  main_cover: true,
  created_at: true,
};

/**
 * The creator of a book, as shown next to their name in comments and chat.
 * Ownership lives in user_books with type "ALL".
 */
export const bookOwnerSelect = {
  where: { type: "ALL" },
  select: { user: { select: { id: true, name: true, role: true } } },
  take: 1,
};
