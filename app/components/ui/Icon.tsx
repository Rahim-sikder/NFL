import React from 'react';
import { 
  LucideIcon,
  PiggyBank,
  Banknote,
  Wallet,
  Building2,
  Building,
  ReceiptText,
  FileBadge2,
  FileText,
  CreditCard,
  Calculator,
  TrendingUp,
  Info,
  Briefcase,
  Coins,
  Phone,
  Car,
  User,
  Home,
  ArrowLeft,
  Award,
  CalendarClock,
  Calendar,
  Layers,
  BarChart3,
  UserCheck,
  UserPlus,
  Bell,
  Eye,
  EyeOff,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Folder,
  Download,
  Edit2,
  Edit,
  Settings,
  X,
  Lock,
  Clock,
  CreditCard as PaymentIcon
} from 'lucide-react-native';

type IconSize = 'sm' | 'md' | 'lg' | number;

// Icon name mapping
const iconMap: Record<string, LucideIcon> = {
  PiggyBank,
  Banknote,
  Wallet,
  Building2,
  Building,
  ReceiptText,
  FileBadge2,
  FileText,
  CreditCard,
  Calculator,
  TrendingUp,
  Info,
  Briefcase,
  Coins,
  Phone,
  Car,
  User,
  Home,
  ArrowLeft,
  Award,
  CalendarClock,
  Calendar,
  Layers,
  BarChart3,
  UserCheck,
  UserPlus,
  Bell,
  Eye,
  EyeOff,
  Check,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Folder,
  Download,
  Edit2,
  Edit,
  Settings,
  X,
  Lock,
  Clock,
  PaymentIcon,
};

interface IconProps {
  icon: LucideIcon | string;
  size?: IconSize;
  color?: string;
}

const sizeMap: Record<IconSize, number> = {
  sm: 24,
  md: 28,
  lg: 32,
};

export default function Icon({ icon, size = 'md', color = '#000' }: IconProps) {
  const iconSize = typeof size === 'number' ? size : sizeMap[size as keyof typeof sizeMap];
  
  // Handle both string names and direct icon components
  const LucideIconComponent = typeof icon === 'string' ? iconMap[icon] : icon;
  
  if (!LucideIconComponent) {
    console.warn(`Icon "${icon}" not found in iconMap`);
    return null;
  }
  
  return (
    <LucideIconComponent 
      size={iconSize} 
      color={color}
    />
  );
}

export { Icon };
export type { IconProps, IconSize };