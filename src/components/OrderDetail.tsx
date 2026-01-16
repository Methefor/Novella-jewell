'use client';

import { useState } from 'react';
import { Order } from '@/lib/orders';
import { formatPrice } from '@/lib/sanity.utils';
import { motion } from 'framer-motion';
import {
  Package,
  User,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
} from 'lucide-react';

interface OrderDetailProps {
  order: Order;
}

const statusConfig = {
  pending: {
    label: 'Beklemede',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/20',
    icon: Clock,
  },
  processing: {
    label: 'Hazırlanıyor',
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/20',
    icon: Package,
  },
  shipped: {
    label: 'Kargoda',
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    icon: Truck,
  },
  delivered: {
    label: 'Teslim Edildi',
    color: 'text-green-400',
    bgColor: 'bg-green-500/20',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'İptal Edildi',
    color: 'text-red-400',
    bgColor: 'bg-red-500/20',
    icon: XCircle,
  },
};

export default function OrderDetail({ order }: OrderDetailProps) {
  const [status, setStatus] = useState<Order['status']>(order.status);
  const statusInfo = statusConfig[status];
  const StatusIcon = statusInfo.icon;

  const handleStatusChange = async (newStatus: Order['status']) => {
    // TODO: Implement status update API call
    setStatus(newStatus);
  };

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="glass rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="mb-2 font-cormorant text-2xl font-semibold text-white">
              Sipariş #{order.orderId}
            </h2>
            <p className="font-inter text-sm text-white/60">
              {new Date(order.createdAt).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`flex items-center gap-2 rounded-full px-4 py-2 ${statusInfo.bgColor}`}
            >
              <StatusIcon className={`h-5 w-5 ${statusInfo.color}`} />
              <span className={`font-inter font-semibold ${statusInfo.color}`}>
                {statusInfo.label}
              </span>
            </div>
          </div>
        </div>

        {/* Status Selector */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(statusConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <button
                key={key}
                onClick={() => handleStatusChange(key as Order['status'])}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 font-inter text-sm transition-all ${
                  status === key
                    ? `${config.bgColor} ${config.color}`
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <Icon className="h-4 w-4" />
                {config.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Customer Information */}
        <div className="glass rounded-2xl p-6">
          <h3 className="mb-4 flex items-center gap-2 font-cormorant text-xl font-semibold text-white">
            <User className="h-5 w-5 text-gold" />
            Müşteri Bilgileri
          </h3>
          <div className="space-y-3">
            <div>
              <p className="font-inter text-sm text-white/60">Ad Soyad</p>
              <p className="font-inter font-semibold text-white">
                {order.customerName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-white/40" />
              <div>
                <p className="font-inter text-sm text-white/60">E-posta</p>
                <a
                  href={`mailto:${order.customerEmail}`}
                  className="font-inter text-white hover:text-gold"
                >
                  {order.customerEmail}
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-white/40" />
              <div>
                <p className="font-inter text-sm text-white/60">Telefon</p>
                <a
                  href={`tel:${order.customerPhone}`}
                  className="font-inter text-white hover:text-gold"
                >
                  {order.customerPhone}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="glass rounded-2xl p-6">
          <h3 className="mb-4 flex items-center gap-2 font-cormorant text-xl font-semibold text-white">
            <MapPin className="h-5 w-5 text-gold" />
            Teslimat Adresi
          </h3>
          <div className="space-y-2 font-inter text-white/70">
            <p>{order.address}</p>
            <p>
              {order.district}, {order.city} {order.postalCode}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="glass rounded-2xl p-6">
        <h3 className="mb-4 font-cormorant text-xl font-semibold text-white">
          Sipariş Detayları
        </h3>
        <div className="space-y-4">
          {order.items.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 rounded-lg bg-white/5 p-4"
            >
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-white/5">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-white/20">
                    {item.productName[0]}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-inter font-semibold text-white">
                  {item.productName}
                </p>
                <p className="font-inter text-sm text-white/60">
                  {item.quantity} adet x {formatPrice(item.price)}
                </p>
              </div>
              <div className="font-inter font-semibold text-gold">
                {formatPrice(item.price * item.quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t border-white/10 pt-6">
          <div className="flex items-center justify-between">
            <span className="font-inter text-lg font-semibold text-white">
              Toplam
            </span>
            <span className="font-cormorant text-3xl font-bold text-gold">
              {formatPrice(order.total)}
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-white/60">
            <CreditCard className="h-4 w-4" />
            <span className="font-inter text-sm">
              Ödeme: {order.paymentMethod === 'whatsapp' ? 'WhatsApp' : order.paymentMethod === 'shopier' ? 'Shopier' : 'İyzico'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

