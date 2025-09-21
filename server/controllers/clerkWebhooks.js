import { use } from "react";
import User from "../models/User.js";
import { Webhook } from "svix";


const clerkWebhooks = async (req, res) => {
    try{
        // create a Svix instance with clerk webhook secret
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"]

        };
        // verifying headers
        await whook.verify(JSON.stringify(req.body), headers);

        // getting data from the request body
        const {data, type} = req.body;

        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url
        }

        // switch cases for different types of events
        switch(type){
            case "user.created":{
                await User.create(userData);
                break;
            }
            case "user.updated":{
                await User.findByIdAndUpdate(userData._id, userData);
                break;
            }
            case "user.deleted":{
                await User.findByIdAndDelete(userData._id);
                break;
            }
            default:
                break;
        }
        res.json({message: true, message: "Webhook received"});

    }catch(error){
        console.log(error.message);
        res.json({message: false, message: error.message});
    }
}

export default clerkWebhooks;
