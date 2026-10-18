import BookingSection from "@/components/BookingSection";
import CalBookingButton from "@/components/CalModal";

export const metadata = {
  title: "Paid 1:1 Hour · Rizwan Mahmood",
  description:
    "A paid hour of advice on one operations problem, without an engagement. $140. Considering the Diagnostic or a retainer? Book the free 30-minute fit call instead.",
};

export default function BookingPage() {
  return (
    <div style={{ paddingTop: 80 }}>
      <style>{`
        .bk-note {
          display: flex; align-items: center; justify-content: space-between; gap: 16px; flex-wrap: wrap;
          max-width: 860px; margin: 32px auto 0; padding: 18px 22px;
          background: #fff; border: 1px solid var(--line); border-left: 3px solid var(--coral); border-radius: 12px;
        }
        .bk-note p { margin: 0; color: var(--ink); font-size: 1rem; line-height: 1.5; flex: 1 1 320px; }
        .bk-note .btn-coral { flex-shrink: 0; }
        @media (max-width: 640px) { .bk-note { margin: 24px 16px 0; } }
      `}</style>
      <div className="bk-note">
        <p>
          <b>Considering the Diagnostic or a retainer?</b> Skip this and book the free
          30-minute fit call.
        </p>
        <CalBookingButton className="btn-coral">Book a free call →</CalBookingButton>
      </div>
      <BookingSection />
    </div>
  );
}
