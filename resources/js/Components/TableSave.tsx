'use client';

import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { BookOutlined, BookFilled } from '@ant-design/icons';
import { App, Button } from 'antd';

interface ButtonSaveProps {
  materialId: number;
  initialIsFavorite: boolean;
}

export function ButtonSave({ materialId, initialIsFavorite }: ButtonSaveProps) {
  const { message } = App.useApp();
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [loading, setLoading] = useState(false);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading) return;

    setLoading(true);

    setIsFavorite(prev => !prev);

    router.post(`/materials/${materialId}/favorite`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        setLoading(false);
        message.success(!isFavorite ? 'Материал сохранен' : 'Материал удален из избранного');
      },
      onError: () => {
        setLoading(false);
        setIsFavorite(prev => !prev);
        message.error('Не удалось изменить статус сохранения');
      }
    });
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`flex items-center justify-center p-1.5 transition-all border-0 ${
        isFavorite
          ? 'text-slate-700'
          : 'text-slate-400  hover:text-slate-700'
      } cursor-pointer disabled:opacity-50`}
      title={isFavorite ? "Удалить из сохраненного" : "Сохранить материал"}
    >
      {isFavorite ? (
        <BookFilled style={{ fontSize: '17px' }} className="animate-scaleUp" />
      ) : (
        <BookOutlined style={{ fontSize: '17px' }} />
      )}
    </button>
  );
}

