import Image from "next/image";

export const Mimage = ({ muhar, width, height }) => {
  return (
    <Image
      src={`/muhari/${muhar}.png`}
      alt={muhar}
      width={width || 250}
      height={height || 250}
    />
  );
};
