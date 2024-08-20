import Image from "next/image";

export const Mimage = ({ muhar }) => {
  return (
    <Image src={`/muhari/${muhar}.png`} alt={muhar} width={250} height={250} />
  );
};
