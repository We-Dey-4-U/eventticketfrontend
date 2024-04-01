document.addEventListener('DOMContentLoaded', function () {
    // Initialize Stripe with your public key
    const stripe = Stripe('your_stripe_public_key');

    // Initialize PayPal with your client ID
    paypal.Buttons({
        createOrder: function(data, actions) {
            // Set up the transaction details
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        value: '10.00' // Sample amount
                    }
                }]
            });
        },
        onApprove: function(data, actions) {
            // Capture the funds from the transaction
            return actions.order.capture().then(function(details) {
                // Handle successful payment
                console.log('Transaction completed by ' + details.payer.name.given_name);
            });
        }
    }).render('#paypal-button-container');

    // Hide payment forms initially
    const paymentFormsContainer = document.getElementById('paymentForms');
    const paypalForm = document.createElement('div');
    const stripeForm = document.createElement('div');
    paypalForm.innerHTML = '<h3>PayPal Payment Form</h3><p>Insert your PayPal payment form here...</p>';
    stripeForm.innerHTML = '<h3>Stripe Payment Form</h3><p>Insert your Stripe payment form here...</p>';
    paypalForm.style.display = 'none'; // Hide PayPal form initially
    paymentFormsContainer.appendChild(paypalForm);
    paymentFormsContainer.appendChild(stripeForm);

    // Event listener for PayPal button
    document.getElementById('paypalButton').addEventListener('click', function () {
        paypalForm.style.display = 'block'; // Show PayPal form
        stripeForm.style.display = 'none'; // Hide Stripe form
        document.getElementById('paymentMethodText').textContent = 'PayPal';
    });

    // Event listener for Stripe button
    document.getElementById('stripeButton').addEventListener('click', function () {
        paypalForm.style.display = 'none'; // Hide PayPal form
        stripeForm.style.display = 'block'; // Show Stripe form
        document.getElementById('paymentMethodText').textContent = 'Stripe';
    });
});