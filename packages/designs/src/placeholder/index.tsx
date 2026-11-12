import {
  routes,
  type DesignComponents,
  type DesignSwitcherProps,
  type ListingDetailProps,
  type ListingListProps,
  type ProviderProfileProps,
  type SearchBarProps,
  type ShellProps,
} from "@bloom/design-kit";
import { trackAttrs } from "@bloom/tracking";
import { formatMoney } from "../format";
import s from "./styles.module.css";

// Placeholder pages for everything after launch (listings, providers, search).
// No Figma exists for these yet, so every design reuses them until it does.

function Shell({ children, designSwitcher }: ShellProps) {
  return (
    <div className={s.root}>
      <header className={s.header}>
        <a href={routes.home()} className={s.logo}>
          bloom
        </a>
        {designSwitcher}
      </header>
      <main className={s.main}>{children}</main>
    </div>
  );
}

function SearchBar({ value, cities }: SearchBarProps) {
  return (
    <form className={s.search} action="/" method="get">
      <input className={s.input} name="q" defaultValue={value.text} placeholder="Search listings" />
      <select className={s.input} name="city" defaultValue={value.city ?? ""}>
        <option value="">All cities</option>
        {cities.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>
      <button className={s.button}>Search</button>
    </form>
  );
}

function ListingCards({ listings }: { listings: ListingListProps["listings"] }) {
  return (
    <ul className={s.grid}>
      {listings.map((l) => (
        <li key={l.id}>
          <a href={routes.listing(l.id)} className={s.card} {...trackAttrs("listing_click", { listingId: l.id })}>
            <span className={s.tag}>{l.category}</span>
            <h3 className={s.title}>{l.title}</h3>
            <p className={s.meta}>{l.city}</p>
            <p className={s.price}>{formatMoney(l.price)}</p>
          </a>
        </li>
      ))}
    </ul>
  );
}

function ListingList({ listings, total }: ListingListProps) {
  return (
    <section>
      <p className={s.count}>{total} listings</p>
      <ListingCards listings={listings} />
    </section>
  );
}

function ListingDetail({ listing, provider }: ListingDetailProps) {
  return (
    <article className={s.detail}>
      <span className={s.tag}>{listing.category}</span>
      <h1>{listing.title}</h1>
      <p className={s.meta}>{listing.city}</p>
      <p className={s.price}>{formatMoney(listing.price)}</p>
      <p>{listing.description}</p>
      <p className={s.meta}>
        Listed by <a href={routes.provider(provider.slug)}>{provider.name}</a>
      </p>
      {provider.phone && (
        <a
          href={`tel:${provider.phone}`}
          className={s.button}
          {...trackAttrs("contact_click", { listingId: listing.id })}
        >
          Call {provider.name}
        </a>
      )}
    </article>
  );
}

function ProviderProfile({ provider, listings }: ProviderProfileProps) {
  return (
    <section>
      <div className={s.detail}>
        <h1>{provider.name}</h1>
        <p className={s.meta}>{provider.city}</p>
        <p>{provider.description}</p>
        {provider.phone && (
          <a
            href={`tel:${provider.phone}`}
            className={s.button}
            {...trackAttrs("contact_click", { providerId: provider.id })}
          >
            Call
          </a>
        )}
      </div>
      <ListingCards listings={listings} />
    </section>
  );
}

function DesignSwitcher({ options, selected, action }: DesignSwitcherProps) {
  return (
    <form className={s.switcher} action={action}>
      <select className={s.input} name="design" defaultValue={selected}>
        <option value="auto">Automatic</option>
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
      <button className={s.button}>Apply</button>
    </form>
  );
}

export const placeholderComponents: Omit<DesignComponents, "ComingSoon"> = {
  Shell,
  SearchBar,
  ListingList,
  ListingDetail,
  ProviderProfile,
  DesignSwitcher,
};
