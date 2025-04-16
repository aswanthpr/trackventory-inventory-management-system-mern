import nodemailer from "nodemailer";

export const  nodeMailer=async(email: string, data: any[])=> {
  const transporter = nodemailer?.createTransport({
    service: "Gmail",
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  const tableRows = data
    .map(
      (row: any) =>
        "<tr>" +
        Object.values(row)
          .map((val) => `<td>${val}</td>`)
          .join("") +
        "</tr>"
    )
    .join("");

  const html = `
    <h3>Exported Data</h3>
    <table border="1" cellpadding="5" cellspacing="0">
      <thead>
        <tr>${Object.keys(data[0] || {}).map((k) => `<th>${k}</th>`).join("")}</tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
  `;

  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Data",
    text: ``,
    html,
  };

  await transporter?.sendMail(mailOptions);
}