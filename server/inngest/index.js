import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import { sendEmail } from "../configs/nodeMailer.js";

// Create a client
export const inngest = new Inngest({ id: "movie-ticket-booking" });

/* ================= USER SYNC ================= */

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    await User.create({
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    });
  }
);

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {
    await User.findByIdAndDelete(event.data.id);
  }
);

const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;

    await User.findByIdAndUpdate(id, {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    });
  }
);

/* ================= RELEASE SEATS ================= */

const releaseSeatsAndDeleteBooking = inngest.createFunction(
  { id: "release-seats-delete-booking" },
  { event: "app/checkpayment" },
  async ({ event, step }) => {
    const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
    await step.sleepUntil("wait-10-minutes", tenMinutesLater);

    await step.run("check-payment-status", async () => {
      const booking = await Booking.findById(event.data.bookingId);
      if (!booking || booking.isPaid) return;

      const show = await Show.findById(booking.show);
      if (!show) return;

      booking.bookedSeats.forEach((seat) => {
        delete show.occupiedSeats[seat];
      });

      show.markModified("occupiedSeats");
      await show.save();
      await Booking.findByIdAndDelete(booking._id);
    });
  }
);

/* ================= BOOKING EMAIL ================= */

const sendBookingConfirmationEmail = inngest.createFunction(
  { id: "send-booking-confirmation-email" },
  { event: "app/show.booked" },
  async ({ event }) => {
    const { bookingId } = event.data;

    // Get booking with show + movie
    const booking = await Booking.findById(bookingId).populate({
      path: "show",
      populate: { path: "movie", model: "Movie" },
    });

    if (!booking) {
      console.error("❌ Booking not found:", bookingId);
      return;
    }

    // 🔥 FIX: manually fetch user (NO populate)
    const user = await User.findById(booking.user);

    if (!user) {
      console.error("❌ User not found:", booking.user);
      return;
    }

    try {
      await sendEmail({
        to: user.email,
        subject: `🎟️ Booking Confirmed: ${booking.show.movie.title}`,
        body: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Hi ${user.name},</h2>
          <p>Your booking for:</p>
          <h3 style="color:#F84565;">"${booking.show.movie.title}"</h3>
          <p>
            <strong>Date:</strong> ${new Date(
              booking.show.showDateTime
            ).toLocaleDateString()}<br/>
            <strong>Time:</strong> ${new Date(
              booking.show.showDateTime
            ).toLocaleTimeString()}
          </p>
          <p><strong>Seats:</strong> ${booking.bookedSeats.join(", ")}</p>
          <br/>
          <p>Enjoy the show! 🍿</p>
          <p>- MuviTic Team</p>
        </div>
        `,
      });

      console.log("✅ Booking confirmation email sent");
    } catch (err) {
      console.error("❌ Email sending failed:", err);
    }
  }
);

/* ================= REMINDERS ================= */

const sendShowReminders = inngest.createFunction(
  { id: "send-show-reminders" },
  { cron: "0 */8 * * *" },
  async ({ step }) => {
    const now = new Date();
    const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);

    const shows = await Show.find({
      showDateTime: { $gte: windowStart, $lte: in8Hours },
    }).populate("movie");

    for (const show of shows) {
      if (!show.occupiedSeats) continue;

      const userIds = [...new Set(Object.values(show.occupiedSeats))];
      const users = await User.find({ _id: { $in: userIds } });

      for (const user of users) {
        await sendEmail({
          to: user.email,
          subject: `Reminder: "${show.movie.title}" starts soon!`,
          body: `
          <div style="font-family: Arial;">
            <h2>Hello ${user.name},</h2>
            <p>Your movie <strong>${show.movie.title}</strong></p>
            <p>
              Date: ${new Date(show.showDateTime).toLocaleDateString()}<br/>
              Time: ${new Date(show.showDateTime).toLocaleTimeString()}
            </p>
            <p>It starts in about 8 hours 🎬</p>
          </div>
          `,
        });
      }
    }
  }
);

/* ================= NEW SHOW NOTIFICATION ================= */

const sendNewShowNotifications = inngest.createFunction(
  { id: "send-new-show-notifications" },
  { event: "app/show.added" },
  async ({ event }) => {
    const { movieTitle } = event.data;
    const users = await User.find({});

    for (const user of users) {
      await sendEmail({
        to: user.email,
        subject: `🎬 New Show Added: ${movieTitle}`,
        body: `
        <div style="font-family: Arial;">
          <h2>Hi ${user.name},</h2>
          <p>We added a new show:</p>
          <h3>${movieTitle}</h3>
        </div>
        `,
      });
    }
  }
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  releaseSeatsAndDeleteBooking,
  sendBookingConfirmationEmail,
  sendShowReminders,
  sendNewShowNotifications,
];