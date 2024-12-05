import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51QScTuAS3syI8LKAemwcqDNseLcTJLxIBOzK79Pk8KU3W1QJmiuB9s5wa4XpHQRJPAOyIOvHaPiAzNGwckQ7t9Tt009fq6w10D');

export default stripePromise;
