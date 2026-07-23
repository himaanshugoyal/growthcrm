(function (w, d) {
  "use strict";
  var script = d.currentScript;
  var key = script && script.getAttribute("data-product-key");
  var endpoint = (script && script.src ? new URL(script.src).origin : "") + "/api/events";
  var allowedClicks = ["gclid", "fbclid", "msclkid", "ttclid"];
  var params = new URLSearchParams(w.location.search);
  var consent = script && script.getAttribute("data-consent") !== "denied";
  var memoryId = "v_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
  var visitorId = memoryId;
  try {
    visitorId = localStorage.getItem("growthos_vid") || memoryId;
    if (consent) localStorage.setItem("growthos_vid", visitorId);
  } catch {}

  var attribution = {
    landingPage: w.location.origin + w.location.pathname,
    referrer: d.referrer ? new URL(d.referrer).origin : null,
    utmSource: params.get("utm_source"),
    utmMedium: params.get("utm_medium"),
    utmCampaign: params.get("utm_campaign"),
    utmContent: params.get("utm_content"),
    utmTerm: params.get("utm_term")
  };
  allowedClicks.forEach(function (name) {
    if (params.get(name)) attribution[name] = params.get(name);
  });

  function clean(value, depth) {
    if (depth > 3 || value == null) return value;
    if (Array.isArray(value)) return value.slice(0, 20).map(function (v) { return clean(v, depth + 1); });
    if (typeof value === "object") {
      var out = {};
      Object.keys(value).slice(0, 50).forEach(function (k) {
        if (!/password|secret|token|card|content|html/i.test(k)) out[k] = clean(value[k], depth + 1);
      });
      return out;
    }
    return typeof value === "string" ? value.slice(0, 500) : value;
  }

  function send(event, properties) {
    if (!key || !consent) return Promise.resolve({ accepted: false, reason: "consent_or_key_missing" });
    return fetch(endpoint, {
      method: "POST",
      keepalive: true,
      headers: {
        "content-type": "application/json",
        "x-growthos-product-key": key,
        "idempotency-key": visitorId + "_" + event + "_" + Date.now()
      },
      body: JSON.stringify({
        event: event,
        visitorId: visitorId,
        properties: clean(properties || {}, 0),
        attribution: attribution,
        occurredAt: new Date().toISOString()
      })
    }).then(function (r) { return r.json(); });
  }

  w.GrowthOS = {
    identify: function (profile) {
      return send("lead_created", { profile: clean(profile || {}, 0) });
    },
    track: send,
    consent: function (granted) {
      consent = !!granted;
      if (consent) {
        try { localStorage.setItem("growthos_vid", visitorId); } catch {}
      }
    }
  };
})(window, document);
