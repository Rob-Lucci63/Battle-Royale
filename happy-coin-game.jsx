import { useState, useEffect, useRef } from "react";

export default function HappyCoin() {
  const [coins, setCoins] = useState(100);
  const [owned, setOwned] = useState(0);
  const [price, setPrice] = useState(10);
  const [priceHistory, setPriceHistory] = useState([]);
  const canvasRef = useRef(null);

  // بارگذاری ذخیره‌شده
  useEffect(() => {
    const saved = localStorage.getItem("happyCoinSave");
    if (saved) {
      const data = JSON.parse(saved);
      setCoins(data.coins);
      setOwned(data.owned);
      setPrice(data.price);
      setPriceHistory(data.priceHistory || []);
    }
  }, []);

  // ذخیره سازی
  useEffect(() => {
    const data = { coins, owned, price, priceHistory };
    localStorage.setItem("happyCoinSave", JSON.stringify(data));
  }, [coins, owned, price, priceHistory]);

  // تغییر قیمت و اضافه کردن به تاریخچه
  useEffect(() => {
    const interval = setInterval(() => {
      setPrice((prev) => {
        const change = Math.floor(Math.random() * 5 - 2);
        const newPrice = Math.max(1, prev + change);
        setPriceHistory((prevHistory) => [...prevHistory.slice(-19), newPrice]);
        return newPrice;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // رسم خط ترید ساده روی canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (priceHistory.length < 2) return;

    const maxPrice = Math.max(...priceHistory);
    const minPrice = Math.min(...priceHistory);

    ctx.beginPath();
    priceHistory.forEach((p, i) => {
      const x = (i / (priceHistory.length - 1)) * canvas.width;
      const y = canvas.height - ((p - minPrice) / (maxPrice - minPrice || 1)) * canvas.height;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = "#4BC0C0";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [priceHistory]);

  const buy = () => {
    if (coins >= price) {
      setCoins(coins - price);
      setOwned(owned + 1);
    }
  };

  const sell = () => {
    if (owned > 0) {
      setCoins(coins + price);
      setOwned(owned - 1);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">🎮 Happy Coin</h1>
      <p className="text-xl mb-2">💰 موجودی: {coins} HC</p>
      <p className="text-xl mb-2">🪙 داری: {owned} HC</p>
      <p className="text-xl mb-4">قیمت فعلی: {price} HC</p>
      <div className="flex gap-4 mb-6">
        <button onClick={buy} className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded">
          خرید
        </button>
        <button onClick={sell} className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded">
          فروش
        </button>
      </div>
      <canvas ref={canvasRef} width={400} height={200} className="border border-gray-700 rounded" />
    </div>
  );
}
