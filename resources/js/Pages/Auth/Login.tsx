"use client";

import React, { useState, useEffect, useRef } from "react";
import { useForm } from "@inertiajs/react";
import { Typography, Input, Button, Card, Alert } from "antd";
import { MailOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import * as THREE from "three";
import vantaNet from "vanta/dist/vanta.net.min";

const { Title, Text } = Typography;

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        login: "",
        password: "",
    });

    const vantaRef = useRef<HTMLDivElement>(null);
    const [vantaEffect, setVantaEffect] = useState<any>(null);

    useEffect(() => {
        // Извлекаем правильную функцию инициализации (с учетом особенностей ESM/UMD в Vite)
        const initVanta =
            typeof vantaNet === "function"
                ? vantaNet
                : (vantaNet as any).default;

        if (!vantaEffect && vantaRef.current && initVanta) {
            setVantaEffect(
                initVanta({
                    el: vantaRef.current,
                    THREE: THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.0,
                    minWidth: 200.0,
                    scale: 1.0,
                    scaleMobile: 1.0,
                    // Используем строковые HEX-коды для гарантированного отображения цвета в Vite
                    color: "#3b82f6",
                    backgroundColor: "#f8fafc",
                    points: 12.0,
                    maxDistance: 20.0,
                    spacing: 16.0,
                }),
            );
        }
        return () => {
            if (vantaEffect) {
                vantaEffect.destroy();
                setVantaEffect(null);
            }
        };
    }, [vantaEffect]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <div
            ref={vantaRef}
            className="min-h-screen w-full relative flex items-center justify-center p-4"
        >
            <Card className="w-full max-w-[440px] !rounded-2xl border-slate-100 shadow-md p-4 md:p-6 bg-white z-10">
                <div className="text-center mb-8">
                    <Title
                        level={2}
                        className="!text-2xl font-bold text-slate-850 tracking-tight !m-0"
                    >
                        Source<span className="text-blue-500">.</span>Library
                    </Title>
                    <Text className="text-slate-400 text-xs tracking-wide uppercase font-semibold block mt-1">
                        Вход в систему обучения
                    </Text>
                </div>

                {errors.login && !errors.login.includes("поле") && (
                    <Alert
                        message={errors.login}
                        type="error"
                        showIcon
                        className="mb-5 !rounded-xl text-xs font-medium font-sans"
                    />
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Логин
                        </label>
                        <Input
                            size="large"
                            placeholder="example@university.edu"
                            prefix={<MailOutlined className="text-slate-400" />}
                            value={data.login}
                            onChange={(e) => setData("login", e.target.value)}
                            status={errors.login ? "error" : ""}
                            className="!rounded-xl !h-11 font-sans"
                            name="login"
                            required
                        />
                        {errors.login && errors.login.includes("поле") && (
                            <span className="text-xs text-rose-500 font-sans">
                                {errors.login}
                            </span>
                        )}
                    </div>

                    <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                            Пароль
                        </label>
                        <Input.Password
                            size="large"
                            placeholder="••••••••"
                            prefix={<LockOutlined className="text-slate-400" />}
                            value={data.password}
                            onChange={(e) =>
                                setData("password", e.target.value)
                            }
                            status={errors.password ? "error" : ""}
                            className="!rounded-xl !h-11 font-sans"
                            name="password"
                            required
                        />
                        {errors.password && (
                            <span className="text-xs text-rose-500 font-sans">
                                {errors.password}
                            </span>
                        )}
                    </div>

                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={processing}
                        icon={<LoginOutlined />}
                        className="w-full !h-12 !bg-blue-600 hover:!bg-blue-700 !rounded-xl font-bold uppercase tracking-wider text-xs shadow-sm shadow-blue-100 transition-all mt-2"
                    >
                        Войти в кабинет
                    </Button>
                </form>
            </Card>
        </div>
    );
}
