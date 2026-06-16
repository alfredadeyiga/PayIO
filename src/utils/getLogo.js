export const getLogo = (value) => {
  const logoApiKey = import.meta.env.VITE_LOGO_DEV_API_KEY;

  const formattedValue = encodeURIComponent(value);

  const link = `https://img.logo.dev/name/${formattedValue}?token=${logoApiKey}&format=webp&retina=true`;

  return link;
};
