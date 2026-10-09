// Define the enum
enum PaymentStatus {
PENDING = 'PENDING',       // Submitted by user, awaiting admin review
  APPROVED = 'APPROVED',     // Admin verified payment and approved
  REJECTED = 'REJECTED',     // Admin rejected payment (needs user re-upload or fix)
}
enum SubscriptionStatus {
  INACTIVE = 'INACTIVE',     // User has not paid or subscription expired
  PENDING = 'PENDING',       // Waiting for admin payment approval
  ACTIVE = 'ACTIVE',         // Fully active subscriber
  EXPIRED = 'EXPIRED',       // Subscription time period ended
}
const PaymentStatusValues = Object.values(PaymentStatus);
const SubscriptionStatusValues = Object.values(SubscriptionStatus); 
// Export the enum and its values
export { PaymentStatus, PaymentStatusValues, SubscriptionStatus, SubscriptionStatusValues };

export default PaymentStatus ;