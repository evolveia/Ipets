/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  MOCK_USER,
  MOCK_PETS,
  MOCK_PRODUCTS,
  MOCK_ORDERS,
  MOCK_SOS_ALERTS,
} from './data/mockData';
import {
  UserProfile,
  Pet,
  Product,
  CartItem,
  Order,
  SosAlert,
  SosSighting,
  PetHealthRecord,
} from './types';

import { Preloader } from './components/ui/Preloader';
import { BottomNav, NavTab } from './components/ui/BottomNav';
import { LandingPage } from './features/landing/LandingPage';
import { AuthScreen } from './features/auth/AuthScreen';
import { HomeScreen } from './features/home/HomeScreen';
import { OrdersScreen } from './features/orders/OrdersScreen';
import { SosScreen } from './features/sos/SosScreen';
import { PetsScreen } from './features/pets/PetsScreen';
import { SubscriptionsScreen } from './features/subscriptions/SubscriptionsScreen';
import { ProfileScreen } from './features/profile/ProfileScreen';
import { CartDrawer } from './features/cart-checkout/CartDrawer';
import { PWAInstallBanner } from './components/ui/PWAInstallBanner';
import { CheckCircle2, Sparkles, AlertCircle, Bell, X } from 'lucide-react';
import {
  getPushPermissionStatus,
  requestPushPermission,
  sendOrderStatusPush,
  sendSosAlertPush,
  PushPermissionStatus,
} from './services/firebase/push';

