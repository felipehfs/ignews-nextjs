import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react"
import { fauna } from "../../src/services/fauna";
import { stripe } from "../../src/services/stripe";
import { query as q, query } from "faunadb";

type User = {
    ref: {
        id: string;
    };
    data: { 
        stripe_customer_id: string;
    };
}

export default async function handleRequest(req: NextApiRequest, resp: NextApiResponse) {
    if (req.method === "POST") {
        try {
            const session = await getSession({ req });

            const user = await fauna.query<User>(
                q.Get(
                   q.Match(
                       q.Index('users_by_email'),
                       q.Casefold(session.user.email),
                   ),
                ),
            )

            let customerId = user.data.stripe_customer_id;
            if (!customerId) {
                const stripeCustomer = await stripe.customers.create({
                    email: session.user.email,
                    // metadata
                });

                await fauna.query(
                    q.Update(
                        q.Ref(q.Collection('users'), user.ref.id),
                        {
                            data: { 
                                stripe_customer_id: stripeCustomer.id,
                            }
                        }
                    )
                );
                
                customerId = stripeCustomer.id;
            }

            const stripeCheckoutSession = await stripe.checkout.sessions.create({
                customer: customerId,
                payment_method_types: ["card"],
                billing_address_collection: "required",
                line_items: [
                    { price: "price_1K4Z1OFZboC3tmVmxetcUaO0", quantity: 1},
                ],
                mode: "subscription",
                allow_promotion_codes: true,
                success_url: "http://localhost:3000/posts",
                cancel_url: "http://localhost:3000/"
            });
    
            return resp.status(200).json({ sessionID: stripeCheckoutSession.id });
        } catch (err) {
            console.log(err);
            return resp.status(400).json({ error: err });
        }
       
    } else {
        resp.setHeader("allow", "POST");
        return resp.status(405).end("method not allowed");
    }
}