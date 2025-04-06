const orderConfirmationTemplate = ({ products, totalAmount }) => `
  <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a202c; line-height: 1.6;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #7c3aed; font-size: 28px; margin-bottom: 5px; font-weight: 800;">Order Confirmed!</h1>
      <h2 style="color: #4b5563; font-size: 22px; margin-top: 0;">Thank you for your purchase 🎮</h2>
    </div>
    
    <p style="font-size: 16px; margin-bottom: 24px;">
      Your order is confirmed and your games are now available in your account. Here's a summary of your purchase:
    </p>

    <div style="background-color: #f8f7ff; border-left: 4px solid #7c3aed; padding: 20px; border-radius: 8px; margin: 24px 0;">
      <h2 style="color: #4a5568; margin-top: 0; margin-bottom: 16px; font-size: 20px;">Order Details:</h2>
      
      ${products
        .map(
          (product) => `
        <div style="display: flex; margin-bottom: 16px; padding-bottom: 16px; border-bottom: 1px solid #e2e8f0;">
          ${
            product.thumbnail
              ? `<div style="width: 60px; height: 60px; margin-right: 15px; flex-shrink: 0;">
              <img src="${product.thumbnail}" alt="${product.name || "Product"}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 4px;">
            </div>`
              : ""
          }
          <div style="flex-grow: 1;">
            <div style="font-weight: bold; font-size: 16px; margin-bottom: 4px;">${product.name || "Product"}</div>
            <div style="color: #7c3aed; font-weight: 600;">$${parseFloat(product.price).toFixed(2)}</div>
          </div>
        </div>
      `
        )
        .join("")}
      
      <div style="border-top: 2px solid #7c3aed; margin-top: 10px; padding-top: 15px; display: flex; justify-content: space-between;">
        <span style="font-size: 18px; font-weight: bold;">Total:</span>
        <span style="font-size: 18px; font-weight: bold; color: #7c3aed;">$${parseFloat(totalAmount).toFixed(2)}</span>
      </div>
    </div>

    <div style="margin-top: 30px; text-align: center;">
      <p style="margin-bottom: 20px; font-size: 16px;">
        Ready to start playing? Click the button below to access your games.
      </p>
      
      <a href="https://denogames.com/account/my-games" 
         style="background-color: #7c3aed; color: white; padding: 14px 28px; 
                text-decoration: none; border-radius: 8px; font-weight: bold;
                display: inline-block; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.25);
                transition: all 0.2s ease;">
        View My Games
      </a>
    </div>
    
    <div style="margin-top: 40px; font-size: 15px; color: #4b5563;">
      <p style="margin-bottom: 10px;">If you have any questions or need assistance, please don't hesitate to contact us at <a href="mailto:denogames.official@gmail.com" style="color: #7c3aed; text-decoration: none;">denogames.official@gmail.com</a>.</p>
      <p style="margin-bottom: 10px;">Thank you for supporting Deno Games!</p>
      <p style="font-style: italic;">Deno & Maca</p>
    </div>
    
    <div style="text-align: center; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 14px; color: #718096;">
      <p style="margin: 5px 0;">© ${new Date().getFullYear()} Deno Games. All rights reserved.</p>
    </div>
  </div>
`;

export default orderConfirmationTemplate;
