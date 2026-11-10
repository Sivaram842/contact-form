
const { Resend } = require("resend");
const Contact = require("../models/Contact");

const resend = new Resend(process.env.RESEND_API_KEY);

// Escape HTML to prevent HTML injection in email content
const escapeHtml = (value = "") => {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
};

const submitContactForm = async (req, res) => {
  console.log("CONTACT CONTROLLER HIT");

  try {
    console.log("REQUEST BODY:", req.body);

    // Existing controller code...
    const {
  name,
  email,
  company,
  phone,
  enquiry,
  message,
} = req.body || {};

    // Required field validation
    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof enquiry !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !enquiry.trim() ||
      !message.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    console.log("STEP 1: Validating form data...");

    // Save enquiry to MongoDB first
    const contact = await Contact.create({
      name,
      email,
      company,
      phone,
      enquiry,
      message,
    });

    console.log("STEP 2: MongoDB record saved:", contact._id);

    console.log("STEP 3: Sending email through Resend...");

    // Prepare email content
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #222;">
        <h2>New Doom Industries Enquiry</h2>

        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Company:</strong> ${escapeHtml(company || "Not provided")}</p>
        <p><strong>Phone:</strong> ${escapeHtml(phone || "Not provided")}</p>
        <p><strong>Enquiry:</strong> ${escapeHtml(enquiry)}</p>

        <h3>Message</h3>
        <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>

        <hr />
        <p>Submission ID: ${contact._id}</p>
      </div>
    `;

    // Send notification through Resend
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL,
      to: [process.env.CONTACT_RECEIVER_EMAIL],
      replyTo: email.trim(),
      subject: `New Enquiry: ${name.trim()}`,
      html: emailHtml,
    });

    console.log("STEP 4: Resend email sent:", data?.id);

    if (error) {
      console.error("Resend Error:", error);

      await Contact.findByIdAndUpdate(contact._id, {
        emailStatus: "failed",
      });

      return res.status(201).json({
        success: true,
        emailSent: false,
        message: "Enquiry saved, but email notification failed.",
        submissionId: contact._id,
      });
    }

    // Update email delivery status
    await Contact.findByIdAndUpdate(contact._id, {
      emailStatus: "sent",
      resendEmailId: data?.id || null,
    });

    console.log("STEP 5: Email status updated in MongoDB");

    console.log("Enquiry saved:", contact._id);
    console.log("Email sent:", data?.id);

    return res.status(201).json({
      success: true,
      emailSent: true,
      message: "Your enquiry has been submitted successfully.",
      submissionId: contact._id,
    });

  } catch (error) {
    console.error("========== CONTACT FORM ERROR ==========");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    console.error("========================================");

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Invalid form data.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

module.exports = { submitContactForm };
