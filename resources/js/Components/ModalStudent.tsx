import React, { useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Modal, Upload, Input, Button } from "antd";
import Title from "antd/es/typography/Title";
import {
    FileOutlined,
    FileAddOutlined,
    SendOutlined
} from "@ant-design/icons";

interface ModalStudentProps {
    isOpen: boolean;
    onClose: () => void;
    material: any;
}

export function ModalStudent({ isOpen, onClose, material }: ModalStudentProps) {

    // Инициализируем форму Inertia.js внутри компонента
    const { data, setData, post, processing, errors, reset } = useForm({
        material_id: null as number | null,
        file: null as File | null,
        comment: "",
    });

    // Синхронизируем ID материала при открытии окна
    useEffect(() => {
        if (material) {
            setData("material_id", material.id);
        }
    }, [material]);

    // Обработчик изменения файла в Dragger Ant Design
    const handleFileChange = (info: any) => {
        // Берем самый последний выбранный файл (так как maxCount={1})
        const fileList = info.fileList;
        if (fileList.length > 0) {
            setData("file", fileList[0].originFileObj);
        } else {
            setData("file", null);
        }
    };

    const handleModalSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Отправляем данные на ваш Laravel-эндпоинт отправки работ
        post("/submissions", {
            preserveScroll: true,
            onSuccess: () => {
                onClose();
                reset();
            },
        });
    };

    return (
        <Modal
            title={
                <div className="border-b border-slate-100 pb-3 -mt-2">
                    <Title
                        level={4}
                        style={{ margin: 0, color: "#0f172a" }}
                        className="text-lg font-bold tracking-tight"
                    >
                        Отправка решения
                    </Title>
                </div>
            }
            open={isOpen}
            onCancel={() => {
                onClose();
                reset();
            }}
            footer={null}
            className="font-tenor"
            width={500}
        >
            {material && (
                <form onSubmit={handleModalSubmit} className="space-y-5 pt-4">
                    {/* Мета-информация о задании */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-50/60 p-4 rounded-xl border border-slate-100">
                        <div className="space-y-0.5 overflow-hidden">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                                Название практики
                            </span>
                            <h4 className="font-bold text-slate-800 text-sm truncate">
                                {material.title}
                            </h4>
                        </div>
                        <div className="sm:text-right shrink-0">
                            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block">
                                Раздел
                            </span>
                            <span className="text-[11px] font-bold text-[#900007] tracking-wider uppercase font-mono block mt-0.5">
                                {material.category}
                            </span>
                        </div>
                    </div>

                    {/* Зона перетаскивания файлов (Dragger) */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                            Файл решения (ZIP, PDF)
                        </label>
                        <Upload.Dragger
                            maxCount={1}
                            beforeUpload={() => false} // Отменяем авто-отправку на сервер самого AntD
                            onChange={handleFileChange}
                            className="!border-slate-200 hover:!border-blue-500 !bg-white rounded-xl p-5 transition-colors group"
                        >
                            <p className="ant-upload-drag-icon !mb-2">
                                <FileAddOutlined
                                    style={{ fontSize: "20px" }}
                                    className="text-slate-400 group-hover:text-blue-500 transition-colors"
                                />
                            </p>
                            <p className="ant-upload-text !text-[11px] text-slate-400 font-bold uppercase tracking-wider font-mono">
                                Перетащите архив или выберите файл
                            </p>
                        </Upload.Dragger>
                        {errors.file && (
                            <span className="text-xs text-rose-500 font-sans block mt-1">
                                {errors.file}
                            </span>
                        )}
                    </div>

                    {/* Текстовый комментарий студента */}
                    <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                            Комментарий
                        </label>
                        <Input.TextArea
                            rows={3}
                            placeholder="..."
                            value={data.comment}
                            onChange={(e) => setData("comment", e.target.value)}
                            className="!rounded-xl !border-slate-200 focus:!border-blue-500 font-sans text-slate-700 text-sm"
                        />
                        {errors.comment && (
                            <span className="text-xs text-rose-500 font-sans block mt-1">
                                {errors.comment}
                            </span>
                        )}
                    </div>

                    {/* Кнопка отправки формы */}
                    <div className="pt-2">
                        <Button
                            htmlType="submit"
                            loading={processing}
                            className="w-full border border-slate-200 !rounded-xl text-[11px] font-bold uppercase tracking-wider h-11 px-4 hover:!border-slate-800 hover:!bg-slate-800 hover:!text-white transition-all duration-200 flex items-center justify-center gap-2 bg-white shadow-sm group/btn"
                        >
                            <SendOutlined className="text-[10px]" />
                            Отправить на проверку
                        </Button>
                    </div>
                </form>
            )}
        </Modal>
    );
}

