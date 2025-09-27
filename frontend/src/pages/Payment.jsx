import React, { useState, useMemo, useEffect } from "react";
// We need to use useCart here to clear the cart after payment submission
import { useCart } from "../store/cartContext";
import { useNavigate } from "react-router-dom";

// --- START: Utility for Simple Obfuscation (Base64) ---
// Note: This is NOT secure encryption, only obfuscation for display purposes.
const OBFS_EMAIL = 'dnNmb29kc0BnbWFpbC5jb20='; // Base64 for vsfoods@gmail.com
const OBFS_PHONE = 'KDU1NSkgMTIzLTQ1Njc='; // Base64 for (555) 123-4567

function decode(obfuscatedString) {
    try {
        return atob(obfuscatedString);
    } catch {
        return "Decoding Error";
    }
}
// --- END: Utility for Simple Obfuscation (Base64) ---


// --- START: Order ID Tracking (Simulated Persistence) ---
// In a real application, this count would be stored in a database (like Firestore)
// and fetched on app load to ensure global uniqueness and sequence integrity.
// Here we simulate it using localStorage for demonstration purposes.
function getNextOrderSequence() {
    const today = new Date();
    // Month is 0-indexed, so add 1. Pad with '0'.
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2); // Last 2 digits of year

    const datePrefix = `${month}${year}`; // e.g., 0825 (August 2025)

    // Load state from localStorage. Initialize if needed.
    const savedState = JSON.parse(localStorage.getItem('vsf_order_tracker') || 'null');

    let tracker = { prefix: datePrefix, count: 0 };
    if (savedState && savedState.prefix === datePrefix) {
        tracker = savedState;
    }

    // IMPORTANT: The count is incremented here, assuming a successful order completion.
    // In a real app, this increment should happen AFTER successful payment/order creation.
    tracker.count += 1;
    localStorage.setItem('vsf_order_tracker', JSON.stringify(tracker));

    // Pad count with leading zeros (e.g., 01, 02, 10, 100)
    const sequence = String(tracker.count).padStart(2, '0');

    return `${datePrefix}${sequence}`; // e.g., 082501
}
// --- END: Order ID Tracking ---


// Utility for displaying modal messages instead of alert()
const useModal = () => {
  const [message, setMessage] = useState(null);
  const showModal = (content) => setMessage(content);
  const closeModal = () => setMessage(null);
  const Modal = () => {
    if (!message) return null;
    return (
      <div
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000,
          display: 'flex', justifyContent: 'center', alignItems: 'center'
        }}
      >
        <div
          style={{
            backgroundColor: '#fff', padding: '20px', borderRadius: '12px',
            maxWidth: '400px', width: '90%', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ marginBottom: '15px', whiteSpace: 'pre-wrap' }}>
            {message}
          </div>
          <button
            onClick={closeModal}
            className="btn primary"
            style={{ width: '100%', height: '48px' }}
          >
            Close
          </button>
        </div>
      </div>
    );
  };
  return { showModal, Modal };
};


