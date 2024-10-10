"use client";
import { observer } from "mobx-react";
import MobxStore from "@/mobx";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ProductReviews,
  ReviewForm,
  ReviewSection,
} from "@/components/Reviews";
import ImageCarousel from "@/components/ImageCarousel";
import { Button } from "@/components/ui/button";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { Download } from "lucide-react";

const GameFeatures = ({ productDetails }) => {
  return (
    <div className="flex gap-2 my-8">
      <div className="flex flex-col border-foreground border max-w-[230px]">
        <div className="flex bg-foreground text-background justify-center w-full text-[14px] items-center border-b border-foreground">
          Players
        </div>
        <Image
          src="/muhari/players.png"
          width={100}
          height={100}
          alt="players count"
          className="mb-2"
        />
        <div className="flex bg-foreground text-background justify-center w-full text-[14px] items-center border-t border-foreground ">
          2-4
          {/* {productDetails.playersCount} */}
        </div>
      </div>
      <div className="flex flex-col border-foreground border max-w-[230px]">
        <div className="flex bg-foreground text-background justify-center w-full text-[14px] items-center border-b border-foreground">
          Duration
        </div>
        <Image
          src="/muhari/clock.png"
          width={100}
          height={100}
          alt="players count"
          className="mb-2"
        />
        <div className="flex bg-foreground text-background justify-center w-full text-[14px] items-center border-t border-foreground ">
          60 min
        </div>
      </div>

      <div className="flex flex-col border-foreground border max-w-[230px]">
        <div className="flex bg-foreground text-background justify-center w-full text-[14px] items-center border-b border-foreground">
          Age
        </div>
        <Image
          src="/muhari/age.png"
          width={100}
          height={100}
          alt="players count"
          className="mb-2"
        />
        <div className="flex bg-foreground text-background justify-center w-full text-[14px] items-center border-t border-foreground ">
          {productDetails.age}+
        </div>
      </div>
    </div>
  );
};

const HowToPlay = ({ productDetails }) => {
  return (
    <div className="flex flex-col items-center gap-8 justify-center  bg-[#FFD045] w-full py-8 ">
      <div className="text-[32px] font-bold text-center">
        {/* Heyya! Reading is the slow way to learn how to play! Watch the video
        instead! */}
        How to Play - Fast Version
      </div>
      {/* 
      {productDetails.howToVideos.map((video, index) => (
          <div key={index}>
            <a href={video} target="_blank" rel="noopener noreferrer">
              Watch Video {index + 1}
            </a>
          </div>
        ))} */}

      <div>
        <iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/I1kamcPFiAM"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
      </div>
      <div className="text-[32px] font-bold text-center">
        Or Slow in Details
      </div>
      <Button className="bg-foreground h-[48px] text-xl text-background hover:bg-background hover:text-foreground">
        Download Rules <Download className="ml-2" />
      </Button>
    </div>
  );
};

const ProductDetailsPage = observer(({ params }) => {
  const { slug } = params;

  const [productDetails, setProductDetails] = useState(null);

  const { fetchProductDetails } = MobxStore;

  useEffect(() => {
    if (slug) {
      fetchProductDetails(slug).then((details) => {
        setProductDetails(details);
      });
    }
  }, [slug]);

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-8 flex flex-col justify-center items-center">
      {/* <div class="grid grid-cols-1 lg:grid-cols-2 gap-4"> */}
      <div className="flex flex-col lg:flex-row gap-4 justify-center gap-16">
        <ImageCarousel
          images={[
            "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage1.png?alt=media",
            "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage2.png?alt=media&",
            "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fthumbnail.png?alt=media",
            "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage1.png?alt=media",
            "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fimage2.png?alt=media&",
            "https://firebasestorage.googleapis.com/v0/b/denogames-7c4dc.appspot.com/o/products%2Fgame1%2Fthumbnail.png?alt=media",
          ]}
        />

        <div className="flex  flex-col max-w-[440px]">
          <div className="text-[46px] leading-[60px]  whitespace-wrap font-bold font-strike">
            {productDetails.name}
          </div>
          <div className="text-[20px] leading-[28px] my-4">
            A film, music, and TV guessing game where U must speak good or get
            hit with stick.
          </div>
          <Link href="#ratings" className="w-fit">
            <div className="flex gap-2 items-center border-b  w-fit cursor-pointer my-4 hover:border-foreground">
              <div className="text-yellow-400 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar key={star} className="text-xl text-yellow-400" />
                ))}
              </div>
              <div className="text-[16px]">(55 Reviews)</div>
            </div>
          </Link>

          <div className="text-[28px] mb-4">${productDetails.price}.00 USD</div>

          <Button className="text-xl h-[48px]">Add to cart</Button>

          <GameFeatures productDetails={productDetails} />
        </div>
      </div>

      <HowToPlay />

      <div className="my-4">
        {/* <a
            href={productDetails.kickstarterLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Kickstarter Campaign
          </a> */}

        <p>
          <strong>Components:</strong>{" "}
          {productDetails.componentsList.join(", ")}
        </p>
        <p>
          <strong>Needed Components:</strong>{" "}
          {productDetails.neededComponents.join(", ")}
        </p>
      </div>

      {productDetails.id && (
        <ReviewSection
          productDetails={productDetails}
          productId={productDetails.id}
        />
      )}
    </div>
  );
});

export default ProductDetailsPage;
