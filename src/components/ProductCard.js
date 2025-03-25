import MobxStore from "@/mobx";
import { observer } from "mobx-react-lite";
import placeholderImg from "@/assets/placeholder.png";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  CheckCheck,
  ShoppingBag,
  ShoppingCart,
  Download,
  Hammer,
  ArrowRight,
} from "lucide-react";
import { ProductTypeBadge } from "@/components/ProductTypeBadge";
import { trackEvent } from "@/lib/analytics/client";
import { CLIENT_EVENTS } from "@/lib/analytics/events";

export const ProductCard = observer(({ product, isSmall = false }) => {
  const { addToCart, cart, user } = MobxStore;

  const isInCart = cart.includes(product.id);
  const isPurchased = user
    ? user.purchasedProducts?.includes(product.id)
    : false;

  const renderPrice = () => {
    if (product.type === "add-on") {
      return null;
    }
    if (product.price === 0) return "Free";
    return `$${product.price}`;
  };

  const renderCTA = () => {
    if (isPurchased) {
      return (
        <Link href={`/account/my-games/${product.id}`} className="w-full">
          <Button
            variant="secondary"
            className="w-full bg-black hover:bg-black/80 text-white"
          >
            <Download size={16} className="mr-1" /> DOWNLOAD FILES
          </Button>
        </Link>
      );
    }

    if (product.type === "add-on") {
      return (
        <Link href={`/product-details/${product.slug}`} className="w-full">
          <Button variant="secondary" className="w-full">
            <Hammer size={16} className="mr-1" /> CRAFT THIS
          </Button>
        </Link>
      );
    }

    if (isInCart) {
      return (
        <Link href="/checkout" className="w-full">
          <Button
            variant="secondary"
            className="w-full bg-orange-400 hover:bg-orange-300"
          >
            COMPLETE CHECKOUT <ArrowRight size={16} className="ml-1" />
          </Button>
        </Link>
      );
    }

    return (
      <Button onClick={() => addToCart(product)} className="w-full">
        <ShoppingCart size={16} className="mr-1" /> ADD TO CART
      </Button>
    );
  };

  const handleCardClick = async () => {
    const isFirstClick = !user?.analytics?.clickedProductCards?.includes(
      product.id
    );

    await trackEvent({
      action: CLIENT_EVENTS.PRODUCT_CARD_CLICK,
      context: {
        productId: product.id,
        isFirstClick,
        currentPath: window.location.pathname,
        productType: product.type,
      },
    });
  };

  return (
    <div
      className={`relative border rounded-lg shadow-sm bg-card text-card-foreground hover:shadow-md transition-all ${
        isSmall ? "w-[220px]" : ""
      } overflow-hidden`}
    >
      <div>
        <Link
          href={`/product-details/${product.slug}`}
          onClick={handleCardClick}
          className={`flex justify-center items-center flex-col ${
            isSmall ? "p-2" : "p-4"
          }`}
        >
          <Image
            src={product.thumbnail || placeholderImg}
            alt={product.name}
            width={isSmall ? 300 : 300}
            height={isSmall ? 300 : 300}
            className={isSmall ? "w-28 h-28" : "w-54 h-54"}
          />
          <div className={`flex flex-col w-full ${isSmall ? "pt-2" : "pt-4"}`}>
            <div className="w-full">
              <div
                className={`${
                  isSmall ? "mt-2 text-lg" : "mt-4 text-xl"
                } font-strike`}
              >
                {product.name.length > 30
                  ? `${product.name.slice(0, 30)}...`
                  : product.name}
              </div>
              <div className="flex items-center mt-1">
                <ProductTypeBadge type={product.type} />
              </div>
              <div className="flex items-center justify-between mt-4">
                <p
                  className={`${
                    isSmall ? "mt-2 text-sm" : "text-xl"
                  } font-bold text-foreground`}
                >
                  {renderPrice()}
                </p>
                {isPurchased && (
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full px-2 py-1 text-xs flex items-center">
                    <CheckCircle size={12} className="mr-1" /> Owned
                  </div>
                )}
                {isInCart && !product.type === "add-on" && (
                  <div className="text-orange-500 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 text-xs px-2 py-1 rounded-full flex items-center">
                    <CheckCheck
                      className="text-orange-500 dark:text-orange-400 mr-2"
                      size={20}
                    />
                    In Cart
                  </div>
                )}
              </div>
            </div>
          </div>
        </Link>
        <div
          className={isSmall ? "p-2 pt-0 font-strike" : "p-4 pt-0 font-strike"}
        >
          {renderCTA()}
        </div>
      </div>
    </div>
  );
});