export default function App() {
  // App navigation view state: preloader -> landing -> auth -> app
  const [viewState, setViewState] = useState<'preloader' | 'landing' | 'auth' | 'app'>('preloader');
  const [currentTab, setCurrentTab] = useState<NavTab>('home');

  // Core application state
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [pets, setPets] = useState<Pet[]>(MOCK_PETS);
  const [activePet, setActivePet] = useState<Pet>(MOCK_PETS[0]);
  const [products] = useState<Product[]>(MOCK_PRODUCTS);
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: MOCK_PRODUCTS[0], qty: 1, petId: MOCK_PETS[0].id },
  ]);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [sosAlerts, setSosAlerts] = useState<SosAlert[]>(MOCK_SOS_ALERTS);

  // UI state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isEmergencyMode, setIsEmergencyMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Push notification state (Firebase Cloud Messaging)
  const [pushPermission, setPushPermission] = useState<PushPermissionStatus>('default');
  const [hasDismissedPushPrompt, setHasDismissedPushPrompt] = useState(false);

  React.useEffect(() => {
    setPushPermission(getPushPermissionStatus());
  }, []);

  const handleEnablePushInAppShell = async () => {
    const result = await requestPushPermission();
    setPushPermission(result.status);
    if (result.status === 'granted') {
      showToast('🔔 Notificações em tempo real (FCM) ativadas!');
    } else if (result.status === 'denied') {
      showToast('⚠️ Permissão de notificações negada no navegador.');
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };


  // Garante que todo carregamento de página e troca de aba inicie pelo topo
  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [viewState, currentTab]);

  // Cart operations with fly feedback
  const handleAddToCart = (product: Product, qty: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, qty: item.qty + qty }
            : item
        );
      }
      return [...prev, { product, qty, petId: activePet.id }];
    });
    showToast(`"${product.name.slice(0, 26)}..." adicionado à cesta! 🐾`);
  };

  const handleUpdateCartQty = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.qty + delta;
            return newQty > 0 ? { ...item, qty: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removido da cesta.');
  };

  const handleCheckoutSuccess = (orderData: any) => {
    const newOrder: Order = {
      id: orderData.id,
      userId: user.uid,
      hubId: user.addresses[0]?.hubId || 'hub_01',
      hubName: orderData.hubName || 'Micro-Hub Pinheiros 24/7',
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      discount: orderData.discount,
      total: orderData.total,
      isEmergency: isEmergencyMode,
      status: 'confirmed',
      etaMinutes: 24,
      placedAt: new Date().toISOString(),
      paymentMethod: orderData.paymentMethod,
      address: orderData.address,
      courierName: 'Rodrigo Mendonça',
      courierPhone: '(11) 97120-4491',
      events: [
        {
          status: 'confirmed',
          title: 'Pedido Confirmado',
          description: 'Pagamento aprovado. Separando itens no micro-hub mais próximo.',
          at: 'Agora',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setCurrentTab('orders');
    showToast('🎉 Pedido confirmado com entrega expressa!');

    // Trigger Firebase Cloud Messaging / Web Push notification
    sendOrderStatusPush(newOrder.id, 'Separado no micro-hub mais próximo', 24);
  };

  // SOS operations
  const handleAddSosAlert = (alert: SosAlert) => {
    setSosAlerts((prev) => [alert, ...prev]);
    showToast(`🚨 Alerta emitido! Radar ativo no raio de ${alert.radiusKm} km.`);

    // Trigger community SOS push notification in 3km perimeter
    sendSosAlertPush(alert.petName, alert.lastSeenAddress, alert.radiusKm);
  };


  const handleAddSighting = (alertId: string, sighting: SosSighting) => {
    setSosAlerts((prev) =>
      prev.map((al) =>
        al.id === alertId
          ? { ...al, sightings: [sighting, ...(al.sightings || [])] }
          : al
      )
    );
    showToast('Avistamento enviado ao tutor com sucesso!');
  };

  // Pet management
  const handleAddPet = (newPet: Pet) => {
    setPets((prev) => [...prev, newPet]);
    setActivePet(newPet);
    showToast(`🐾 ${newPet.name} cadastrado com sucesso no iPet ID!`);
  };

  const handleUpdatePet = (updatedPet: Pet) => {
    setPets((prev) => prev.map((p) => (p.id === updatedPet.id ? updatedPet : p)));
    if (activePet.id === updatedPet.id) {
      setActivePet(updatedPet);
    }
    showToast(`🐾 Dados de ${updatedPet.name} atualizados com sucesso!`);
  };

  const handleDeletePet = (petId: string) => {
    const petToRemove = pets.find((p) => p.id === petId);
    const petName = petToRemove ? petToRemove.name : 'Pet';
    const remaining = pets.filter((p) => p.id !== petId);
    setPets(remaining);
    if (activePet.id === petId && remaining.length > 0) {
      setActivePet(remaining[0]);
    }
    showToast(`🗑️ ${petName} foi excluído com sucesso.`);
  };

  const handleAddHealthRecord = (petId: string, record: PetHealthRecord) => {
    setPets((prev) =>
      prev.map((p) =>
        p.id === petId
          ? { ...p, healthRecords: [record, ...p.healthRecords] }
          : p
      )
    );
    if (activePet.id === petId) {
      setActivePet((prev) => ({
        ...prev,
        healthRecords: [record, ...prev.healthRecords],
      }));
    }
    showToast('Registro de saúde adicionado à linha do tempo!');
  };

  const handleUpdateHealthRecord = (petId: string, updatedRecord: PetHealthRecord) => {
    setPets((prev) =>
      prev.map((p) =>
        p.id === petId
          ? {
              ...p,
              healthRecords: p.healthRecords.map((r) =>
                r.id === updatedRecord.id ? updatedRecord : r
              ),
            }
          : p
      )
    );
    if (activePet.id === petId) {
      setActivePet((prev) => ({
        ...prev,
        healthRecords: prev.healthRecords.map((r) =>
          r.id === updatedRecord.id ? updatedRecord : r
        ),
      }));
    }
    showToast('Registro de saúde atualizado com sucesso!');
  };

  const handleDeleteHealthRecord = (petId: string, recordId: string) => {
    setPets((prev) =>
      prev.map((p) =>
        p.id === petId
          ? {
              ...p,
              healthRecords: p.healthRecords.filter((r) => r.id !== recordId),
            }
          : p
      )
    );
    if (activePet.id === petId) {
      setActivePet((prev) => ({
        ...prev,
        healthRecords: prev.healthRecords.filter((r) => r.id !== recordId),
      }));
    }
    showToast('Registro de saúde excluído com sucesso.');
  };

  const handleUpdateUserProfile = (updatedUser: UserProfile) => {
    setUser(updatedUser);
    showToast('Perfil do tutor atualizado com sucesso!');
  };

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-screen bg-[#FDF8F3] text-[#22333B]">
      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 24, stiffness: 350 }}
            className="fixed top-4 inset-x-4 max-w-sm mx-auto z-50 bg-[#22333B] text-white px-4 py-3 rounded-[18px] shadow-2xl border border-white/10 flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#00A896] text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#FF9F1C]" />
            </div>
            <p className="text-xs font-semibold leading-snug flex-1">
              {toastMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Views Flow: preloader -> landing -> auth -> app */}
      {viewState === 'preloader' && (
        <Preloader onComplete={() => setViewState('landing')} />
      )}

      {viewState === 'landing' && (
        <LandingPage
          onGoToAuth={() => {
            setViewState('auth');
          }}
        />
      )}

      {viewState === 'auth' && (
        <AuthScreen
          onSuccess={() => {
            setViewState('app');
            setCurrentTab('home');
            showToast('Bem-vindo(a) ao iPet! 🐾');
          }}
          onBackToLanding={() => setViewState('landing')}
        />
      )}

      {viewState === 'app' && (
        <div className="relative pb-16">
          {/* AppShell Push Notification Permission Prompt (FCM) */}
          {pushPermission === 'default' && !hasDismissedPushPrompt && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-r from-[#00A896] to-[#027368] text-white px-3.5 sm:px-4 py-2.5 shadow-md flex items-center justify-between gap-3 text-xs sticky top-0 z-40"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-amber-300 animate-bounce" />
                </div>
                <p className="truncate text-[11px] sm:text-xs">
                  <strong>Ativar alertas em tempo real?</strong> Receba rotas de entrega e alertas SOS de 3km.
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleEnablePushInAppShell}
                  className="px-3 py-1 rounded-lg bg-white text-[#00A896] font-bold text-xs hover:bg-stone-100 cursor-pointer transition-colors shadow-2xs"
                >
                  Ativar
                </button>
                <button
                  onClick={() => setHasDismissedPushPrompt(true)}
                  className="text-white/80 hover:text-white p-1 cursor-pointer transition-colors"
                  title="Dispensar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* PWA Install Banner (only appears in browser when not yet standalone) */}
          <PWAInstallBanner />

          {/* Active Tab Screen */}
          <AnimatePresence mode="wait">
            {currentTab === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <HomeScreen
                  user={user}
                  activePet={activePet}
                  pets={pets}
                  onSelectPet={setActivePet}
                  products={products}
                  onAddToCart={handleAddToCart}
                  cartCount={totalCartCount}
                  onOpenCart={() => setIsCartOpen(true)}
                  onGoToSos={() => setCurrentTab('sos')}
                  onGoToPrime={() => setCurrentTab('profile')}
                  isEmergencyMode={isEmergencyMode}
                  onToggleEmergencyMode={() => setIsEmergencyMode(!isEmergencyMode)}
                />
              </motion.div>
            )}

            {currentTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <OrdersScreen
                  orders={orders}
                  onReorder={(ord) => {
                    ord.items.forEach((item) => handleAddToCart(item.product, item.qty));
                    setIsCartOpen(true);
                  }}
                />
              </motion.div>
            )}

            {currentTab === 'sos' && (
              <motion.div
                key="sos"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <SosScreen
                  alerts={sosAlerts}
                  pets={pets}
                  onAddAlert={handleAddSosAlert}
                  onAddSighting={handleAddSighting}
                />
              </motion.div>
            )}

            {currentTab === 'pets' && (
              <motion.div
                key="pets"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <PetsScreen
                  pets={pets}
                  activePet={activePet}
                  onSelectPet={setActivePet}
                  onAddPet={handleAddPet}
                  onUpdatePet={handleUpdatePet}
                  onDeletePet={handleDeletePet}
                  onAddHealthRecord={handleAddHealthRecord}
                  onUpdateHealthRecord={handleUpdateHealthRecord}
                  onDeleteHealthRecord={handleDeleteHealthRecord}
                />
              </motion.div>
            )}

            {currentTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-4">
                  <SubscriptionsScreen
                    user={user}
                    activePet={activePet}
                    onSubscribePrime={() => showToast('Plano iPet Prime ativo!')}
                    onSubscribeProtect={() => showToast('Cobertura iPet Protect ativa!')}
                  />
                  <ProfileScreen
                    user={user}
                    activePet={activePet}
                    isEmergencyMode={isEmergencyMode}
                    onToggleEmergencyMode={() => setIsEmergencyMode(!isEmergencyMode)}
                    onGoToLanding={() => setViewState('landing')}
                    onSignOut={() => setViewState('auth')}
                    onUpdateUser={handleUpdateUserProfile}
                    onShowToast={showToast}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cart Drawer */}
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cartItems}
            onUpdateQty={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            onCheckoutSuccess={handleCheckoutSuccess}
            userAddress={user.addresses[0]}
            isPrimeUser={user.isPrime}
          />

          {/* Bottom Navigation */}
          <BottomNav
            currentTab={currentTab}
            onTabChange={setCurrentTab}
            activeOrdersCount={orders.filter((o) => o.status !== 'delivered').length}
            activeSosCount={sosAlerts.filter((a) => a.status === 'ativo').length}
            isEmergencyMode={isEmergencyMode}
          />
        </div>
      )}
    </div>
  );
}
