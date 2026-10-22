import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendBookingEmail({ to, room, date, start, end, reminder = false }: { to: string; room: string; date: string; start: string; end: string; reminder?: boolean }) {
  await transporter.sendMail({
    from: `"SpaceSync" <${process.env.EMAIL_USER}>`,
    to,
    subject: reminder ? "Reminder Booking SpaceSync" : "Konfirmasi Booking SpaceSync",

    html: `
      <div style="font-family:Arial;padding:24px">
        <h2>
          ${reminder ? "📅 Reminder Booking" : "🎉 Booking Berhasil"}
        </h2>

        <p>
          ${reminder ? "Besok Anda memiliki jadwal penggunaan ruangan." : "Terima kasih telah melakukan booking."}
        </p>

        <table>
          <tr>
            <td><b>Ruangan</b></td>
            <td>${room}</td>
          </tr>
          <tr>
            <td><b>Tanggal</b></td>
            <td>${date}</td>
          </tr>
          <tr>
            <td><b>Jam</b></td>
            <td>${start} - ${end}</td>
          </tr>
        </table>

        <p style="margin-top:20px">
          Jangan lupa melakukan QR Check-in saat tiba di ruangan.
        </p>
      </div>
    `,
  });
}
