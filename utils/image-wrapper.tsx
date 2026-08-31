import Image from "next/image";
import { IMAGE_SIZE } from "@/src/constants/config";

interface ImageWrapperProps {
    src: string;
    alt: string;
    type: "STATUS" | "ICON";
    className?: string;
    priority?: boolean;
}

export const ImageWrapper = ({
    src,
    alt,
    type,
    className,
    priority = false,
}: ImageWrapperProps) => {
    const size = IMAGE_SIZE[type];
    return (
        <Image
            src={src}
            alt={alt}
            width={size.width}
            height={size.height}
            className={className}
            priority={priority}
        />
    );
};
