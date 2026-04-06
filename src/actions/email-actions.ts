'use server'

import { Resend } from 'resend'

export async function sendBookingEmail(bookingData: any, vehicle: any) {
  if (!process.env.RESEND_API_KEY) {
    console.error("Mailing Engine Missing: RESEND_API_KEY not found in Matrix.")
    return { success: false, error: "API Key Missing" }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  try {
    const { data, error } = await resend.emails.send({
      from: 'Dubai Rent Cars <onboarding@resend.dev>', // Modifiez avec votre domaine vérifié plus tard
      to: [bookingData.clientEmail],
      subject: `🏎️ Demande de Location: ${vehicle.brand} ${vehicle.name} - Dubai Rent Cars`,
      html: `
        <div style="background-color: #0a0a0a; color: #ffffff; padding: 40px; font-family: sans-serif; border-radius: 20px;">
          <h1 style="color: #00f2fe; italic: true;">DUBAI RENT CARS</h1>
          <hr style="border: 0.1px solid #333;" />
          <h2>Bonjour ${bookingData.clientName},</h2>
          <p>Votre demande de location a été enregistrée avec succès dans notre système de gestion de flotte.</p>
          
          <div style="background-color: #1a1a1a; padding: 20px; border-radius: 15px; border: 1px solid #333;">
            <p><strong>Véhicule:</strong> ${vehicle.brand} ${vehicle.name}</p>
            <p><strong>Cycles (Dates):</strong> ${new Date(bookingData.startDate).toLocaleString()} - ${new Date(bookingData.endDate).toLocaleString()}</p>
            <p><strong>Montant Total:</strong> <span style="color: #00f2fe; font-size: 20px;">${bookingData.totalPrice} €</span></p>
          </div>

          <div style="margin-top: 30px; padding: 20px; background-color: #00f2fe; color: #0a0a0a; font-weight: bold; text-align: center; border-radius: 10px;">
             PROCHAINE ÉTAPE: Veuillez visiter l'agence Dubai Rent Cars dans un délai de 48h pour confirmer votre location avec votre pièce d'identité.
          </div>

          <p style="font-size: 10px; color: #666; margin-top: 40px;">
            Transaction Matrix ID: ${bookingData._id} <br />
            © 2026 Dubai Rent Cars Platform. All rights reserved.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error("Dispatch Error:", error)
      return { success: false, error }
    }

    return { success: true, data }
  } catch (err) {
    return { success: false, error: err }
  }
}
