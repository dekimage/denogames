const reviewConfirmationTemplate = ({
  productName,
  rating,
  comment,
  productId,
}) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #4a5568; text-align: center;">Thanks for Your Review!</h1>
    
    <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="color: #2d3748; margin-bottom: 15px;">Your Review for ${productName}</h2>
      
      <div style="margin-bottom: 15px;">
        <strong>Rating:</strong> ${"⭐".repeat(rating)}
      </div>
      
      ${
        comment
          ? `
        <div style="background-color: white; padding: 15px; border-radius: 6px; margin-top: 10px;">
          <em>"${comment}"</em>
        </div>
      `
          : ""
      }
    </div>

    <p style="color: #4a5568; line-height: 1.6;">
      Thank you for taking the time to share your thoughts! Your feedback helps us improve and helps other players make informed decisions.
    </p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://denogames.com/game/${productId}" 
         style="background-color: #4f46e5; color: white; padding: 12px 24px; 
                text-decoration: none; border-radius: 6px; font-weight: bold;">
        View Your Review
      </a>
    </div>

    <p style="color: #718096; font-size: 14px; text-align: center; margin-top: 30px;">
      Keep playing and reviewing to unlock more achievements!
    </p>
  </div>
`;

export default reviewConfirmationTemplate;
