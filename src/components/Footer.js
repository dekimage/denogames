import Image from "next/image";
import {
  Sparkles,
  Printer,
  ShieldCheck,
  Instagram,
  Youtube,
  Facebook,
  // Discord,
} from "lucide-react";
import footerImg from "@/assets/footer-bg.png";
import { useTrackClick } from "@/hooks/useTrackClick";
import { ALLOWED_CLICK_LABELS } from "@/lib/analytics/events";
import Link from "next/link";

const FooterSection = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center p-4 font-strike max-w-[300px]">
    <Icon className="w-12 h-12 mb-8" />
    <div className="text-xl uppercase mb-1">{title}</div>
    <p className="text-sm text-grayy text-center">{description}</p>
  </div>
);

const FooterColumn = ({ title, links }) => {
  const trackClick = useTrackClick();

  const handleClick = async (link, label) => {
    console.log("link", link);
    console.log("label", label);
    if (label) {
      await trackClick(label);
    }
  };

  return (
    <div className="flex flex-col font-strike min-w-[250px] items-center">
      <div className="text-lg uppercase mb-4 text-white">{title}</div>
      {links.map((link, index) => (
        <Link
          key={index}
          href={`/${link.link}`}
          className="text-grayy hover:text-light mb-2"
          onClick={() => handleClick(link.link, link.trackingLabel)}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
};

const Footer = () => {
  const socialLinks = [
    {
      name: "Instagram",
      icon: Instagram,
      link: "https://instagram.com/denogames",
    },
    { name: "Youtube", icon: Youtube, link: "https://youtube.com/denogames" },
    // { name: "Discord", icon: Discord, link: "https://discord.gg/denogames" },
    {
      name: "Facebook",
      icon: Facebook,
      link: "https://facebook.com/denogames",
    },
  ];

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
              title="Contact"
              links={[
                { label: "FAQ", link: "faq" },
                { label: "Support", link: "support" },
                { label: "Contact Us", link: "contact-us" },
              ]}
            />
            <FooterColumn
              title="Company"
              links={[
                { label: "About Us", link: "about-us" },
                { label: "Careers", link: "careers" },
                { label: "Press", link: "press" },
              ]}
            />
            <FooterColumn
              title="Information"
              links={[
                {
                  label: "Terms of Service",
                  link: "terms-of-service",
                  trackingLabel: ALLOWED_CLICK_LABELS.TERMS_CONDITIONS,
                },
                {
                  label: "Privacy Policy",
                  link: "privacy-policy",
                  trackingLabel: ALLOWED_CLICK_LABELS.PRIVACY_POLICY,
                },
                {
                  label: "Shipping Info",
                  link: "shipping-info",
                  // No tracking label for this one
                },
              ]}
            />
          </div>
        </div>

        <div className="flex justify-around bg-black w-full py-4">
          <div className="text-grayy text-sm mb-2">
            &copy; Deno Games 2024. All rights reserved.
          </div>
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <a
                  key={index}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-grayy hover:text-light transition-colors"
                >
                  <IconComponent className="w-6 h-6" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
