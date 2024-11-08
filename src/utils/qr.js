import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import Image from "next/image";

const QRCodeComponent = ({ url }) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState(null);

  useEffect(() => {
    // Check local storage for the QR code
    const savedQrCode = localStorage.getItem(`qrCode_${url}`);
    if (savedQrCode) {
      setQrCodeDataUrl(savedQrCode); // Use the saved QR code
    } else {
      // Generate the QR code if not found in local storage
      QRCode.toDataURL(url, { width: 40, height: 40 })
        .then((dataUrl) => {
          setQrCodeDataUrl(dataUrl);
          localStorage.setItem(`qrCode_${url}`, dataUrl); // Save the QR code for future use
        })
        .catch((error) => {
          console.error("Error generating QR Code:", error);
        });
    }
  }, [url]);

  return (
    <div style={{ display: "inline-block", width: "40px", height: "40px" }}>
      {qrCodeDataUrl ? (
        <Image src={qrCodeDataUrl} alt="QR Code" width={300} height={300} />
      ) : (
        <p>Loading QR Code...</p>
      )}
    </div>
  );
};

export default QRCodeComponent;
