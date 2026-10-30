import React, { useState } from "react";
import { request } from "./api";
import { useResource } from "./useResource";
import {
  ActionBar,
  AppActionLinks,
  money,
  ResourceState,
  Sheet,
  VerifiedEmail,
} from "./components";
import { EmailGate, useWebSession } from "./WebSession";
import { openPaystackCheckout } from "./paystack";

const pending = (receipt) =>
  ["PENDING", "AWAITING_TRANSFER"].includes(receipt.status);
const STATUS_TEXT = {
  PENDING: "Waiting for payment",
  AWAITING_TRANSFER: "Waiting for payment",
  EXPIRED: "Checkout expired",
  FAILED: "Payment not completed",
  REFUND_REQUIRED: "Your payment needs a refund",
  REFUNDED: "Payment refunded",
};

function PassCard({ pass, title }) {
  return (
    <div className="web-pass">
      <h3>{title}</h3>
      <img
        src={pass.qrImage}
        alt={`QR code for ${title}`}
        width="256"
        height="256"
      />
      <p>
        {pass.isUsed
          ? "Already checked in"
          : "Present this QR code at check-in"}
      </p>
      <a
        className="web-text-link"
        href={pass.qrImage}
        download={`GatherGo-${pass.id}.png`}
      >
        Save QR image ↓
      </a>
    </div>
  );
}

function CheckoutConfirmation({ receipt, config, session }) {
  const donation = receipt.paymentType === "DONATION";
  const foodBank = receipt.event?.registrationType === "foodbank";
  return (
    <div className="web-checkout-confirmation">
      {receipt.event && (
        <p className="web-confirmation-event">{receipt.event.title}</p>
      )}
      {donation && (
        <p>
          Your donation is confirmed.
          {foodBank
            ? " Your receipt is not a meal pass. Meals are free and can be claimed in the app."
            : ""}
        </p>
      )}
      <div className="web-passes">
        {receipt.tickets.map((pass) => (
          <PassCard key={pass.id} pass={pass} title={pass.eventTicket.type} />
        ))}
        {receipt.registrations.map((pass) => (
          <PassCard key={pass.id} pass={pass} title="Event registration" />
        ))}
      </div>
      {receipt.event && (
        <div className="web-confirmation-next">
          <h3>
            {foodBank
              ? "Claim your meal pass in gathergo app"
              : donation
              ? "Follow the impact in GatherGo"
              : "Your next step: GatherGo"}
          </h3>
          <AppActionLinks
            path={
              foodBank
                ? `/food-bank/${receipt.event.id}`
                : `/event/${receipt.event.id}?openFeed=1`
            }
            config={config}
          />
          <p className="web-fine-print">
            {session.existingAccount
              ? "Sign in to your GatherGo account to see this activity."
              : `Sign up with ${session.email} to keep this activity in GatherGo.`}
          </p>
        </div>
      )}
    </div>
  );
}

