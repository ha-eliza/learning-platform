"use client";

import React, { useState } from "react";
import { usePage, router } from "@inertiajs/react";
import { Layout, Avatar, Menu, Tooltip } from "antd";
import type { MenuProps } from "antd";
import {
    UserOutlined,
    BookOutlined,
    SettingOutlined,
    ReadOutlined,
    ExperimentOutlined,
    PlusCircleOutlined,
    LoginOutlined,
    CopyrightOutlined,
} from "@ant-design/icons";
import { PageProps } from "@/types";
import { UserProps } from "@/types/user";

const { Header, Sider, Content } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { url } = usePage();
    const { auth } = usePage<PageProps & { auth: { user: UserProps } }>().props;
    const isTeacher = auth.user?.role === "teacher";

    const menuItems: MenuItem[] = [
        {
            key: "dashboard",
            icon: <UserOutlined className="!text-lg" />,
            label: "МОЙ КАБИНЕТ",
            className: "text-[13px]",
        },
        {
            key: "",
            icon: <BookOutlined className="!text-lg" />,
            label: "БИБЛИОТЕКА",
            className: "text-[13px]",
        },
    ];

    if (isTeacher) {
        menuItems.push(
            {
                key: "management",
                icon: <SettingOutlined className="!text-lg" />,
                label: "УПРАВЛЕНИЕ",
                className: "text-[13px]",
                children: [
                    {
                        key: "manuals",
                        icon: <ReadOutlined />,
                        label: "Методички",
                        className: "text-[14px]",
                    },
                    {
                        key: "practicums",
                        icon: <ExperimentOutlined />,
                        label: "Практикум",
                        className: "text-[14px]",
                    },
                ],
            },
            {
                key: "create",
                icon: <PlusCircleOutlined className="!text-lg" />,
                label: "СОЗДАТЬ",
                className: "text-[13px]",
            },
        );
    }

    menuItems.push({
        key: "logout",
        icon: <LoginOutlined className="!text-lg rotate-180" />,
        label: "ВЫХОД",
        className: "!text-blue-600 hover:!text-blue-700 text-[13px] font-bold",
    });

    const handleMenuClick: MenuProps["onClick"] = (e) => {
        if (e.key === "logout") {
            router.post(route("logout"));
        } else {
            router.get(`/${e.key}`); // Сюда подставится /dashboard, /manuals или /materials/create
        }
    };

    const getSelectedKey = (): string[] => {
        const segments = url.split("/").filter(Boolean); // Фильтруем пустые элементы от слэшей

        if (segments.length === 0) return [];

        // Если находимся на странице создания: /materials/create -> ['materials/create']
        if (segments[0] === "materials" && segments[1] === "create") {
            return ["materials/create"];
        }

        // Для стандартных страниц: /manuals -> ['manuals'], /dashboard -> ['dashboard']
        return [segments[0]];
    };
    return (
        <Layout className="min-h-screen bg-[#f8fafc] font-tenor">
            {/* ШАПКА ПЛАТФОРМЫ */}
            <Header className="flex items-center justify-between bg-[#0f172a] px-8 h-16 border-b border-slate-800 sticky top-0 z-10">
                <div className="text-3xl font-bold text-white tracking-wide select-none">
                    Source<span className="text-blue-500">.</span>Library
                </div>
                <div
                    className="flex items-center cursor-pointer group"
                    onClick={() => router.get("/dashboard")}
                >
                    <Avatar
                        size={34}
                        icon={<UserOutlined />}
                        className="!bg-slate-700 group-hover:scale-105 transition-transform border border-slate-600"
                    />
                </div>
            </Header>

            <Layout hasSider>
                <Sider
                    breakpoint="md"
                    collapsedWidth={80}
                    width={260}
                    theme="light"
                    collapsible
                    trigger={null}
                    collapsed={isCollapsed}
                    onCollapse={(collapsed) => setIsCollapsed(collapsed)}
                    className="!fixed !left-0 !top-16 !bottom-0 border-r border-slate-100 !bg-white pt-5 overflow-visible"
                    style={{ width: isCollapsed ? 80 : 260 }}
                >
                    <div className="flex flex-col h-full justify-between py-4">
                        <Menu
                            onClick={handleMenuClick}
                            selectedKeys={getSelectedKey()}
                            defaultOpenKeys={isTeacher ? ["management"] : []}
                            mode="inline"
                            inlineCollapsed={isCollapsed}
                            items={menuItems}
                            className="!border-none px-3 font-medium [&>.ant-menu-submenu-open]:!text-blue-600"
                        />

                        <div className="px-6 py-2 border-t border-slate-100 text-xs text-slate-400 font-mono flex items-center justify-center md:justify-start gap-1">
                            {isCollapsed ? (
                                <Tooltip
                                    title="2026 Source.Library"
                                    placement="right"
                                >
                                    <CopyrightOutlined className="text-sm cursor-help" />
                                </Tooltip>
                            ) : (
                                <>
                                    <CopyrightOutlined /> 2026 Source.Library
                                </>
                            )}
                        </div>
                    </div>
                </Sider>

                <Content
                    className="ml-[80px] md:ml-[260px] p-4 md:p-8 min-h-[calc(100vh-64px)] transition-all duration-200"
                >
                    <div className="max-w-7xl mx-auto space-y-4 md:space-y-6 py-4 md:py-6">
                        {children}
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
}
