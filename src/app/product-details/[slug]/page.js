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
    <div className="mx-2 sm:mx-8 py-8">
      <h1 className="text-3xl font-bold">{productDetails.name}</h1>

      {/* Game Details */}
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
      <div className="my-4">
        <img
          src={productDetails.thumbnail}
          alt={productDetails.name}
          className="w-full h-auto"
        />
        <p>
          <strong>Players:</strong> {productDetails.playersCount}
        </p>
        <p>
          <strong>Age:</strong> {productDetails.age}+
        </p>
        <p>
          <strong>Components:</strong>{" "}
          {productDetails.componentsList.join(", ")}
        </p>
        <p>
          <strong>Needed Components:</strong>{" "}
          {productDetails.neededComponents.join(", ")}
        </p>

        <div className="my-4">
          <h3 className="text-xl font-bold">How to Play</h3>
          {productDetails.howToVideos.map((video, index) => (
            <div key={index}>
              <a href={video} target="_blank" rel="noopener noreferrer">
                Watch Video {index + 1}
              </a>
            </div>
          ))}
        </div>

        <div className="my-4">
          <h3 className="text-xl font-bold">Kickstarter</h3>
          <a
            href={productDetails.kickstarterLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Kickstarter Campaign
          </a>
        </div>

        {/* Add to Cart Button */}
        <button className="bg-blue-500 text-white px-4 py-2 rounded">
          Add to Cart
        </button>
      </div>
      {productDetails.id && (
        <ReviewSection
          productDetails={productDetails}
          productId={productDetails.id}
        />
      )}
      {/* {productDetails.id && <ReviewForm productId={productDetails.id} />} */}
      {/* {productDetails.id && <ProductReviews productId={productDetails.id} />} */}
    </div>
  );
});

export default ProductDetailsPage;