function Receipt({ id, config }) {
  const { session, clear } = useWebSession();
  const resource = useResource(`/public/checkouts/${encodeURIComponent(id)}`, {
    pollWhile: pending,
  });
  const [busy, setBusy] = useState(false);
  const [openingPayment, setOpeningPayment] = useState(false);
  const [error, setError] = useState(null);
  const [confirmationDismissed, setConfirmationDismissed] = useState(false);
  const pay = async (accessCode) => {
    setOpeningPayment(true);
    setError(null);
    const refresh = () => {
      setOpeningPayment(false);
      resource.refresh();
    };
    const failed = (failure) => {
      setOpeningPayment(false);
      setError(failure);
    };
    try {
      await openPaystackCheckout(accessCode, {
        onLoad: () => setOpeningPayment(false),
        onSuccess: refresh,
        onCancel: refresh,
        onError: failed,
      });
    } catch (failure) {
      failed(failure);
    }
  };
  const cancel = async () => {
    setBusy(true);
    setError(null);
    try {
      await request(`/public/checkouts/${id}/cancel`, { method: "POST" });
      resource.refresh();
    } catch (failure) {
      setError(failure);
    } finally {
      setBusy(false);
    }
  };
  if (resource.error?.status === 401)
    return (
      <div className="web-state">
        <p>Your email session expired.</p>
        <button className="web-button" onClick={clear}>
          Verify email again
        </button>
      </div>
    );
  return (
    <ResourceState resource={resource}>
      {(receipt) => {
        const donation = receipt.paymentType === "DONATION";
        const foodBank = receipt.event?.registrationType === "foodbank";
        const success = receipt.status === "SUCCESS";
        return (
          <div className="web-receipt web-event-page">
            <p className="web-eyebrow">
              {donation ? "Donation receipt" : "Your event confirmation"}
            </p>
            <span className={`web-success-mark ${success ? "" : "pending"}`}>
              {success ? "✓" : "…"}
            </span>
            <h1>
              {success
                ? donation
                  ? "Thank you for giving."
                  : "You’re part of it."
                : STATUS_TEXT[receipt.status]}
            </h1>
            <VerifiedEmail />
            {receipt.event && <h2>{receipt.event.title}</h2>}
            <dl className="web-price-breakdown">
              <div>
                <dt>
                  {donation
                    ? "Donation"
                    : receipt.paymentType === "REGISTRATION"
                    ? "Registration"
                    : "Tickets"}
                </dt>
                <dd>{money(receipt.baseAmount / 100)}</dd>
              </div>
              <div>
                <dt>Checkout fees</dt>
                <dd>{money((receipt.amount - receipt.baseAmount) / 100)}</dd>
              </div>
              <div className="web-price-total">
                <dt>{success ? "Total paid" : "Total to pay"}</dt>
                <dd>{money(receipt.amount / 100)}</dd>
              </div>
            </dl>
            <p>
              {success
                ? donation
                  ? "Your donation is confirmed."
                  : "Your passes are ready. A confirmation email is also queued for delivery."
                : pending(receipt)
                ? "Your confirmation will appear here once Paystack confirms payment. This page updates automatically."
                : receipt.status === "REFUND_REQUIRED"
                ? "Your payment was received, but a pass could not be issued. The organiser can help you follow up on the refund."
                : "No new pass has been issued from this checkout."}
            </p>
            <p className="web-fine-print">Reference: {receipt.id}</p>
            {pending(receipt) && receipt.paymentAccessCode && (
              <ActionBar>
                <button
                  className="web-button"
                  disabled={openingPayment || busy}
                  onClick={() => pay(receipt.paymentAccessCode)}
                >
                  {openingPayment ? "Opening Paystack…" : "Pay with Paystack"}
                </button>
              </ActionBar>
            )}
            {!success && (
              <div className="web-inline-actions">
                <button
                  className="web-button secondary"
                  onClick={resource.refresh}
                >
                  Check payment status
                </button>
                {pending(receipt) && !donation && (
                  <button
                    className="web-text-button"
                    disabled={busy || openingPayment}
                    onClick={cancel}
                  >
                    {busy ? "Cancelling…" : "Cancel checkout"}
                  </button>
                )}
              </div>
            )}
            {success && (
              <ActionBar>
                <button
                  className="web-button"
                  onClick={() => setConfirmationDismissed(false)}
                >
                  {donation
                    ? "View receipt & next steps"
                    : "View passes & next steps"}
                </button>
              </ActionBar>
            )}
            {pending(receipt) && receipt.paymentUrl && (
              <a className="web-text-link" href={receipt.paymentUrl}>
                Open secure payment page ↗
              </a>
            )}
            {error && (
              <p className="web-error" role="alert">
                {error.message}
              </p>
            )}
            {receipt.event && (
              <a
                className="web-text-link web-back-to-event"
                href={
                  foodBank
                    ? `/food-bank/${receipt.event.id}`
                    : `/event/${receipt.event.id}`
                }
              >
                Back to event →
              </a>
            )}
            {success && !confirmationDismissed && (
              <Sheet
                className="web-checkout-sheet"
                title={donation ? "Donation confirmed" : "Checkout complete"}
                onClose={() => setConfirmationDismissed(true)}
              >
                <CheckoutConfirmation
                  receipt={receipt}
                  config={config}
                  session={session}
                />
              </Sheet>
            )}
          </div>
        );
      }}
    </ResourceState>
  );
}

export default function ReceiptPage(props) {
  return (
    <div className="web-receipt-shell">
      <EmailGate>
        <Receipt {...props} />
      </EmailGate>
    </div>
  );
}
