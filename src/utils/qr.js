import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import Image from "next/image";

const QRCodeComponent = ({ url, width = 40, height = 40 }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);

  useEffect(() => {
    // Check local storage for the QR code
    const savedQrCode = localStorage.getItem(`qrCode_${url}`);
    if (savedQrCode) {
      setQrCodeDataUrl(savedQrCode);
    } else {
      // Generate the QR code if not found in local storage
      QRCode.toDataURL(url, { width, height })
        .then((dataUrl) => {
          setQrCodeDataUrl(dataUrl);
          localStorage.setItem(`qrCode_${url}`, dataUrl);
        })
        .catch((error) => {
          console.error("Error generating QR Code:", error);
        });
    }
  }, [url, width, height]);

  return (
    <div
      style={{
        display: "inline-block",
        width: `${width}px`,
        height: `${height}px`,
      }}
    >
      {qrCodeDataUrl ? (
        <Image
          src={qrCodeDataUrl}
          alt="QR Code"
          width={width}
          height={height}
        />
      ) : (
        <p>Loading QR Code...</p>
      )}
    </div>
  );
};

export default QRCodeComponent;
