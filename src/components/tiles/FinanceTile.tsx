import type { FinanceQuote, TileSize } from "../../types/content";
import { TileFrame } from "./TileFrame";

function QuoteRow({ quote }: { quote: FinanceQuote }) {
  const positive = quote.changePercent >= 0;
  return (
    <div className="market-row">
      <div>
        <strong>{quote.symbol}</strong>
        <span>{quote.name}</span>
      </div>
      <div>
        <strong>{quote.value}</strong>
        <span className={positive ? "market-up" : "market-down"}>{positive ? "+" : ""}{quote.changePercent.toFixed(2)}%</span>
      </div>
    </div>
  );
}

export function FinanceTile({ size, quotes }: { size: TileSize; quotes: FinanceQuote[] }) {
  const indices = quotes.filter((quote) => quote.type !== "crypto").slice(0, size === "large" ? 4 : 3);
  return (
    <TileFrame size={size} className="market-tile" ariaLabel="Börsenkurse">
      <p className="eyebrow">Börse · keine Finanzberatung</p>
      <h2 className="tile-title-small">Märkte</h2>
      <div className="market-list">
        {(indices.length ? indices : quotes.slice(0, 3)).map((quote) => (
          <QuoteRow quote={quote} key={quote.symbol} />
        ))}
      </div>
    </TileFrame>
  );
}

export function CryptoTile({ size, quotes }: { size: TileSize; quotes: FinanceQuote[] }) {
  const cryptos = quotes.filter((quote) => quote.type === "crypto").slice(0, size === "small" ? 1 : 3);
  return (
    <TileFrame size={size} className="market-tile" ariaLabel="Kryptowährungen">
      <p className="eyebrow">Krypto · keine Finanzberatung</p>
      <h2 className="tile-title-small">Krypto</h2>
      <div className="market-list">
        {(cryptos.length ? cryptos : quotes.slice(-2)).map((quote) => (
          <QuoteRow quote={quote} key={quote.symbol} />
        ))}
      </div>
    </TileFrame>
  );
}
