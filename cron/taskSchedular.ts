import { sendEmail } from './emailService'
import db from '../server/db/connection.ts'
import moment from 'moment-timezone'

export async function startCron() {
  try {
    const currentTime = moment()
      .tz('Pacific/Auckland')
      .format('DD/MM/YYYY HH:mm')

    const expiredCapsules = await db('capsules')
      .where('time', '<', currentTime)
      .andWhere('time', '!=', '')

    if (expiredCapsules.length > 0) {
      for (const capsule of expiredCapsules) {
        const prettyTags = JSON.parse(capsule.tags).join(', ')

        const capsuleTime = moment.tz(
          capsule.time,
          'DD/MM/YYYY HH:mm',
          'Pacific/Auckland',
        )

        const isUnlocked = moment()
          .tz('Pacific/Auckland')
          .isSameOrAfter(capsuleTime)

        if (isUnlocked) {
          const media = await db('medias')
            .where('capsule_id', capsule.id)
            .select('filename')

          const user = await db('users')
            .where('auth0_id', capsule.user_id)
            .first()

          if (user) {
            const userEmail = user.email
            const subject = 'Your Capsule Lock Time Expired'
            const message = `
              <html>
    <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f9; padding: 20px;">
      <h1 style="color: #13A25B;">Kia ora ${user.name},</h1>
      <p style="font-size: 16px; line-height: 1.5;">Your capsule has been unlocked and is now available to view.</p>
      <div style="margin-top: 20px; padding: 15px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px;">
        <p style="font-size: 16px; line-height: 1.5;"> <strong>Title: </strong>${capsule.title}</p>
        <p style="font-size: 16px; line-height: 1.5;"><strong>Description:</strong> ${capsule.description}</p>
        <p style="font-size: 16px; line-height: 1.5;"><strong>Tags:</strong> <span style="font-weight: bold; color: #13A25B;">${prettyTags}</span></p>
        <p>If you have any questions or need further assistance, please don't hesitate to reach out to us at teamstalgic@gmail.com.</p>
        <p>Thank you for using Stalgic. We look forward to helping you preserve your memories.</p>
        <br>
        <p>Best regards,</p>
        <p>The <strong>Stalgic</strong> Team</p>
       <img style="width:100px; height:100px;" src="cid:logo" alt="Stalgic Logo" />

      </div>

      <div style="font-size: 12px; color: #aaa; margin-top: 30px;">
        <p>This email was sent from Stalgic App.</p>
      </div>
    </body>
  </html>
`

            await sendEmail(userEmail, subject, message, media)
          }
        }
      }
    }

    const lockedCapsules = await db('capsules')
      .where('time', '>', currentTime)
      .andWhere('time', '!=', '')

    if (lockedCapsules.length > 0) {
      for (const capsule of lockedCapsules) {
        const prettyTags = JSON.parse(capsule.tags).join(', ')
        const capsuleTime = moment.tz(
          capsule.time,
          'DD/MM/YYYY HH:mm',
          'Pacific/Auckland',
        )

        const user = await db('users')
          .where('auth0_id', capsule.user_id)
          .first()

        if (user) {
          const userEmail = user.email
          const subject = 'Reminder: You Have a Locked Capsule'
          const message = `
             <html>
    <body style="font-family: Arial, sans-serif; color: #333; background-color: #f4f4f9; padding: 20px;">
      <h1 style="color: #13A25B;">Kia ora ${user.name},</h1>
      <p style="font-size: 16px; line-height: 1.5;">Your capsule has been unlocked and is now available to view.</p>
      <div style="margin-top: 20px; padding: 15px; background-color: #ffffff; border: 1px solid #ddd; border-radius: 5px;">
        <p style="font-size: 16px; line-height: 1.5;"> <strong>Title: </strong>${capsule.title}</p>
        <p style="font-size: 16px; line-height: 1.5;"><strong>Description:</strong> ${capsule.description}</p>
        <p style="font-size: 16px; line-height: 1.5;"><strong>Tags:</strong> <span style="font-weight: bold; color: #13A25B;">${prettyTags}</span></p>
        <p>If you have any questions or need further assistance, please don't hesitate to reach out to us at teamstalgic@gmail.com.</p>
        <p>Thank you for using Stalgic. We look forward to helping you preserve your memories.</p>
        <br>
        <p>Best regards,</p>
        <p>The <strong>Stalgic</strong> Team</p>
       <img style="width:auto; height:125px;" src="cid:logo" alt="Stalgic Logo" />

      </div>

      <div style="font-size: 12px; color: #aaa; margin-top: 30px;">
        <p>This email was sent from Stalgic App.</p>
      </div>
    </body>
  </html>
          `

          await sendEmail(userEmail, subject, message)
        }
      }
    }
  } catch (error) {}
}
