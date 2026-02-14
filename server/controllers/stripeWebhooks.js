import stripe from "stripe";
import Booking from "../models/Booking.js";
import { inngest } from "../inngest/index.js";

export const stripeWebhooks = async (request, response) => {
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {

      // 🔥 CASE 1: Normal card payments
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;

        const sessionList = await stripeInstance.checkout.sessions.list({
          payment_intent: paymentIntent.id,
        });

        if (!sessionList.data.length) break;

        const session = sessionList.data[0];
        const { bookingId } = session.metadata;

        const booking = await Booking.findById(bookingId);
        if (!booking || booking.isPaid) break;

        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
          paymentLink: "",
        });

        await inngest.send({
          name: "app/show.booked",
          data: { bookingId },
        });

        break;
      }

      // 🔥 CASE 2: Handles $0 payments AND all completed checkouts
      case "checkout.session.completed": {
        const session = event.data.object;
        const { bookingId } = session.metadata;

        if (!bookingId) break;

        const booking = await Booking.findById(bookingId);
        if (!booking || booking.isPaid) break;

        await Booking.findByIdAndUpdate(bookingId, {
          isPaid: true,
          paymentLink: "",
        });

        await inngest.send({
          name: "app/show.booked",
          data: { bookingId },
        });

        break;
      }

      default:
        console.log("Unhandled event type:", event.type);
    }

    response.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    response.status(500).send("Internal Server Error");
  }
};
