const welcomeEmailTemplate = ({ username }) => `
  <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1a202c; line-height: 1.6;">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #7c3aed; font-size: 28px; margin-bottom: 5px; font-weight: 800;">Yay! You are in!</h1>
      <h2 style="color: #4b5563; font-size: 22px; margin-top: 0;">Welcome to the Deno Games Platform! 🎉</h2>
    </div>

    <p style="font-size: 16px; margin-bottom: 24px;">
      Hiii ${username},
    </p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      We're so excited to have you join the Deno Games community! You're in the right place. ;)
    </p>

    <p style="font-size: 16px; margin-bottom: 20px;">
      We created this platform for you to have an unique experience, like playing a board game in a shop!
    </p>

    <p style="font-size: 16px; margin-bottom: 24px;">
      This gamified platform will be the central hub for our new games and expansions, as well as many cool features like addons.
    </p>

    <div style="background-color: #f8f7ff; border-left: 4px solid #7c3aed; padding: 20px; border-radius: 8px; margin: 24px 0;">
      <h3 style="color: #4a5568; margin-top: 0; margin-bottom: 16px; font-size: 18px;">What to expect from the platform?</h3>
      <ul style="list-style: none; padding: 0; margin: 0;">
        <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
          <span style="margin-right: 10px; font-size: 20px;">🧩</span>
          <span>Find fun and easy to learn print and play games</span>
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
          <span style="margin-right: 10px; font-size: 20px;">🎲</span>
          <span>Download your game sheets</span>
        </li>
        <li style="margin-bottom: 12px; display: flex; align-items: flex-start;">
          <span style="margin-right: 10px; font-size: 20px;">💾</span>
          <span>Collect expansions and goodies</span>
        </li>
        <li style="margin-bottom: 0px; display: flex; align-items: flex-start;">
          <span style="margin-right: 10px; font-size: 20px;">👾</span>
          <span>Have fun like you play a board game… hints everywhere! 🤫</span>
        </li>
      </ul>
    </div>

    <p style="font-size: 16px; margin-bottom: 8px;">
      Thanks for joining us, and welcome to the club 💛
    </p>

    <p style="font-size: 16px; margin-bottom: 30px; font-style: italic;">
      Deno & Maca
    </p>

    <div style="text-align: center; margin: 36px 0 20px;">
      <a href="https://denogames.com/shop" 
         style="background-color: #7c3aed; color: white; padding: 14px 28px; 
                text-decoration: none; border-radius: 8px; font-weight: bold;
                display: inline-block; box-shadow: 0 4px 6px rgba(124, 58, 237, 0.25);
                transition: all 0.2s ease;">
        Explore Games
      </a>
    </div>

    <div style="text-align: center; margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 14px; color: #718096;">
      <p style="margin: 5px 0;">© ${new Date().getFullYear()} Deno Games. All rights reserved.</p>
      <p style="margin: 5px 0;">If you have any questions, feel free to <a href="mailto:denogames.official@gmail.com" style="color: #7c3aed; text-decoration: none;">contact us</a>.</p>
    </div>
  </div>
`;

export default welcomeEmailTemplate;
