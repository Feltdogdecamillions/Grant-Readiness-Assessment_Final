import { useState, useEffect } from 'react';

export interface PromotionState {
  promoActive: boolean;
  regularPriceCents: number;
  promoPriceCents: number;
  promoName: string;
  endsAt: Date | null;
  loading: boolean;
  timeLeft: { days: number; hours: number; minutes: number; seconds: number };
}

// Target deadline in America/New_York (the promo_ends_at value from the database
// already represents that instant); the countdown ticks against the real clock.
function computeTimeLeft(endsAt: Date | null) {
  if (!endsAt) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const distance = endsAt.getTime() - Date.now();
  if (distance <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((distance % (1000 * 60)) / 1000),
  };
}

export function usePromotion(): PromotionState {
  const [settings, setSettings] = useState<{
    promoActive: boolean;
    regularPriceCents: number;
    promoPriceCents: number;
    promoName: string;
    endsAt: Date | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    let cancelled = false;

    const fetchSettings = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/promotion_settings?id=eq.1&select=promo_enabled,promo_price_cents,regular_price_cents,promo_starts_at,promo_ends_at,promo_name`,
          {
            headers: {
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            },
          }
        );
        if (!response.ok) throw new Error(`Request failed (${response.status})`);
        const rows = await response.json();
        if (!Array.isArray(rows) || rows.length === 0) throw new Error('No settings');
        const s = rows[0];
        if (cancelled) return;
        const endsAt = new Date(s.promo_ends_at);
        const startsAt = new Date(s.promo_starts_at);
        const now = Date.now();
        setSettings({
          promoActive: s.promo_enabled && now >= startsAt.getTime() && now <= endsAt.getTime(),
          regularPriceCents: s.regular_price_cents,
          promoPriceCents: s.promo_price_cents,
          promoName: s.promo_name,
          endsAt,
        });
      } catch {
        if (!cancelled) {
          setSettings({
            promoActive: false,
            regularPriceCents: 9700,
            promoPriceCents: 0,
            promoName: '',
            endsAt: null,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSettings();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const target = settings?.endsAt ?? null;
    const update = () => setTimeLeft(computeTimeLeft(target));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [settings?.endsAt]);

  return {
    promoActive: settings?.promoActive ?? false,
    regularPriceCents: settings?.regularPriceCents ?? 9700,
    promoPriceCents: settings?.promoPriceCents ?? 0,
    promoName: settings?.promoName ?? '',
    endsAt: settings?.endsAt ?? null,
    loading,
    timeLeft,
  };
}
