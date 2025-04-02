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
  Clock,
} from "lucide-react";
import { ProductTypeBadge } from "@/components/ProductTypeBadge";
import { trackEvent } from "@/lib/analytics/client";
import { CLIENT_EVENTS } from "@/lib/analytics/events";

export const ProductCard = observer(({ product, isSmall = false }) => {
  const { addToCart, cart, user, products } = MobxStore;

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
    if (product.isComingSoon) {
      return (
        <Button
          variant="secondary"
          className="w-full cursor-not-allowed opacity-70"
          disabled
        >
          <Clock size={16} className="mr-1" /> COMING SOON
        </Button>
      );
    }

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
      if (user && user.unlockedRewards?.includes(product.id)) {
        return (
          <Link
            href={`/account/my-games/${product.relatedGames}`}
            className="w-full"
          >
            <Button
              variant="secondary"
              className="w-full bg-black hover:bg-black/80 text-white"
            >
              <Download size={16} className="mr-1" /> DOWNLOAD FILES
            </Button>
          </Link>
        );
      }

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
        <Link
          href="/checkout"
          className="w-full"
          onClick={async (e) => {
            e.preventDefault();

            await trackEvent({
              action: CLIENT_EVENTS.INITIATE_CHECKOUT_FROM_PRODUCT,
              context: {
                productId: product.id,
                currentPath: window.location.pathname,
                productType: product.type,
                cartItems: cart,
                cartValue: cart.reduce((total, id) => {
                  const product = products.find((p) => p.id === id);
                  return total + (product?.price || 0);
                }, 0),
                isFirstTime: user
                  ? !user?.analytics?.checkoutProducts?.includes(product.id)
                  : undefined,
              },
            });

            window.location.href = "/checkout";
          }}
        >
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
      {product.isComingSoon && (
        <div className="absolute top-0 right-0 left-0 z-10 bg-primary/90 text-primary-foreground py-1.5 px-3 text-center font-semibold tracking-wide">
          <div className="flex items-center justify-center gap-1.5">
            <Clock size={14} />
            <span className="text-sm">Coming Soon</span>
          </div>
        </div>
      )}

      <div>
        <Link
          href={`/product-details/${product.slug}`}
          onClick={handleCardClick}
          className={`flex justify-center items-center flex-col ${
            isSmall ? "p-2" : "p-4"
          } ${product.isComingSoon ? "pt-8" : ""}`}
        >
          <div className="relative">
            <Image
              src={product.thumbnail || placeholderImg}
              alt={product.name}
              width={isSmall ? 300 : 300}
              height={isSmall ? 300 : 300}
              className={`${isSmall ? "w-28 h-28" : "w-54 h-54"} ${
                product.isComingSoon ? "opacity-75 filter saturate-50" : ""
              }`}
            />
            {product.isComingSoon && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                  Coming Soon
                </div>
              </div>
            )}
          </div>

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
