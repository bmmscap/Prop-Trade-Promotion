import React, { useState, useEffect } from 'react';
import { MarketQuote } from '../types';
import Card from './shared/Card';
import { ChartIcon } from './icons/Icons';

interface MarketDataProps {
    initialMarketData: MarketQuote[];
}

const MarketData: React.FC<MarketDataProps> = ({ initialMarketData }) => {
    const [marketData, setMarketData] = useState<MarketQuote[]>(initialMarketData);

    useEffect(() => {
        const interval = setInterval(() => {
            setMarketData(prevData =>
                prevData.map(quote => {
                    const tick = (Math.random() - 0.5) * (quote.price * 0.0001);
                    const newPrice = parseFloat((quote.price + tick).toFixed(2));
                    const initialPrice = quote.price - quote.change;
                    const newChange = newPrice - initialPrice;
                    const newChangePercent = (newChange / initialPrice) * 100;

                    return {
                        ...quote,
                        price: newPrice,
                        change: parseFloat(newChange.toFixed(2)),
                        changePercent: parseFloat(newChangePercent.toFixed(2)),
                    };
                })
            );
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <Card title="Market Quotes" icon={<ChartIcon />}>
            <div className="space-y-3">
                {marketData.map(quote => (
                    <div key={quote.symbol} className="flex justify-between items-center text-sm">
                        <span className="font-bold text-white">{quote.symbol}</span>
                        <span className="font-mono text-gray-200">{quote.price.toFixed(2)}</span>
                        <span className={`font-semibold w-24 text-right ${quote.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {quote.change >= 0 ? '+' : ''}{quote.change.toFixed(2)} ({quote.changePercent.toFixed(2)}%)
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default MarketData;
