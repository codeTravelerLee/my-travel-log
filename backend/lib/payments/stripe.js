//stripe API를 위한 기본 config
import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

export const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY);
