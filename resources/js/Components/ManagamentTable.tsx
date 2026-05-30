import { SearchOutlined } from "@ant-design/icons";
import { Table, Input, Button } from "antd";
import { ColumnsType } from "antd/es/table";
import Title from "antd/es/typography/Title";

interface ManagementTableProps<T> {
    title: string;
    columns: ColumnsType<T>;
    dataSource: T[];
    searchText: string;
    onSearchChange: (value: string) => void;
    onCreateClick?: () => void;
}

export const ManagementTable = <T extends { id: number }>({
    title,
    columns,
    dataSource,
    searchText,
    onSearchChange,
    onCreateClick,
}: ManagementTableProps<T>) => {

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 md:p-6 space-y-4 font-tenor">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <Title
                    level={3}
                    style={{ margin: 0, color: "#0f172a" }}
                    className="text-xl font-bold tracking-tight"
                >
                    {title}
                </Title>
                <Input
                    placeholder="Поиск по названию или тегам..."
                    prefix={<SearchOutlined className="text-slate-400" />}
                    value={searchText}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="!w-full sm:!w-72 !rounded-xl !py-2 !border-slate-200 focus:!border-blue-500 font-sans"
                    allowClear
                />
            </div>
            <Table
                columns={columns}
                dataSource={dataSource}
                rowKey="id"
                pagination={{ pageSize: 6, hideOnSinglePage: true }}
            />
        </div>
    );
};

