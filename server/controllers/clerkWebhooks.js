import User from "../models/User.js";
import { Webhook } from "svix";

// const clerkWebhooks = async (req, res) => {
//   try {
//     // create a Svix instance with clerk webhook secret
//     const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

//     // getting headers
//     const headers = {
//       "svix-id": req.headers["svix-id"],
//       "svix-timestamp": req.headers["svix-timestamp"],
//       "svix-signature": req.headers["svix-signature"],
//     };

//     // verifying the headers
//     await whook.verify(JSON.stringify(req.body), headers);

//     // getting data from req body
//     const { data, type } = req.body;

//     const userData = {
//       _id: data.id,
//       email: data.email_addresses[0].email_address,
//       username: data.first_name + " " + data.last_name,
//       image: data.image_url,
//     };

//     // switch case for different events
//     switch (type) {
//       case value:
//       case "user.created": {
//         await User.create(userData);
//         break;
//       }
//       case "user.updated": {
//         await User.findByIdAndUpdate(data._id, userData);
//         break;
//       }
//       case "user.deleted": {
//         await User.findByIdAndDelete(data._id);
//         break;
//       }
//       default:
//         break;
//     }
//     res.json({ success: true, message: "Webhook received" });
//   } catch (error) {}
//   console.log(error.message);
//   res.json({ success: false, message: error.message });
// };

const clerkWebhooks = async (req, res) => {
  try {
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    const headers = {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    };
    const payloadBuffer = req.body;
    await whook.verify(payloadBuffer, headers);

    const { data, type } = JSON.parse(payloadBuffer.toString());

    const userData = {
      _id: data.id,
      email: data.email_addresses[0].email_address,
      username: data.first_name + " " + data.last_name,
      image: data.image_url,
    };

    switch (type) {
      case "user.created": {
        await User.updateOne(
          { _id: userData._id },
          { $set: userData },
          { upsert: true }
        );

        break;
      }
      case "user.updated": {
        await User.findByIdAndUpdate(data.id, userData);
        break;
      }
      case "user.deleted": {
        const deleted = await User.findByIdAndDelete(data.id);
        if (!deleted) {
          // User not found, already deleted or never created
          console.log(`User not found for deletion: ${data.id}`);
        }

        break;
      }
      default:
        break;
    }
    res.json({ success: true, message: "Webhook received" });
  } catch (error) {
    console.log(error.message);
    res.status(400).json({ success: false, message: error.message });
  }
};

export default clerkWebhooks;
