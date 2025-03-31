const orderConfirmationTemplate = ({ products, totalAmount }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #4a5568; text-align: center;">Order Confirmation</h1>
    
    <p style="font-size: 16px; line-height: 1.5;">
      Thank you for your purchase! Here's a summary of your order:
    </p>

    <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="color: #2d3748; margin-bottom: 15px;">Order Details:</h2>
      ${products
        .map(
          (item) => `
        <div style="margin-bottom: 10px;">
          <strong>${item.name}</strong> - $${item.price}
        </div>
      `
        )
        .join("")}
      
      <div style="border-top: 2px solid #e2e8f0; margin-top: 15px; padding-top: 15px;">
        <strong>Total:</strong> $${totalAmount}
      </div>
    </div>

    <p style="color: #718096; font-size: 14px;">
      Your games are now available in your account. If you have any questions, please don't hesitate to contact us.
    </p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://denogames.com/my-games" 
         style="background-color: #4f46e5; color: white; padding: 12px 24px; 
                text-decoration: none; border-radius: 6px; font-weight: bold;">
        View My Games
      </a>
    </div>
  </div>
`;

export default orderConfirmationTemplate;
