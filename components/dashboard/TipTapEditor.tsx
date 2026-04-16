"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, List, ListOrdered, Quote, Undo, Redo } from "lucide-react";

interface TipTapEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({ value, onChange, placeholder = "Write your masterpiece..." }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: "is-editor-empty",
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base lg:prose-lg max-w-none focus:outline-none min-h-[300px] p-4 font-sans",
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-col rounded-xl border border-cream-dark bg-white shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 border-b border-cream-dark bg-cream/30 p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-lg p-2 transition-colors ${
            editor.isActive("bold") ? "bg-primary/10 text-primary" : "text-muted hover:bg-cream-dark hover:text-heading"
          }`}
          title="Bold"
        >
          <Bold size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-lg p-2 transition-colors ${
            editor.isActive("italic") ? "bg-primary/10 text-primary" : "text-muted hover:bg-cream-dark hover:text-heading"
          }`}
          title="Italic"
        >
          <Italic size={16} />
        </button>

        <div className="mx-1 h-5 w-px bg-cream-dark" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`rounded-lg p-2 transition-colors ${
            editor.isActive("bulletList") ? "bg-primary/10 text-primary" : "text-muted hover:bg-cream-dark hover:text-heading"
          }`}
          title="Bullet List"
        >
          <List size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`rounded-lg p-2 transition-colors ${
            editor.isActive("orderedList") ? "bg-primary/10 text-primary" : "text-muted hover:bg-cream-dark hover:text-heading"
          }`}
          title="Numbered List"
        >
          <ListOrdered size={16} />
        </button>

        <div className="mx-1 h-5 w-px bg-cream-dark" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`rounded-lg p-2 transition-colors ${
            editor.isActive("blockquote") ? "bg-primary/10 text-primary" : "text-muted hover:bg-cream-dark hover:text-heading"
          }`}
          title="Quote"
        >
          <Quote size={16} />
        </button>

        <div className="flex-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-cream-dark hover:text-heading disabled:opacity-30"
          title="Undo"
        >
          <Undo size={16} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="rounded-lg p-2 text-muted transition-colors hover:bg-cream-dark hover:text-heading disabled:opacity-30"
          title="Redo"
        >
          <Redo size={16} />
        </button>
      </div>

      {/* Editor Content */}
      <div className="flex-1 bg-white">
        <EditorContent editor={editor} />
      </div>

      {/* CSS overrides for the placeholder since TipTap uses pure CSS classes for it */}
      <style dangerouslySetInnerHTML={{ __html: `
        .is-editor-empty:first-child::before {
          color: #adb5bd;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
      `}} />
    </div>
  );
}
