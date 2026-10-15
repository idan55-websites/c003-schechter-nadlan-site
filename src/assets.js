// Resolve public assets for both a root domain and a repository subdirectory.
export const asset = path => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
