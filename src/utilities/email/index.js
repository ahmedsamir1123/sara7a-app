import nodeMailer from 'nodemailer';

export async function sendmail({to,subject,html}) {
    const transporter = nodeMailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: "mr.ahmed6666@gmail.com",
            pass: "sfnl ebwl psyp vpms"
        }
    });
    await transporter.sendMail({
        from:"'sara7a app'<mr.ahmed6666@gmail.com>",
        to,
        subject,
        html
    })

}