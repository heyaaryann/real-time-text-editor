import { useEditorStore } from "@/store/use-editor-store";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { TableIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export const TableButton = () => {
    const { editor } = useEditorStore();

    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <button
                            className={cn(
                                "h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5"
                            )}
                        >
                            <TableIcon className="size-4" />
                        </button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Table</p>
                </TooltipContent>
            </Tooltip>
            <DropdownMenuContent className="p-2 flex flex-col gap-y-1 bg-white border border-neutral-200 shadow-sm rounded-sm z-50 min-w-[160px]">
                <button
                    onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                    className="flex items-center gap-x-2 px-3 py-1.5 rounded-sm hover:bg-neutral-200/80 text-sm text-left"
                >
                    Insert Table
                </button>
                <button
                    onClick={() => editor?.chain().focus().addRowBefore().run()}
                    className="flex items-center gap-x-2 px-3 py-1.5 rounded-sm hover:bg-neutral-200/80 text-sm text-left"
                >
                    Add Row Above
                </button>
                <button
                    onClick={() => editor?.chain().focus().addRowAfter().run()}
                    className="flex items-center gap-x-2 px-3 py-1.5 rounded-sm hover:bg-neutral-200/80 text-sm text-left"
                >
                    Add Row Below
                </button>
                <button
                    onClick={() => editor?.chain().focus().addColumnBefore().run()}
                    className="flex items-center gap-x-2 px-3 py-1.5 rounded-sm hover:bg-neutral-200/80 text-sm text-left"
                >
                    Add Column Left
                </button>
                <button
                    onClick={() => editor?.chain().focus().addColumnAfter().run()}
                    className="flex items-center gap-x-2 px-3 py-1.5 rounded-sm hover:bg-neutral-200/80 text-sm text-left"
                >
                    Add Column Right
                </button>
                <div className="h-px bg-neutral-200 my-1" />
                <button
                    onClick={() => editor?.chain().focus().deleteRow().run()}
                    className="flex items-center gap-x-2 px-3 py-1.5 rounded-sm hover:bg-red-100 text-sm text-left text-red-600"
                >
                    Delete Row
                </button>
                <button
                    onClick={() => editor?.chain().focus().deleteColumn().run()}
                    className="flex items-center gap-x-2 px-3 py-1.5 rounded-sm hover:bg-red-100 text-sm text-left text-red-600"
                >
                    Delete Column
                </button>
                <button
                    onClick={() => editor?.chain().focus().deleteTable().run()}
                    className="flex items-center gap-x-2 px-3 py-1.5 rounded-sm hover:bg-red-100 text-sm text-left text-red-600"
                >
                    Delete Table
                </button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
