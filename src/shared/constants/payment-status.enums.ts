// Define the enum
enum PaymentStatus {
  PENDING = "PENDING",       // Initiated, awaiting customer action or webhook confirmation
  PAID = "PAID",             // Funds captured / confirmed (or SUCCEEDED)
  FAILED = "FAILED",         // Card declined, insufficient funds, or gateway rejected
  CANCELED = "CANCELED",     // User aborted checkout
  REFUNDED = "REFUNDED",     // Money returned to customer
}
const PaymentStatusValues = Object.values(PaymentStatus);

// Export the enum and its values
export { PaymentStatus, PaymentStatusValues };

export default PaymentStatus ;