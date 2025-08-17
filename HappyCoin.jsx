import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function HappyCoin() {
  const [coins, setCoins] = useState(100);
  const [owned, setOwned] = useState(0);
  const [price, setPrice] = useState(10);
  const [priceHistory, setPriceHistory] = useState([]);

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

  const data = {
    labels: priceHistory.map((_, i) => i + 1),
    datasets: [
      {
        label: "قیمت هپی کوین",
        data: priceHistory,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">🎮 Happy Coin</h1>
      <p className="text-xl mb-2">💰 موجودی: {coins} HC</p>
      <p className="text-xl mb-4">🪙 داری: {owned} HC</p>
      <p className="text-xl mb-4">قیمت فعلی: {price} HC</p>
      <div className="flex gap-4 mb-6">
        <button onClick={buy} className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded">
          خرید
        </button>
        <button onClick={sell} className="px-6 py-2 bg-red-600 hover:bg-red-700 rounded">
          فروش
        </button>
      </div>
      <div className="w-full max-w-md">
        <Line data={data} />
      </div>
    </div>
  );
               }
