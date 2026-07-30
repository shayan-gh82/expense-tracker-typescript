import {
  Banknote, BarChart3, Bell, BriefcaseBusiness, Car, ChartPie, CreditCard, DollarSign, Download,
  Gamepad2, Gift, GraduationCap, HeartPulse, Home, Landmark, LayoutDashboard, Plus, Receipt,
  Search, Settings, ShoppingBag, TrendingDown, TrendingUp, Upload, Utensils, Wallet, WalletCards, X,
  type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
  Banknote, BarChart3, Bell, BriefcaseBusiness, Car, ChartPie, CreditCard, DollarSign, Download,
  Gamepad2, Gift, GraduationCap, HeartPulse, Home, Landmark, LayoutDashboard, Plus, Receipt,
  Search, Settings, ShoppingBag, TrendingDown, TrendingUp, Upload, Utensils, Wallet, WalletCards, X,
};

interface IconRendererProps {
  name?: string;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

const IconRenderer = ({ name = "Wallet", size = 18, className = "", strokeWidth = 2 }: IconRendererProps) => {
  const Icon = icons[name] || Wallet;
  return <Icon size={size} strokeWidth={strokeWidth} className={className} />;
};

export default IconRenderer;
export const availableIcons = Object.keys(icons).sort();
