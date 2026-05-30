import { PlusOutlined } from "@ant-design/icons";
import { router } from "@inertiajs/react";
import { Button } from "antd";
import Title from "antd/es/typography/Title";

export function Header() {
    return (
        <div className="relative pl-6 border-l-2 border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-[40px]">
            <div className="space-y-1">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                    управление
                </span>
                <Title
                    level={2}
                    style={{ margin: 0, color: "#0f172a" }}
                    className="text-2xl font-bold tracking-tight"
                >
                    Просмотр моих материалов
                </Title>
            </div>
            <Button
            onClick={() => router.get('/create')}
            className="border border-slate-200 !rounded-xl text-[11px] font-bold uppercase tracking-wider h-11 px-4 hover:!border-slate-800 hover:!bg-slate-800 hover:!text-white transition-all duration-200 flex items-center justify-center gap-2 bg-white shadow-sm group/btn"
            >

                <PlusOutlined />
                Создать
            </Button>
        </div>
    );
}
