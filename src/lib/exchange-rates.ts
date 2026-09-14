export type ExchangeRates = {
  usdToTry: number;
  eurToTry: number;
  source: "tcmb" | "frankfurter" | "fallback";
  updatedAt: string;
};

const FALLBACK_RATES: ExchangeRates = {
  usdToTry: 36.5,
  eurToTry: 39.2,
  source: "fallback",
  updatedAt: new Date(0).toISOString(),
};

function parseTcmbForexSelling(xml: string, code: "USD" | "EUR"): number | null {
  const pattern = new RegExp(
    `CurrencyCode="${code}"[\\s\\S]*?<ForexSelling>([\\d.]+)</ForexSelling>`,
  );
  const match = xml.match(pattern);
  if (!match) return null;

  const value = Number.parseFloat(match[1]);
  return Number.isFinite(value) && value > 0 ? value : null;
}

async function fetchTcmbRates(): Promise<ExchangeRates | null> {
  try {
    const response = await fetch("https://www.tcmb.gov.tr/kurlar/today.xml", {
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const xml = await response.text();
    const usdToTry = parseTcmbForexSelling(xml, "USD");
    const eurToTry = parseTcmbForexSelling(xml, "EUR");

    if (!usdToTry || !eurToTry) return null;

    return {
      usdToTry,
      eurToTry,
      source: "tcmb",
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

async function fetchFrankfurterRates(): Promise<ExchangeRates | null> {
  try {
    const [usdResponse, eurResponse] = await Promise.all([
      fetch("https://api.frankfurter.app/latest?from=USD&to=TRY", {
        next: { revalidate: 3600 },
      }),
      fetch("https://api.frankfurter.app/latest?from=EUR&to=TRY", {
        next: { revalidate: 3600 },
      }),
    ]);

    if (!usdResponse.ok || !eurResponse.ok) return null;

    const usdData = (await usdResponse.json()) as { rates?: { TRY?: number } };
    const eurData = (await eurResponse.json()) as { rates?: { TRY?: number } };
    const usdToTry = usdData.rates?.TRY;
    const eurToTry = eurData.rates?.TRY;

    if (!usdToTry || !eurToTry) return null;

    return {
      usdToTry,
      eurToTry,
      source: "frankfurter",
      updatedAt: new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export async function getExchangeRates(): Promise<ExchangeRates> {
  const tcmbRates = await fetchTcmbRates();
  if (tcmbRates) return tcmbRates;

  const frankfurterRates = await fetchFrankfurterRates();
  if (frankfurterRates) return frankfurterRates;

  return {
    ...FALLBACK_RATES,
    updatedAt: new Date().toISOString(),
  };
}

export function getFallbackExchangeRates(): ExchangeRates {
  return { ...FALLBACK_RATES };
}
