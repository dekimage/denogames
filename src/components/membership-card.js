import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, RefreshCcw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const MembershipCard = ({
    title,
    description,
    image,
    xpAmount,
    isRecurring = false,
    isActive = false,
    ctaText,
    ctaLink,
    ctaTarget = "_self",
    activeText,
    links = [],
}) => {
    return (
        <Card className="overflow-hidden">
            <div className="flex gap-4 p-4">
                <div className="w-24 h-24 relative rounded-lg overflow-hidden flex-shrink-0">
                    <Image
                        src={image}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 96px) 100vw, 96px"
                    />
                </div>
                <div className="flex-grow">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{description}</p>
                    {links.length > 0 && (
                        <div className="mt-2">
                            {links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.href}
                                    className="text-sm text-primary hover:underline block"
                                >
                                    {link.text}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 border-t">
                <div className="flex items-center gap-2">
                    <Badge
                        variant={isActive ? "success" : "secondary"}
                        className="flex items-center gap-1"
                    >
                        +{xpAmount} XP
                        {isRecurring && <RefreshCcw className="w-3 h-3" />}
                    </Badge>
                </div>
                {isActive ? (
                    <Badge variant="success" className="flex items-center gap-1">
                        <CheckCircle className="w-4 h-4" />
                        {activeText || "Active"}
                    </Badge>
                ) : (
                    <Button
                        variant="default"
                        size="sm"
                        asChild
                    >
                        <Link href={ctaLink} target={ctaTarget}>
                            {ctaText}
                        </Link>
                    </Button>
                )}
            </div>
        </Card>
    );
};