import Image from "next/image";
import {
  Sparkles,
  Printer,
  ShieldCheck,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  MessageCircle,
} from "lucide-react";
import footerImg from "@/assets/footer-bg.png";
import { useTrackClick } from "@/hooks/useTrackClick";
import { ALLOWED_CLICK_LABELS } from "@/lib/analytics/events";
import Link from "next/link";
import { EasterEggDialog } from "@/components/ui/easter-egg-dialog";
import { useState } from "react";

const FooterSection = ({ icon: Icon, title, description, style, onClick }) => (
  <div
    className="flex flex-col items-center p-4 font-strike max-w-[300px]"
    style={style}
    onClick={onClick}
  >
    <Icon
      className={`w-12 h-12 mb-8 ${title === "unique downloads" ? "cursor-pointer" : ""}`}
    />
    <div className="text-xl uppercase mb-1">{title}</div>
    <p className="text-sm text-grayy text-center">{description}</p>
  </div>
);

const FooterColumn = ({ title, links }) => {
  const trackClick = useTrackClick();

  const handleClick = async (link, label) => {
    if (label) {
      await trackClick(label);
    }
  };

  return (
    <div className="flex flex-col font-strike min-w-[250px] items-center">
      <div className="text-lg uppercase mb-4 text-white">{title}</div>
      {links.map((link, index) =>
        link.comingSoon ? (
          <div key={index} className="flex items-center text-grayy mb-2">
            <span className="opacity-60">{link.label}</span>
            <span className="ml-2 text-xs bg-primary/40 text-primary-foreground px-1.5 py-0.5 rounded">
              Soon
            </span>
          </div>
        ) : (
          <Link
            key={index}
            href={link.external ? link.link : `/${link.link}`}
            className="text-grayy hover:text-light mb-2"
            onClick={() => handleClick(link.link, link.trackingLabel)}
            target={link.external ? "_blank" : "_self"}
            rel={link.external ? "noopener noreferrer" : ""}
          >
            {link.label}
          </Link>
        )
      )}
    </div>
  );
};

const Footer = () => {
  const trackClick = useTrackClick();
  const [sparkleClicks, setSparkleClicks] = useState(0);
  const [showSparkleEgg, setShowSparkleEgg] = useState(false);

  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      link: "https://www.instagram.com/deno_games",
      trackingLabel: ALLOWED_CLICK_LABELS.FOOTER_INSTAGRAM,
    },
    {
      name: "Youtube",
      icon: Youtube,
      link: "https://www.youtube.com/@deno-games",
      trackingLabel: ALLOWED_CLICK_LABELS.NAV_HOME,
    },
    {
      name: "Facebook",
      icon: Facebook,
      link: "https://www.facebook.com/dejan.gavrilovic.73/",
      trackingLabel: ALLOWED_CLICK_LABELS.NAV_HOME,
    },
  ];

  const handleSocialClick = (trackingLabel) => {
    if (trackingLabel) {
      trackClick(trackingLabel);
    }
  };

  return (
    <footer className="text-white mt-auto">
      {/* <div className="relative h-[400px] w-full">
        <Image
          src={footerImg}
          alt="Footer background"
          fill
          style={{ objectFit: "cover" }}
        />
      </div> */}

      <div className="w-full bg-darky flex flex-col justify-between items-center">
        <div className="flex flex-col gap-16 md:flex-row justify-between my-8 max-w-[1000px] px-4">
          <FooterSection
            icon={Printer}
            title="print and play"
            description="Instantly download and play the games tonight!"
          />
          <FooterSection
            icon={Sparkles}
            title="unique downloads"
            description="Each game comes with a unique system for generating unique PDF files."
            onClick={() => {
              const newCount = sparkleClicks + 1;
              setSparkleClicks(newCount);
              if (newCount >= 7) {
                setShowSparkleEgg(true);
                setSparkleClicks(0);
              }
            }}
          />
          <FooterSection
            icon={ShieldCheck}
            title="Secure Payments"
            description="Payments are processed securely by Stripe."
          />
        </div>

        <div className="flex justify-center bg-darkest w-full p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1000px]">
            <FooterColumn
              title="Platform"
              links={[
                {
                  label: "Home",
                  link: "",
                  trackingLabel: ALLOWED_CLICK_LABELS.NAV_HOME,
                },
                {
                  label: "Shop",
                  link: "shop",
                  trackingLabel: ALLOWED_CLICK_LABELS.NAV_SHOP,
                },
                {
                  label: "Blog",
                  link: "blog",
                  trackingLabel: ALLOWED_CLICK_LABELS.NAV_BLOG,
                },
              ]}
            />
            <FooterColumn
              title="Company"
              links={[
                {
                  label: "About",
                  link: "about",
                  trackingLabel: ALLOWED_CLICK_LABELS.FOOTER_ABOUT,
                },
                {
                  label: "FAQ",
                  link: "faq",
                  trackingLabel: ALLOWED_CLICK_LABELS.FOOTER_FAQ,
                },
                {
                  label: "Privacy Policy",
                  link: "privacy-policy",
                  trackingLabel: ALLOWED_CLICK_LABELS.PRIVACY_POLICY,
                },
                {
                  label: "Terms of Use",
                  link: "terms-of-service",
                  trackingLabel: ALLOWED_CLICK_LABELS.TERMS_CONDITIONS,
                },
              ]}
            />
            <FooterColumn
              title="Community"
              links={[
                {
                  label: "Newsletter",
                  link: "newsletter",
                  trackingLabel: ALLOWED_CLICK_LABELS.FOOTER_NEWSLETTER,
                  comingSoon: true,
                },
                {
                  label: "Patreon",
                  link: "https://www.patreon.com/Deno_Games",
                  trackingLabel: ALLOWED_CLICK_LABELS.FOOTER_PATREON,
                  external: true,
                  comingSoon: true,
                },
                {
                  label: "Contact",
                  link: "contact",
                  trackingLabel: ALLOWED_CLICK_LABELS.FOOTER_CONTACT,
                },
              ]}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:justify-around bg-black w-full py-6 px-4 items-center">
          <div className="text-grayy text-sm mb-4 md:mb-0 text-center md:text-left">
            &copy; Deno Games {new Date().getFullYear()}. Made with ❤️ by Deno
          </div>
          <div className="flex space-x-6">
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-grayy hover:text-light transition-colors"
                  onClick={() => handleSocialClick(social.trackingLabel)}
                >
                  <IconComponent className="w-6 h-6" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <EasterEggDialog
        open={showSparkleEgg}
        onOpenChange={setShowSparkleEgg}
        title="✨ Sparkly Secret! ✨"
        code="DOODLER"
        message="What is this??? Maybe if you make an account and visit the cauldron in my collection you'll find out ;)"
        image="/easterEggs/5.png"
        imageAlt="Sparkle Secret"
      />
    </footer>
  );
};

export default Footer;
