import React, { useState } from "react";
import { useResource } from "./useResource";
import {
  ActionBar,
  AppActions,
  eventDate,
  money,
  ResourceState,
  Sheet,
} from "./components";
import { EmailGate } from "./WebSession";
import { eventActions } from "./event-actions";
import Participation from "./Participation";

const TITLES = {
  tickets: "Choose your tickets",
  registration: "Register for this event",
  donation: "Support this event",
  volunteer: "Give your time",
  meals: "Claim a meal",
  live: "Open event Live",
  app: "Get GatherGo",
  details: "Event details",
};

function EventDetails({ event }) {
  return (
    <div className="web-event-details">
      <p className="web-organiser">
        Hosted by{" "}
        {event.creator.fullName ??
          event.creator.username ??
          "a GatherGo organiser"}
      </p>
      <div className="web-event-facts">
        <p>
          <span>When</span>
          {eventDate(event.startDate, event.foodBankTimeZone)}
          <small>
            Until {eventDate(event.endDate, event.foodBankTimeZone)} ·{" "}
            {event.foodBankTimeZone}
          </small>
        </p>
        <p>
          <span>Where</span>
          {event.isPhysicalEvent ? event.location : "Online event"}
        </p>
      </div>
      {event.description && (
        <section className="web-content-section">
          <h3>About this event</h3>
          <p className="web-preserve-lines">{event.description}</p>
        </section>
      )}
      {event.impactTitle && (
        <section className="web-impact">
          <p className="web-eyebrow">The impact behind it</p>
          <h3>{event.impactTitle}</h3>
          {event.impactDescription && <p>{event.impactDescription}</p>}
        </section>
      )}
      {event.registrationType === "volunteer" && (
        <section className="web-content-section">
          <h3>A place for your skills</h3>
          {event.volunteerRoles.map((role) => (
            <div className="web-role" key={role.id}>
              <h4>{role.title}</h4>
              <p>{role.description}</p>
              <small>
                {role.isOpen
                  ? `${Math.max(
                      0,
                      role.capacity - role._count.applications
                    )} places available`
                  : "Recruitment closed"}{" "}
                ·{" "}
                {role.requiresApproval
                  ? "Organiser approval required"
                  : "Join directly"}
              </small>
            </div>
          ))}
        </section>
      )}
      {event.links.length > 0 && (
        <section className="web-content-section">
          <h3>Useful links</h3>
          <div className="web-useful-links">
            {event.links.map((link) => (
              <a
                href={link}
                key={link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {new URL(link).hostname} ↗
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export default function EventPage({ id, mode, config }) {
  const resource = useResource(`/public/events/${encodeURIComponent(id)}`);
  const [action, setAction] = useState(null);
  return (
    <ResourceState resource={resource}>
      {(event) => {
        const foodBank = event.registrationType === "foodbank";
        const actions = eventActions(event, mode);
        if (mode === "meals" && !foodBank)
          return (
            <div className="web-state">
              <h1>This event is not a food bank</h1>
              <a href={`/event/${event.id}`}>View event details</a>
            </div>
          );
        return (
          <div className="web-event-page">
            <section
              className="web-event-intro"
              aria-labelledby="web-event-title"
            >
              <div className="web-event-summary">
                <p className="web-eyebrow">
                  {foodBank
                    ? "Meal collection"
                    : mode === "live"
                    ? "Live event"
                    : event.registrationType === "volunteer"
                    ? "Volunteer & give"
                    : "Gather with purpose"}
                </p>
                <h1 id="web-event-title">{event.title}</h1>
                <p className="web-event-time">
                  {eventDate(event.startDate, event.foodBankTimeZone)}
                </p>
                <p className="web-event-location">
                  {event.isPhysicalEvent ? event.location : "Online event"}
                </p>
                {actions.length > 0 && (
                  <ActionBar
                    note={
                      foodBank
                        ? "Meals are free. Donate to support the cause."
                        : null
                    }
                  >
                    {actions.map((item, index) => (
                      <button
                        key={item.id}
                        className={`web-button${index > 0 ? " secondary" : ""}`}
                        disabled={item.disabled}
                        onClick={() => setAction(item.id)}
                      >
                        {item.label}
                      </button>
                    ))}
                  </ActionBar>
                )}
                {event.registrationType === "registration" && (
                  <p className="web-action-price">
                    {event.registrationFee === 0
                      ? "Free registration"
                      : `${money(event.registrationFee)} before checkout fees`}
                  </p>
                )}
                <div className="web-event-more">
                  <button
                    className="web-text-button"
                    onClick={() => setAction("details")}
                  >
                    View event details ↗
                  </button>
                  {!foodBank && mode !== "live" && (
                    <button
                      className="web-text-button"
                      onClick={() => setAction("app")}
                    >
                      Follow in GatherGo ↗
                    </button>
                  )}
                </div>
              </div>
              <div className="web-event-cover">
                {event.imageUrl ? (
                  <img src={event.imageUrl} alt={event.title} />
                ) : (
                  <div className="web-cover-art">
                    <img src="/mascot/gogo-wave.svg" alt="" />
                    <span>
                      Good things happen
                      <br />
                      when we gather.
                    </span>
                  </div>
                )}
              </div>
            </section>
            {action && (
              <Sheet title={TITLES[action]} onClose={() => setAction(null)}>
                {action === "details" ? (
                  <EventDetails event={event} />
                ) : action === "meals" ? (
                  <AppActions
                    path={`/food-bank/${event.id}`}
                    config={config}
                    title="Get GatherGo to claim your meal"
                  >
                    <p>
                      Claim and manage your meal pass in the app. One pass per
                      account. Donate to support the cause.
                    </p>
                    <p>Already have GatherGo? Open the app to continue.</p>
                    <p>
                      Collection:{" "}
                      {event.collectionAvailability.replaceAll("_", " ")}
                    </p>
                  </AppActions>
                ) : action === "live" || action === "app" ? (
                  <AppActions
                    path={`/event/${event.id}?openFeed=1`}
                    config={config}
                    title={
                      action === "live"
                        ? "Live happens in GatherGo"
                        : "Follow this event in GatherGo"
                    }
                  >
                    <p>
                      Follow event updates, join Live and coordinate a carpool
                      in the app.
                    </p>
                  </AppActions>
                ) : (
                  <EmailGate>
                    <Participation
                      event={event}
                      action={action}
                      config={config}
                    />
                  </EmailGate>
                )}
              </Sheet>
            )}
          </div>
        );
      }}
    </ResourceState>
  );
}
