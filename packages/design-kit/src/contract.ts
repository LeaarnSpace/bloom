import type { ComponentType, ReactNode } from "react";
import type { Listing, Provider } from "@bloom/core";

// The contract every design must implement. Pages only ever compose these
// components; how each one looks and is laid out is entirely up to the design.
// Keep it to page-level pieces so designs stay free to structure their internals.
//
// Tracking: designs never call analytics. They spread trackAttrs() from
// @bloom/tracking onto clickable elements (listing links, contact buttons) and
// link with routes below. Pages handle view/impression tracking.

export interface ShellProps {
  children: ReactNode;
  designSwitcher?: ReactNode;
}

export interface SearchBarProps {
  value: { text?: string; city?: string };
  cities: string[];
}

export interface ListingListProps {
  listings: Listing[];
  total: number;
}

export interface ListingDetailProps {
  listing: Listing;
  provider: Provider;
}

export interface ProviderProfileProps {
  provider: Provider;
  listings: Listing[];
}

export interface DesignOption {
  id: string;
  label: string;
}

export interface DesignSwitcherProps {
  options: DesignOption[];
  // The cookie value: a design id, or "auto" to follow the seasonal schedule.
  selected: string;
  activeId: string;
  action: (formData: FormData) => Promise<void>;
}

// The pre-launch page. The design owns the whole page (header to footer).
// The sign-up form must post to `signup.action` with an "email" field, and keep
// a visually hidden "website" field empty for humans (bots fill it in).
export interface ComingSoonProps {
  signup: {
    action: (formData: FormData) => Promise<void>;
    // True after a successful sign-up: show the confirmation instead of the form.
    joined: boolean;
  };
  // Lets visitors switch designs from the page. Omit to hide the toggle.
  designSwitcher?: DesignSwitcherProps;
  // Where "Contact us" sends email. Omit to show it as plain text.
  contactEmail?: string;
}

export const SIGNUP_CONFIRMATION = "You're on the list. We'll email you when Bloom opens.";

export interface DesignComponents {
  ComingSoon: ComponentType<ComingSoonProps>;
  Shell: ComponentType<ShellProps>;
  SearchBar: ComponentType<SearchBarProps>;
  ListingList: ComponentType<ListingListProps>;
  ListingDetail: ComponentType<ListingDetailProps>;
  ProviderProfile: ComponentType<ProviderProfileProps>;
  DesignSwitcher: ComponentType<DesignSwitcherProps>;
}

export interface DesignEntry extends DesignOption {
  // Lazy so only the active design's code and CSS are sent to the browser.
  load: () => Promise<DesignComponents>;
}
