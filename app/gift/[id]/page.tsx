'use client';
import { useEffect, useState } from 'react';
import { Gift } from '@/types/gift';
import Swal from 'sweetalert2';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import MusicEmbed from '@/components/MusicEmbed';

export default function GiftPage() {
    const params = useParams();
    const [gift, setGift] = useState<Gift | null>(null);
    const [loading, setLoading] = useState(true);
    const [giftId, setGiftId] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (params?.id) {
            setGiftId(params.id as string);
        }
    }, [params]);

    useEffect(() => {
        const fetchGift = async () => {
            if (!giftId) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Gift Link',
                    text: 'This gift link appears to be invalid'
                });
                setLoading(false);
                return;
            }

            try {
                const response = await fetch('/api/gifts/view', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ giftId })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.error) {
                    Swal.fire({
                        icon: 'error',
                        title: 'Gift not found',
                        text: 'This gift might have been removed or never existed'
                    });
                    return;
                }

                // Fix: Access the gift data from the response
                setGift(data.gift);

                // Update opened status when gift is first viewed
                if (!data.gift.opened) {
                    await fetch('/api/gifts/open', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ giftId })
                    });

                    await Swal.fire({
                        icon: 'success',
                        title: 'คุณได้รับของขวัญพิเศษ! 🎁',
                        text: 'มีคนพิเศษอยากส่งความรู้สึกดีๆ ถึงคุณ',
                        confirmButtonText: 'เปิดของขวัญ',
                        showConfirmButton: true,
                        allowOutsideClick: false,
                    });
                }
                setIsOpen(true);
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed to load gift',
                    text: 'Please try again later'
                });
            } finally {
                setLoading(false);
            }
        };

        if (giftId) {
            fetchGift();
        }
    }, [giftId]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="text-6xl"
                >
                    🎁
                </motion.div>
            </div>
        );
    }

    if (!gift) {
        return <div>Gift not found</div>;
    }

    const renderGiftContent = () => {
        switch (gift.type) {
            case 'love-letter':
                return (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="max-w-2xl mx-auto"
                    >
                        <motion.div
                            className="bg-rose-50 dark:bg-rose-900/20 p-8 rounded-lg shadow-lg border border-rose-100 dark:border-rose-800"
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="text-center mb-8">
                                <motion.h2
                                    className="text-3xl font-bold text-rose-600 dark:text-rose-400 mb-2"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    💌 จดหมายถึงคนพิเศษ
                                </motion.h2>
                                {gift.to && (
                                    <motion.p
                                        className="text-gray-600 dark:text-gray-300"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                    >
                                        ถึงคุณ {gift.to},
                                    </motion.p>
                                )}
                            </div>

                            <motion.div
                                className="prose dark:prose-invert max-w-none mb-8"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                            >
                                <p className="text-lg leading-relaxed whitespace-pre-wrap">
                                    {gift.message}
                                </p>
                            </motion.div>

                            {gift.from && (
                                <motion.div
                                    className="text-right mt-8"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.8 }}
                                >
                                    <p className="text-gray-600 dark:text-gray-300">
                                        ด้วยรัก,<br />
                                        {gift.from}
                                    </p>
                                </motion.div>
                            )}

                            <motion.div
                                className="absolute -z-10 inset-0 opacity-5"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.05 }}
                                transition={{ delay: 1 }}
                            >
                                <div className="absolute inset-0 bg-hearts bg-repeat opacity-10" />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                );

            case 'playlist':
                return (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-bold text-rose-600">🎵 เพลงแห่งความทรงจำ</h2>
                        <p className="text-gray-600">{gift.message}</p>
                        {gift.customizations.songs?.map((song, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg shadow-lg"
                            >
                                <div className="mb-4">
                                    <h3 className="text-lg font-semibold mb-2">{song.title || 'Special Song'}</h3>
                                    {song.url && <MusicEmbed url={song.url} />}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                );

            case 'photo-album':
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-bold text-rose-600">📸 ภาพแห่งความประทับใจ</h2>
                        <p className="text-gray-600">{gift.message}</p>
                        {gift.customizations.photos?.map((photo: any, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.2 }}
                                className="relative"
                            >
                                <img
                                    src={typeof photo === 'string' ? photo : photo.url}
                                    alt={typeof photo === 'string' ? '' : photo.caption}
                                    className="w-full rounded-lg shadow-lg"
                                />
                                {typeof photo !== 'string' && photo.caption && (
                                    <div className="mt-2 text-center text-gray-600 italic">
                                        {photo.caption}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </motion.div>
                );

            case 'coupon-book':
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-6"
                    >
                        <h2 className="text-2xl font-bold text-rose-600">🎟️ Love Coupons</h2>
                        <p className="text-gray-600">{gift.message}</p>
                        {gift.customizations.coupons?.map((coupon: any, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`p-6 rounded-lg border-2 ${coupon.used
                                        ? 'border-gray-200 bg-gray-50'
                                        : 'border-rose-200 bg-rose-50'
                                    }`}
                            >
                                <h3 className="text-xl font-bold">{coupon.title}</h3>
                                <p className="text-gray-600 mt-2">{coupon.description}</p>
                                <div className="mt-4 flex justify-between items-center">
                                    <span className="text-sm text-gray-500">
                                        Code: {coupon.code}
                                    </span>
                                    {!coupon.used && (
                                        <button
                                            onClick={() => {
                                                const usedCoupons = JSON.parse(
                                                    localStorage.getItem('usedCoupons') || '{}'
                                                );
                                                usedCoupons[coupon.code] = true;
                                                localStorage.setItem(
                                                    'usedCoupons',
                                                    JSON.stringify(usedCoupons)
                                                );
                                                // Force re-render
                                                setGift({
                                                    ...gift!,
                                                    customizations: {
                                                        ...gift!.customizations,
                                                        coupons: gift!.customizations.coupons?.map((c: any) =>
                                                            c.code === coupon.code
                                                                ? { ...c, used: true }
                                                                : c
                                                        )
                                                    }
                                                });
                                            }}
                                            className="px-4 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600"
                                        >
                                            Redeem Coupon
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                );

            default:
                return (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <p>{gift.message}</p>
                    </motion.div>
                );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-pink-50 to-white dark:from-pink-950 dark:to-gray-900">
            <AnimatePresence>
                {!isOpen ? (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="cursor-pointer"
                        onClick={() => setIsOpen(true)}
                    >
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-64 h-64 relative"
                        >
                            <motion.div
                                className="absolute inset-0 bg-rose-500 rounded-lg shadow-lg flex items-center justify-center flex-col"
                                animate={{
                                    rotate: [0, 5, -5, 0],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            ></motion.div>
                            <span className="text-8xl mb-4">🎁</span>
                            <p className="text-white text-xl font-bold">Click to Open!</p>
                        </motion.div>
                    </motion.div>

                ) : (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 20,
                            delay: 0.2
                        }}
                        className="w-full max-w-2xl"
                    >
                        {renderGiftContent()}

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="mt-8 text-center"
                        >
                            <button
                                onClick={() => {
                                    navigator.share?.({
                                        title: 'Valentine Gift',
                                        text: 'I received a special Valentine gift!',
                                        url: window.location.href
                                    }).catch(() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        Swal.fire({
                                            icon: 'success',
                                            title: 'Link Copied!',
                                            text: 'Share this link with others',
                                            timer: 2000,
                                            showConfirmButton: false
                                        });
                                    });
                                }}
                                className="px-6 py-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors"
                            >
                                แชร์ของขวัญนี้ 💝
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