export default function Payment() {
  const { showModal, Modal } = useModal();
  const [method, setMethod] = useState("zelle"); // Default to Zelle as requested
  const [requiredDate, setRequiredDate] = useState(''); // New state for date

  // Decode the contact details once for use in the UI and submission logic
  const zelleEmail = useMemo(() => decode(OBFS_EMAIL), []);
  const zellePhone = useMemo(() => decode(OBFS_PHONE), []);

  let cartCtx = {};
  try { cartCtx = useCart(); } catch {}
  const cart = Array.isArray(cartCtx?.cart) ? cartCtx.cart : [];
  const clearCart = cartCtx?.clearCart || (() => {});

  // Calculate minimum valid date (24 hours from now)
  const minDate = useMemo(() => {
    const min = new Date();
    min.setHours(min.getHours() + 24);
    return min.toISOString().split('T')[0]; // Format as YYYY-MM-DD
  }, []);

  // 1. Load contact details from local storage
  const customerDetails = useMemo(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("vsf_checkout_contact") || "null");
      return saved || {};
    } catch {
      return {};
    }
  }, []);

  // 2. Generate Order ID once on load using the new format
  const orderId = useMemo(() => {
    // We call the function here, which updates localStorage only once per checkout session.
    return getNextOrderSequence();
  }, []);

  // --- Placeholder for Backend SMS Service ---
  const sendNotificationToVaishnavi = (orderData) => {
    const backendEndpoint = '/api/send-sms';
    const vaishnaviPhoneNumber = '(555) 123-4567'; // Vaishnavi's Phone Number

    // IMPORTANT: This fetch call is for demonstration only.
    // It requires a secure backend server (Node, Python, etc.)
    // that handles the actual Twilio API integration and keys.
    console.log("--- SMS NOTIFICATION SIMULATED ---");
    console.log(`Attempting to send notification to ${vaishnaviPhoneNumber} via ${backendEndpoint}`);
    console.log("Data Payload:", orderData);

    // In a real app, you would use this structure:
    /*
    fetch(backendEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: vaishnaviPhoneNumber,
        messageType: 'NEW_ORDER',
        order: orderData
      }),
    }).catch(error => {
      console.error("Error simulating SMS notification:", error);
    });
    */
    console.log("------------------------------------");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // --- 3. Date Validation ---
    if (!requiredDate) {
        showModal("Please specify when you need the order.");
        return;
    }
    const requiredDateObj = new Date(requiredDate);
    const minDateObj = new Date(minDate);

    if (requiredDateObj < minDateObj) {
        showModal("Orders require at least 24 hours of notice. Please select a date at least one day from now.");
        return;
    }

    // --- End Date Validation ---

    const firstName = customerDetails.firstName || 'Valued';
    const fullName = `${firstName} ${customerDetails.lastName || 'Customer'}`;
    const amount = cart.length > 0 ? 'the full amount of your order' : 'a nominal amount';
    const contactPhone = customerDetails.phone || 'N/A';
    const contactEmail = customerDetails.email || 'N/A';

    // --- Order Data for Backend Notification ---
    const orderData = {
        orderId: orderId,
        customerName: fullName,
        contactPhone: contactPhone,
        contactEmail: contactEmail,
        paymentMethod: method.toUpperCase(),
        dateNeededBy: requiredDateObj.toLocaleDateString(),
        itemsCount: cart.length,
        items: cart.map(item => ({ name: item.name, quantity: item.quantity })), // Example of passing cart items
    };

    // --- Send Notification (Simulated Backend Call) ---
    sendNotificationToVaishnavi(orderData);


    const baseMessage = `Order ready in **24-48 hours** (latest date: ${requiredDateObj.toLocaleDateString()}).`;

    if (method === "zelle") {
      const message =
        `Hey ${firstName}!\n\n` +
        `Your **Order Number is: ${orderId}**\n\n` +
        `${baseMessage}\n\n` +
        `Please proceed with your Zelle payment:\n\n` +
        `Amount to Send: ${amount}\n` +
        `Recipient Name: Vaishnavi\n` +
        `Recipient Email: ${zelleEmail}\n` + // Use decoded value
        `Recipient Phone: ${zellePhone}\n\n` + // Use decoded value
        `⚠️ IMPORTANT: You MUST include your Order Number (${orderId}) in the payment memo/note. ` +
        `We will use **${contactEmail} or ${contactPhone}** to send your confirmation and pick-up details.`;

      showModal(message);

    } else if (method === "cod") {
      const message =
        `Order Placed! Hey ${firstName}!\n\n` +
        `Your **Order Number is: ${orderId}**\n\n` +
        `Payment method: **Pay at PickUp**\n\n` +
        `${baseMessage}\n\n` +
        `We have successfully recorded your order. We will use your provided phone number **${contactPhone}** ` +
        `to notify you when your order is ready for pick-up.`;

      showModal(message);

    } else {
      showModal(`Payment submitted using ${method}. Order ID: ${orderId}`);
    }

    // Clear the cart after successful order placement
    clearCart();
    // In a real app, you would navigate to an Order Confirmation page here
    // Save to localStorage for persistence
    localStorage.setItem("vsf_last_order", JSON.stringify(orderData));

    // Navigate to confirmation page
    navigate("/order-confirmation", { state: { order: orderData } });
  };

  return (
    <div className="container" style={{ maxWidth: 600, marginTop: "2rem" }}>
      <h2>Payment</h2>
      <form
        onSubmit={handleSubmit}
        className="card"
        style={{ padding: "1.5rem", display: "grid", gap: "1rem" }}
      >
        <div style={{
          padding: "0.8rem",
          background: "#ecfdf5",
          color: "#065f46",
          borderRadius: "8px",
          fontWeight: 600
        }}>
          Your Order ID (for reference): **{orderId}**
        </div>

        {/* --- MANDATORY DATE FIELD --- */}
        <div className="field">
            <label style={{ fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                When do you need this order? *
            </label>
            <input
                type="date"
                className="input"
                style={{ height: 48 }}
                value={requiredDate}
                min={minDate}
                onChange={(e) => setRequiredDate(e.target.value)}
                required
            />
            <div className="hint" style={{ marginTop: '4px' }}>
                Orders require a minimum of 24 hours notice.
            </div>
        </div>
        {/* --- END MANDATORY DATE FIELD --- */}


        {/* Zelle */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="radio"
            name="payment"
            value="zelle"
            checked={method === "zelle"}
            onChange={(e) => setMethod(e.target.value)}
            style={{ width: '1.2rem', height: '1.2rem' }}
          />
          <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Zelle (US Bank Transfer)</span>
        </label>

        {/* Show Zelle Instructions */}
        {method === "zelle" && (
          <div style={{ padding: "1rem", background: "#fef9c3", borderRadius: "8px" }}>
            <strong style={{ display: 'block', marginBottom: '0.5rem' }}>
              Zelle Payment Details:
            </strong>
            <p style={{ margin: "0.5rem 0 0" }}>
              Please send payment to **Vaishnavi** using one of the following:
            </p>
            <ul style={{ margin: '0.5rem 0 0', paddingLeft: "1.5rem", listStyleType: 'disc' }}>
              <li>Email: <b>{zelleEmail}</b></li>
              <li>Phone: <b>{zellePhone}</b></li>
            </ul>
            <p style={{ fontSize: "0.95rem", marginTop: "0.8rem", fontWeight: 500, color: "#92400e" }}>
              ⚠️ **CRITICAL:** Include Order ID **{orderId}** in the memo/note!
            </p>
          </div>
        )}

        {/* COD (Pick Up) */}
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="radio"
            name="payment"
            value="cod"
            checked={method === "cod"}
            onChange={(e) => setMethod(e.target.value)}
            style={{ width: '1.2rem', height: '1.2rem' }}
          />
          <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Pay at PickUp</span>
        </label>

        {/* Placeholder for Card Payment (removed radio button but kept logic hook) */}
        <input type="hidden" name="payment" value="card" />

        <button
          className="btn primary"
          style={{ marginTop: "1rem", height: 52 }}
          onClick={handleSubmit}
        >
          {/* Change button text based on method */}
          {method === 'zelle' ? 'Place Order & Pay Now' : 'Place Order'}
        </button>
      </form>

      <Modal />
    </div>
  );
}
