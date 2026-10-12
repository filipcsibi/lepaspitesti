export function HomeIcon() {
  return (
    <svg viewBox="0 0 20 20" width="100%" height="100%" fill="none" aria-hidden="true">
      <path
        d="M3 8.6 10 3l7 5.6V17a1 1 0 0 1-1 1h-3.6v-5.2H7.6V18H4a1 1 0 0 1-1-1V8.6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" data-open={open}>
      <path d="M2 4h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M2 8h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M2 12h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowLeftIcon() {
  return (
    <svg viewBox="0 0 17 13" width="17" height="13" fill="none" aria-hidden="true">
      <path
        d="M16 6.5H1.5M1.5 6.5 6.5 1.5M1.5 6.5l5 5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true">
      <path
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
