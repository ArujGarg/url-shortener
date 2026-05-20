import axios from "axios";

export const handleShortenUrl = async (inputUrl: string) => {
  console.log("1");
  console.log(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/urls`);
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/urls`,
    {
      originalUrl: inputUrl,
    },
  );
  console.log("2");
  console.log("reponse of POST ", response);
  return response.data;
};

export const handleCopy = async (
  shortUrl: string,
  setCopied: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  await navigator.clipboard.writeText(shortUrl);

  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
};
