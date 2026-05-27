"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading2,
  Heading3,
  Link2,
  Quote,
  Undo2,
  Redo2,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}

export function RichText({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-gold underline" },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Escribe aquí...",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[180px] outline-none p-4 text-night prose prose-sm max-w-none [&_h2]:font-display [&_h2]:text-2xl [&_h2]:mt-3 [&_h2]:mb-2 [&_h3]:font-display [&_h3]:text-xl [&_h3]:mt-2 [&_h3]:mb-1 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_blockquote]:border-l-4 [&_blockquote]:border-gold [&_blockquote]:pl-3 [&_blockquote]:italic [&_a]:text-gold [&_a]:underline",
      },
    },
  });

  if (!editor) return null;

  return (
    <div className="border border-night/10 rounded-xl bg-white overflow-hidden focus-within:border-gold transition">
      <div className="flex flex-wrap gap-0.5 p-2 border-b border-night/8 bg-stone">
        <Btn
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
          icon={Bold}
        />
        <Btn
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          icon={Italic}
        />
        <Sep />
        <Btn
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          icon={Heading2}
        />
        <Btn
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          icon={Heading3}
        />
        <Sep />
        <Btn
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          icon={List}
        />
        <Btn
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          icon={ListOrdered}
        />
        <Btn
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          icon={Quote}
        />
        <Sep />
        <Btn
          active={editor.isActive("link")}
          onClick={() => {
            const prev = editor.getAttributes("link").href;
            const url = window.prompt("URL del link:", prev ?? "https://");
            if (url === null) return;
            if (url === "") {
              editor.chain().focus().unsetLink().run();
            } else {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          icon={Link2}
        />
        <Sep />
        <Btn
          active={false}
          onClick={() => editor.chain().focus().undo().run()}
          icon={Undo2}
        />
        <Btn
          active={false}
          onClick={() => editor.chain().focus().redo().run()}
          icon={Redo2}
        />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}

function Btn({
  active,
  onClick,
  icon: Icon,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof Bold;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded-md transition ${
        active
          ? "bg-night text-white"
          : "text-night/60 hover:bg-white hover:text-night"
      }`}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

function Sep() {
  return <span className="w-px self-stretch bg-night/10 mx-1" />;
}
