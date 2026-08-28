import { Resend } from "resend";
import { promises as fs } from "fs";
import path from "path";
import config from "../config.js";

// Priority: Environment Variable > Hardcoded Key (Fallback)
const resend = new Resend(config.RESEND_API_KEY);
const ADMIN_EMAIL = config.ADMIN_EMAIL;
/**
 * Loads a template file and replaces placeholders with dynamic data.
 */
async function renderTemplate(templateName, replacements) {
  const filePath = path.join(process.cwd(), "templates", `${templateName}.html`);
  let content = await fs.readFile(filePath, "utf8");
  
  for (const [key, val] of Object.entries(replacements)) {
    content = content.split(`{{${key}}}`).join(val !== undefined && val !== null ? String(val) : "");
  }
  return content;
}

/**
 * Constructs the dictionary of placeholders for the template engines.
 */
function getReplacements(data, origin) {
  const customerName = data.customer ? `${data.customer.firstName || ""} ${data.customer.lastName || ""}`.trim() : "Valued Customer";
  
  // Calculate pricing values safely
  const basePrice = Number(data.rental?.totalPrice || data.rental?.originalPrice || 0);
  const totalCost = Number(data.rental?.totalCost || 0);
  const extrasValue = Math.max(0, totalCost - basePrice);
  
  const formattedPickupDate = data.rental?.pickupDate || "";
  const formattedReturnDate = data.rental?.returnDate || "";
  const pickupTime = data.rental?.pickupTime ? ` at ${data.rental.pickupTime}` : "";
  const returnTime = data.rental?.returnTime ? ` at ${data.rental.returnTime}` : "";

// Gather vehicle‑specific fields safely
const vehicleImageUrl = data.vehicle?.imageUrl ? `https://xccloc26.com${data.vehicle.imageUrl}` : "";
const vehicleType = data.vehicle?.type || "";
const vehiclePricePerDay = data.vehicle?.pricePerDay ? `${data.vehicle.pricePerDay} €` : "N/A";
  const adminNote = data.adminNote || data.admin_note || "No notes";

return {
  vehicle_image_url: vehicleImageUrl,
  vehicle_type: vehicleType,
  vehicle_price_per_day: vehiclePricePerDay,
  admin_note: adminNote,
  customer_name: customerName,
  customer_email: data.customer?.email || "",
  customer_phone: data.customer?.phone || "",
  customer_country: data.customer?.country || "Morocco",
  vehicle_name: data.vehicle?.name || "Vehicle",
  vehicle_category: data.vehicle?.type || "Rental Vehicle",
  daily_rate: data.vehicle?.pricePerDay ? `${data.vehicle.pricePerDay} €` : "N/A",
  pickup_date: `${formattedPickupDate}${pickupTime}`,
  return_date: `${formattedReturnDate}${returnTime}`,
  pickup_location: "Marrakech Office / Airport / Hotel",
  return_location: "Marrakech Office / Airport / Hotel",
  total_days: String(data.rental?.totalDays || ""),
  rental_cost: `${basePrice || totalCost} €`,
  extras_total: `${extrasValue} €`,
  deposit: "Refundable security deposit required at pickup",
  total_amount: `${totalCost} €`,
  customer_notes: data.adminNote || "No special requests",
  admin_booking_url: `${origin}/admin.html`,
  booking_url: `${origin}/client.html`,
  booking_reference: data.id || "N/A",
  created_at: data.submittedAt ? new Date(data.submittedAt).toLocaleString() : new Date().toLocaleString(),
  year: String(new Date().getFullYear()),
  brand: "XCC-LOC26"
};
}

export default async function handler(req, res) {
  // Set content type header to application/json to enforce JSON response structure
  res.setHeader("Content-Type", "application/json");

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    // Safely check and parse request body if it was sent as a raw string
    let body = req.body;
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (err) {
        return res.status(400).json({ success: false, error: "Invalid JSON format in request body" });
      }
    }

    if (!body) {
      return res.status(400).json({ success: false, error: "Empty request body" });
    }

    const { type, data } = body;
    console.log("Email Request:", { type, clientEmail: data?.customer?.email });

    if (!type) {
      return res.status(400).json({ success: false, error: "Missing required 'type' field in request body" });
    }

    if (!data) {
      return res.status(400).json({ success: false, error: "Missing required 'data' field in request body" });
    }

    // Derive origin dynamically for correct absolute URLs in templates
    const origin = req.headers.origin || (req.headers.referer ? new URL(req.headers.referer).origin : "https://xcc-loc26.com");
    const replacements = getReplacements(data, origin);

    if (type === "initial") {
      if (!data.customer?.email) {
        return res.status(400).json({ success: false, error: "Missing customer email address in data object" });
      }

      // 1. Send "booking under review" to CLIENT using request.html
      const clientHtml = await renderTemplate("request", replacements);
      const clientRes = await resend.emails.send({
        from: "XCC-LOC26 <booking@xccloc26.com>", 
        to: data.customer.email, // change later
        subject: "Booking Request Received - XCC-LOC26",
        html: clientHtml,
      });

      // 2. Send details to ADMIN using order.html
      const adminHtml = await renderTemplate("order", replacements);
      const adminRes = await resend.emails.send({
        from: "XCC-LOC26 <booking@xccloc26.com>",
        to: ADMIN_EMAIL,
        subject: `NEW BOOKING REQUEST: ${replacements.customer_name}`,
        html: adminHtml,
      });

      console.log("Resend Initial Responses:", { clientRes, adminRes });
      return res.status(200).json({ success: true, message: "Initial emails processed successfully" });
    } 
    
    else if (type === "accepted") {
      if (!data.customer?.email) {
        return res.status(400).json({ success: false, error: "Missing customer email address in data object" });
      }

      // 3. Send confirmation to CLIENT using confirmation.html
      const acceptedHtml = await renderTemplate("confirmation", replacements);
      const acceptedRes = await resend.emails.send({
        from: "XCC-LOC26 <booking@xccloc26.com>",
        to: data.customer.email,
        subject: "Booking Confirmed! - XCC-LOC26",
        html: acceptedHtml,
      });

      console.log("Resend Acceptance Response:", acceptedRes);
      return res.status(200).json({ success: true, message: "Acceptance email processed successfully" });
    }
    
    else if (type === "denied") {
      if (!data.customer?.email) {
        return res.status(400).json({ success: false, error: "Missing customer email address in data object" });
      }

      // 4. Send rejection/denial to CLIENT using denide.html
      const deniedHtml = await renderTemplate("denide", replacements);
      const deniedRes = await resend.emails.send({
        from: "XCC-LOC26 <booking@xccloc26.com>",
        to: data.customer.email,
        subject: "Booking Update - XCC-LOC26",
        html: deniedHtml,
      });

      console.log("Resend Denial Response:", deniedRes);
      return res.status(200).json({ success: true, message: "Denial email processed successfully" });
    }

    return res.status(400).json({ success: false, error: `Invalid email type: ${type}` });
  } catch (error) {
    console.error("Resend API Handler Exception Error:", error);
    return res.status(500).json({ success: false, error: error.message || "Internal server error" });
  }
}
