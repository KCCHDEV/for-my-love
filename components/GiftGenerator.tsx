'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { nanoid } from 'nanoid';
import Swal from 'sweetalert2';
import MusicEmbed from './MusicEmbed';

const GIFT_TYPES = [
  {
    id: 'love-letter',
    name: 'จดหมายรัก',
    icon: '💌',
    description: 'เขียนจดหมายบอกความในใจของคุณ',
    maxLength: 1000
  },
  {
    id: 'photo-album',
    name: 'อัลบั้มภาพ',
    icon: '📸',
    description: 'แชร์ภาพความทรงจำพิเศษพร้อมคำบรรยาย (สูงสุด 5 ภาพ)',
    maxPhotos: 5
  },
  {
    id: 'playlist',
    name: 'เพลงแห่งรัก',
    icon: '🎵',
    description: 'สร้างเพลย์ลิสต์เพลงที่มีความหมาย (YouTube/Spotify)',
    maxSongs: 10,
    urlPatterns: {
      youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/,
      spotify: /^(https?:\/\/)?(open\.)?spotify\.com\/.+$/
    }
  },
];

interface PhotoData {
  url: string;
  caption: string;
}

interface CouponData {
  title: string;
  description: string;
  used: boolean;
  code: string;
}

const GiftGenerator = () => {
  const [selectedType, setSelectedType] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [photos, setPhotos] = useState<PhotoData[]>([]);
  const [coupons, setCoupons] = useState<CouponData[]>([]);
  const [songs, setSongs] = useState<{ url: string; title: string }[]>([]);
  const [fromName, setFromName] = useState('');
  const [toName, setToName] = useState('');

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || photos.length + files.length > 5) {
      Swal.fire('ข้อผิดพลาด', 'อัพโหลดได้สูงสุด 5 รูปเท่านั้น', 'error');
      return;
    }

    // Handle photo upload logic here
    // For demo, we'll use local URLs
    const newPhotos = Array.from(files).map(file => ({
      url: URL.createObjectURL(file),
      caption: ''
    }));
    setPhotos([...photos, ...newPhotos]);
  };

  const addCoupon = () => {
    if (coupons.length >= 5) {
      Swal.fire('ข้อผิดพลาด', 'สร้างคูปองได้สูงสุด 5 ใบเท่านั้น', 'error');
      return;
    }
    setCoupons([...coupons, {
      title: '',
      description: '',
      used: false,
      code: nanoid(6)
    }]);
  };

  const renderGiftTypeInputs = () => {
    switch (selectedType) {
      case 'love-letter':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 mt-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="จากใคร (ชื่อของคุณ)"
                value={fromName}
                onChange={(e) => setFromName(e.target.value)}
              />
              <Input
                placeholder="ถึงใคร (ชื่อของเขา/เธอ)"
                value={toName}
                onChange={(e) => setToName(e.target.value)}
              />
            </div>
            <textarea
              className="w-full h-40 p-4 rounded-lg border border-gray-200 focus:border-rose-300 focus:ring-rose-300"
              placeholder="เขียนจดหมายรักของคุณที่นี่..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </motion.div>
        );

      case 'playlist':
        return (
          <div className="space-y-4 mt-4">
            {songs.map((song, index) => (
                <div className="space-y-4">
                  <Input
                    placeholder="วางลิงก์ YouTube/Spotify ที่นี่"
                    value={song.url}
                    onChange={(e) => {
                      const newSongs = [...songs];
                      newSongs[index].url = e.target.value;
                      setSongs(newSongs);
                    }}
                  />
                  {song.url && <MusicEmbed url={song.url} />}
                </div>
            ))}
            {songs.length < 10 && (
              <Button onClick={() => setSongs([...songs, { url: '', title: '' }])}>
                เพิ่มเพลง
              </Button>
            )}
          </div>
        );

      case 'photo-album':
        return (
          <div className="space-y-4 mt-4">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <label
              htmlFor="photo-upload"
              className="block w-full p-4 border-2 border-dashed rounded-lg text-center cursor-pointer hover:border-rose-300"
            >
              คลิกเพื่ออัพโหลดรูปภาพ ({photos.length}/5)
            </label>
            {photos.map((photo, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <img src={photo.url} alt="" className="w-full rounded-lg" />
                <Input
                  placeholder="เพิ่มคำบรรยายภาพ"
                  value={photo.caption}
                  onChange={(e) => {
                    const newPhotos = [...photos];
                    newPhotos[index].caption = e.target.value;
                    setPhotos(newPhotos);
                  }}
                  className="mt-2"
                />
              </motion.div>
            ))}
          </div>
        );

      case 'coupon-book':
        return (
          <div className="space-y-4 mt-4">
            {coupons.map((coupon, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="p-4 border rounded-lg"
              >
                <Input
                  placeholder="Coupon Title"
                  value={coupon.title}
                  onChange={(e) => {
                    const newCoupons = [...coupons];
                    newCoupons[index].title = e.target.value;
                    setCoupons(newCoupons);
                  }}
                  className="mb-2"
                />
                <Input
                  placeholder="Description"
                  value={coupon.description}
                  onChange={(e) => {
                    const newCoupons = [...coupons];
                    newCoupons[index].description = e.target.value;
                    setCoupons(newCoupons);
                  }}
                />
                <div className="text-sm text-gray-500 mt-2">
                  Coupon Code: {coupon.code}
                </div>
              </motion.div>
            ))}
            {coupons.length < 5 && (
              <Button onClick={addCoupon}>
                Add Coupon
              </Button>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  const generateGift = async () => {
    if (!selectedType || !message) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Please select a gift type and add a message!'
      });
      return;
    }

    setLoading(true);
    try {
      const giftData = {
        type: selectedType,
        message,
        from: fromName,
        to: toName,
        customizations: {
          ...(selectedType === 'playlist' && { songs }),
          ...(selectedType === 'photo-album' && { photos }),
          ...(selectedType === 'coupon-book' && { coupons }),
        }
      };

      const response = await fetch('/api/gifts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(giftData)
      });

      const data = await response.json();
      
      if (data.giftId) {
        const shareUrl = `${window.location.origin}/gift/${data.giftId}`;
        setGeneratedLink(shareUrl);
        await navigator.clipboard.writeText(shareUrl);
        
        Swal.fire({
          icon: 'success',
          title: 'Gift Created!',
          text: 'Link copied to clipboard',
          showConfirmButton: true,
          confirmButtonText: 'OK',
          timer: 2000
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to create gift',
        text: 'Please try again later'
      });
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto p-6 glass rounded-lg shadow-lg"
    >
      <h2 className="text-2xl mb-6 text-rose-600 dark:text-rose-400 font-bold text-center">
        สร้างของขวัญวาเลนไทน์
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {GIFT_TYPES.map((type) => (
            <motion.button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-4 rounded-lg border-2 text-left transition-colors duration-300 ${
                selectedType === type.id 
                ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-900/30' 
                : 'border-gray-200 hover:border-rose-300'
              }`}
            >
              <span className="text-3xl mb-2 block">{type.icon}</span>
              <h3 className="font-bold">{type.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">{type.description}</p>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <Input 
        className="mt-6" 
        placeholder="เขียนข้อความพิเศษถึงคนพิเศษ..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      {renderGiftTypeInputs()}

      <Button 
        onClick={generateGift} 
        className="mt-6 w-full bg-rose-500 hover:bg-rose-600"
        disabled={!selectedType || !message || loading}
      >
        {loading ? 'กำลังสร้างของขวัญ...' : 'สร้างของขวัญ 🎁'}
      </Button>

      {generatedLink && (
        <div className="mt-6">
          <p className="text-center mb-2">ลิงก์สำหรับแชร์:</p>
          <Input 
            value={generatedLink} 
            readOnly 
            className="text-center" 
          />
        </div>
      )}
    </motion.div>
  );
};

export default GiftGenerator;