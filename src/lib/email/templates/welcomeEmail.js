const welcomeEmailTemplate = ({ username }) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #4a5568; text-align: center;">Welcome to Deno Games! 🎮</h1>
    
    <p style="font-size: 16px; line-height: 1.5;">
      Hi ${username},
    </p>

    <p style="font-size: 16px; line-height: 1.5;">
      Welcome to Deno Games! We're excited to have you join our community of gamers.
    </p>

    <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h2 style="color: #2d3748; margin-bottom: 15px;">Get Started:</h2>
      <ul style="list-style: none; padding: 0;">
        <li style="margin-bottom: 10px;">🎲 Browse our collection of games</li>
        <li style="margin-bottom: 10px;">🏆 Unlock achievements</li>
        <li style="margin-bottom: 10px;">⭐ Write reviews</li>
        <li style="margin-bottom: 10px;">🎮 Join the community</li>
      </ul>
    </div>

    <div style="text-align: center; margin-top: 30px;">
      <a href="https://denogames.com/shop" 
         style="background-color: #4f46e5; color: white; padding: 12px 24px; 
                text-decoration: none; border-radius: 6px; font-weight: bold;">
        Explore Games
      </a>
    </div>
  </div>
`;

export default welcomeEmailTemplate;
