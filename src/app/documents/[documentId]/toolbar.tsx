"use client";

import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useEditorStore } from '@/store/use-editor-store';
import { LucideIcon, Undo2Icon, Redo2Icon, PrinterIcon, SpellCheckIcon, BoldIcon, Bold, ItalicIcon, UnderlineIcon, MessageSquareCodeIcon, ListIcon, ListTodoIcon, RemoveFormattingIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { type Level } from "@tiptap/extension-heading";

import { MinusIcon, PlusIcon, Link2Icon, ImageIcon, UploadIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignJustifyIcon, ListOrderedIcon, ArrowUpDown, CheckSquare } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SketchPicker } from "react-color";

const HeadingLevelButton = () => {
  const { editor } = useEditorStore();

  const headings = [
    { label: "Normal text", value: 0, fontSize: "16px" },
    { label: "Heading 1", value: 1, fontSize: "16px" },
    { label: "Heading 2", value: 2, fontSize: "16px" },
    { label: "Heading 3", value: 3, fontSize: "16px" },
    { label: "Heading 4", value: 4, fontSize: "16px" },
  ];

  const getCurrentHeading = () => {
    for (let level = 1; level <= 4; level++) {
      if (editor?.isActive("heading", { level })) {
        return `Heading ${level}`;
      }
    }
    return "Normal text";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="h-7 min-w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
              <span className="truncate">
                {getCurrentHeading()}
              </span>
              <ChevronDownIcon className="ml-2 size-4 shrink-0" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Heading</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {headings.map(({ label, value, fontSize }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => {
              if (value === 0) {
                editor?.chain().focus().setParagraph().run();
              } else {
                editor?.chain().focus().toggleHeading({ level: value as Level }).run();
              }
            }}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              (value === 0 && !editor?.isActive("heading")) || editor?.isActive("heading", { level: value })
                ? "bg-neutral-200/80"
                : ""
            )}
          >
            <span style={{ fontSize }}>{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FontFamilyButton = () => {
  const { editor } = useEditorStore();

  const fonts = [
    { label: "Arial", value: "Arial" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Courier New", value: "Courier New" },
    { label: "Georgia", value: "Georgia" },
    { label: "Verdana", value: "Verdana" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="h-7 w-[120px] shrink-0 flex items-center justify-between rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
              <span className="truncate">
                {editor?.getAttributes("textStyle").fontFamily || "Arial"}
              </span>
              <ChevronDownIcon className="ml-2 size-4 shrink-0" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Font Family</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {fonts.map(({ label, value }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => editor?.chain().focus().setFontFamily(value).run()}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              editor?.getAttributes("textStyle").fontFamily === value && "bg-neutral-200/80"
            )}
            style={{ fontFamily: value }}
          >
            <span className="text-sm">{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
interface ToolbarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  icon: LucideIcon;
  label?: string;
}

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ToolbarButton = ({
  onClick,
  isActive,
  icon: Icon,
  label,
}: ToolbarButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={onClick}
          className={cn(
            "text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
            isActive && "bg-neutral-200/80"
          )}
        >
          <Icon className="size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{label}</p>
      </TooltipContent>
    </Tooltip>
  );
};

const FontSizeButton = () => {
  const { editor } = useEditorStore();

  const currentFontSize = editor?.getAttributes("textStyle").fontSize
    ? parseInt(editor?.getAttributes("textStyle").fontSize.replace("px", ""))
    : 16;

  const [fontSize, setFontSize] = useState(currentFontSize);
  const [inputValue, setInputValue] = useState(fontSize.toString());
  const [isEditing, setIsEditing] = useState(false);

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);
    if (!isNaN(size) && size > 0) {
      editor?.chain().focus().setFontSize(`${size}px`).run();
      setFontSize(size);
      setInputValue(size.toString());
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    updateFontSize(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      updateFontSize(inputValue);
      editor?.commands.focus();
    }
  };

  const increment = () => {
    const newSize = fontSize + 1;
    updateFontSize(newSize.toString());
  };

  const decrement = () => {
    const newSize = fontSize - 1;
    if (newSize > 0) {
      updateFontSize(newSize.toString());
    }
  };

  return (
    <div className="flex items-center gap-x-0.5">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={decrement}
            className="h-7 w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80"
          >
            <MinusIcon className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Decrease font size</p>
        </TooltipContent>
      </Tooltip>
      {isEditing ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="h-7 w-10 text-sm text-center border border-neutral-400 rounded-sm bg-transparent focus:outline-none focus:ring-0"
          autoFocus
        />
      ) : (
        <button
          onClick={() => {
            setIsEditing(true);
            setFontSize(currentFontSize);
            setInputValue(currentFontSize.toString());
          }}
          className="h-7 w-10 text-sm text-center border border-transparent hover:border-neutral-400 rounded-sm bg-transparent cursor-text"
        >
          {currentFontSize}
        </button>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={increment}
            className="h-7 w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80"
          >
            <PlusIcon className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Increase font size</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

const TextColorButton = () => {
  const { editor } = useEditorStore();

  const value = editor?.getAttributes("textStyle").color || "#000000";

  const onChange = (color: any) => {
    editor?.chain().focus().setColor(color.hex).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
              <span className="text-xs">A</span>
              <div className="h-0.5 w-full" style={{ backgroundColor: value }} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Text Color</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        <SketchPicker
          color={value}
          onChange={onChange}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const HighlightColorButton = () => {
  const { editor } = useEditorStore();

  const value = editor?.getAttributes("highlight").color || "#FFFFFF";

  const onChange = (color: any) => {
    editor?.chain().focus().setHighlight({ color: color.hex }).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
              <span className="text-xs">H</span>
              <div className="h-0.5 w-full" style={{ backgroundColor: value }} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Highlight Color</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        <SketchPicker
          color={value}
          onChange={onChange}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LinkButton = () => {
  const { editor } = useEditorStore();
  const [value, setValue] = useState("");

  const onChange = (url: string) => {
    editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    setValue("");
  };

  return (
    <DropdownMenu onOpenChange={(open) => {
      if (open) {
        setValue(editor?.getAttributes("link").href || "");
      }
    }}>
      <DropdownMenuTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
              <Link2Icon className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Link</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
        <Input
          placeholder="https://example.com"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={() => onChange(value)}>Apply</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ImageButton = () => {
  const { editor } = useEditorStore();
  const [imageUrl, setImageUrl] = useState("");

  const onChange = (url: string) => {
    editor?.chain().focus().setImage({ src: url }).run();
    setImageUrl("");
  };

  const onUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const imageUrl = URL.createObjectURL(file);
        onChange(imageUrl);
      }
    };
    input.click();
  };

  return (
    <DropdownMenu >
      <DropdownMenuTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
              <ImageIcon className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Image</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5">
        <div className="flex flex-col gap-y-2">
          <div className="flex items-center gap-x-2">
            <Input
              placeholder="http://example.com"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
            />
            <Button onClick={() => onChange(imageUrl)}>Apply</Button>
          </div>
          <Button onClick={onUpload} className="w-full">
            <UploadIcon className="size-4 mr-2" />
            Upload
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AlignButton = () => {
  const { editor } = useEditorStore();

  const alignments = [
    { label: "Align Left", value: "left", icon: AlignLeftIcon },
    { label: "Align Center", value: "center", icon: AlignCenterIcon },
    { label: "Align Right", value: "right", icon: AlignRightIcon },
    { label: "Align Justify", value: "justify", icon: AlignJustifyIcon },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
              <AlignLeftIcon className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Align Text</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {alignments.map(({ label, value, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => editor?.chain().focus().setTextAlign(value).run()}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              editor?.isActive({ textAlign: value }) && "bg-neutral-200/80"
            )}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const LineHeightButton = () => {
  const { editor } = useEditorStore();

  const lineHeights = [
    { label: "Default", value: "normal" },
    { label: "Single", value: "1" },
    { label: "1.15", value: "1.15" },
    { label: "1.5", value: "1.5" },
    { label: "Double", value: "2" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm">
              <ArrowUpDown className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Line Height</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-1 flex flex-col gap-y-1">
        {lineHeights.map(({ label, value }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => editor?.chain().focus().setLineHeight(value).run()}
            className={cn(
              "flex items-center gap-x-2 px-2 py-1 rounded-sm hover:bg-neutral-200/80",
              editor?.getAttributes("paragraph").lineHeight === value && "bg-neutral-200/80"
            )}
          >
            <span className="text-sm">{label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ListButton = () => {
  const { editor } = useEditorStore();

  const lists = [
    { label: "Bullet List", icon: ListIcon, isActive: () => editor?.isActive("bulletList"), onClick: () => editor?.chain().focus().toggleBulletList().run() },
    { label: "Ordered List", icon: ListOrderedIcon, isActive: () => editor?.isActive("orderedList"), onClick: () => editor?.chain().focus().toggleOrderedList().run() },
  ];

  return (
    <div className="flex items-center gap-x-0.5">
      {lists.map(({ label, icon: Icon, onClick, isActive }) => (
        <Tooltip key={label}>
          <TooltipTrigger asChild>
            <button
              onClick={onClick}
              className={cn(
                "h-7 w-7 shrink-0 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
                isActive() && "bg-neutral-200/80"
              )}
            >
              <Icon className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{label}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

const CommentButton = () => {
  const { editor } = useEditorStore();
  const [value, setValue] = useState("");

  const onChange = (comment: string) => {
    editor?.chain().focus().setComment(comment).run();
    setValue("");
  };

  return (
    <DropdownMenu onOpenChange={(open) => {
      if (open) {
        setValue(editor?.getAttributes("comment").comment || "");
      }
    }}>
      <DropdownMenuTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "h-7 min-w-7 shrink-0 flex flex-col items-center justify-center rounded-sm hover:bg-neutral-200/80 px-1.5 overflow-hidden text-sm",
                editor?.isActive("comment") && "bg-neutral-200/80"
              )}
            >
              <MessageSquareCodeIcon className="size-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Comment</p>
          </TooltipContent>
        </Tooltip>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2.5 flex items-center gap-x-2">
        <Input
          placeholder="Add a comment..."
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Button onClick={() => onChange(value)}>Add</Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const Toolbar = () => {

  const { editor } = useEditorStore();
  const sections: {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    isActive?: boolean;
  }[][] = [
      [
        {
          label: "Undo",
          icon: Undo2Icon,
          onClick: () => editor?.chain().focus().undo().run()
        },
        {
          label: "Redo",
          icon: Redo2Icon,
          onClick: () => editor?.chain().focus().redo().run()
        },
        {
          label: "Print",
          icon: PrinterIcon,
          onClick: () => window.print()
        },
        {
          label: "Spell Check",
          icon: SpellCheckIcon,
          onClick: () => {
            const current = editor?.view.dom.getAttribute("SpellCheck");
            editor?.view.dom.setAttribute("spellCheck  ", current === "false" ? "true" : "false")
          }
        },

      ],
      [
        {
          label: "Bold",
          icon: BoldIcon,
          isActive: editor?.isActive("bold"),
          onClick: () => editor?.chain().focus().toggleBold().run()
        },
        {
          label: "Italic",
          icon: ItalicIcon,
          isActive: editor?.isActive("italic"),
          onClick: () => editor?.chain().focus().toggleItalic().run()
        },
        {
          label: "Underline",
          icon: UnderlineIcon,
          isActive: editor?.isActive("underline"),
          onClick: () => editor?.chain().focus().toggleUnderline().run()
        },

      ],
      [
        {
          label: "list todo",
          icon: CheckSquare,
          isActive: editor?.isActive("taskList"),
          onClick: () => editor?.chain().focus().toggleTaskList().run()
        },
        {
          label: "Remove Formatting",
          icon: RemoveFormattingIcon,
          isActive: false,
          onClick: () => editor?.chain().focus().unsetAllMarks().run()
        },
      ]
    ];

  return (
    <TooltipProvider>
      <div className="bg-[#f1f4f9] px-2.5 py-0.5 rounded-[24px] min-h-[40px] flex items-center gap-x-0.5 overflow-x-auto">
        {sections[0].map((item) => (
          <ToolbarButton key={item.label} {...item} />
        ))}
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />

        <FontFamilyButton />
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />
        <HeadingLevelButton />
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />
        <FontSizeButton />
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />
        {sections[1].map((item) => (
          <ToolbarButton key={item.label} {...item} />
        ))}
        <TextColorButton />
        <HighlightColorButton />
        <Separator orientation="vertical" className="h-6 bg-neutral-300" />
        <LinkButton />
        <ImageButton />
        <AlignButton />
        <LineHeightButton />
        <ListButton />
        <CommentButton />
        {sections[2].map((item) => (
          <ToolbarButton key={item.label} {...item} />
        ))}
      </div>
    </TooltipProvider>
  );
};