import { neon } from "@neondatabase/serverless";
import { Resend } from "resend";

// Initialize Neon database
const sql = neon(process.env.DATABASE_URL);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Allow only POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Only POST requests are allowed",
    });
  }

  try {
    // Parse body safely
    const body =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const { name, email, subject, message } = body;

    // Basic validation (so empty garbage doesn't go in DB)
    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // 1. Save to Neon database
    await sql`
      INSERT INTO contacts (name, email, subject, message)
      VALUES (${name}, ${email}, ${subject}, ${message})
    `;

    // 2. Send email using Resend
    const emailResponse = await resend.emails.send({
      from: "contactbapassociates@resend.dev", // temporary sender (works without domain setup)
      to: "pranavstoretransform@gmail.com",    // 🔥 CHANGE THIS TO YOUR EMAIL
      subject: `New Contact Form Submission: ${subject || "No Subject"}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || "N/A"}</p>

          <hr />

          <p><strong>Message:</strong></p>
          <p>${message}</p>
        </div>
      `,
    });

    // Success response
    return res.status(200).json({
      success: true,
      emailResponse,
    });

  } catch (err) {
    console.error("ERROR:", err);

    return res.status(500).json({
      error: err.message,
      stack: err.stack,
    });
  }
}