import { admin } from "@/firebaseAdmin";
import { NextResponse } from "next/server";
// import Mailgun from "mailgun.js";
// import formData from "form-data";

// const mailgun = new Mailgun(formData);
// const mg = mailgun.client({
//   username: "api",
//   key: process.env.MAILGUN_API_KEY,
// });

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const newEmailDoc = {
      email,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await firestore.collection("emails").add(newEmailDoc);

    //     const emailHtml = `
    // <!DOCTYPE html>
    // <html lang="en">
    // <head>
    //   <meta charset="UTF-8">
    //   <meta name="viewport" content="width=device-width, initial-scale=1.0">
    //   <style>
    //     body {
    //       margin: 0;
    //       padding: 0;
    //       font-family: Arial, sans-serif;
    //       background-color: #f9f9f9;
    //       color: #333;
    //       line-height: 1.6;
    //     }
    //     .email-container {
    //       max-width: 600px;
    //       margin: 20px auto;
    //       background: #ffffff;
    //       border-radius: 8px;
    //       overflow: hidden;
    //       box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    //     }
    //     .header-image {
    //       width: 100%;
    //       height: 250px;
    //       background: url('https://denogames.com/landing/monster-mixology/mm-cover.png') no-repeat center center;
    //       background-size: cover;
    //     }
    //     .content {
    //       padding: 20px;
    //       text-align: center;
    //     }
    //     .title {
    //       font-size: 24px;
    //       font-weight: bold;
    //       color: #333333;
    //       margin-bottom: 20px;
    //     }
    //     .text {
    //       font-size: 16px;
    //       margin-bottom: 20px;
    //     }
    //     .button {
    //       display: inline-block;
    //       padding: 10px 20px;
    //       background-color: #22c55e;
    //       color: #ffffff !important;
    //       text-decoration: none;
    //       border-radius: 5px;
    //       font-size: 16px;
    //       font-weight: bold;
    //     }
    //     .button:hover {
    //       color: #ffffff !important;
    //     }
    //     .footer {
    //       background-color: #f1f1f1;
    //       padding: 10px;
    //       text-align: center;
    //       font-size: 12px;
    //       color: #777;
    //     }
    //     .footer a {
    //       color: #007BFF;
    //       text-decoration: none;
    //     }
    //   </style>
    // </head>
    // <body>
    //   <div class="email-container">
    //     <div class="header-image"></div>
    //     <div class="content">
    //       <div class="title">Download Monster Mixology</div>
    //       <div class="text">Thank you for playing <strong>Monster Mixology</strong>! Here is your download link:</div>
    //       <a href="${process.env.GAME_DOWNLOAD_URL}" class="button">Download Now</a>
    //       <div class="text" style="margin-top: 20px;">
    //         Happy gaming! We hope you enjoy your new printable board game.
    //       </div>
    //     </div>
    //     <div class="footer">
    //       If you have any questions or need support, feel free to <a href="mailto:denogames.official@gmail.com?subject=Monster%20Mixology%20Support">contact me</a>.<br>
    //       &copy; 2024 Deno Games. All rights reserved.
    //     </div>
    //   </div>
    // </body>
    // </html>`;

    // const messageData = {
    //   from: "Monster Mixology <noreply@mail.denogames.com>",
    //   to: email,
    //   subject: "Your Monster Mixology Download Link",
    //   html: emailHtml,
    // };

    // await mg.messages.create(process.env.MAILGUN_DOMAIN, messageData);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
