import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";

const TiptapEditor = ({ value, onChange, reset }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getText()); // Saves HTML content
    },
  });

  useEffect(() => {
    if (reset && editor) {
      editor.commands.setContent('');
    }
  }, [reset, editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-lg  p-4">
      {/* Toolbar */}
      <div className="flex gap-2 mb-2">
        <Button onClick={() => editor.chain().focus().toggleBold().run()} variant="outline">
          Bold
        </Button>
        <Button onClick={() => editor.chain().focus().toggleItalic().run()} variant="outline">
          Italic
        </Button>
        <Button onClick={() => editor.chain().focus().toggleStrike().run()} variant="outline">
          Strike
        </Button>
        <Button onClick={() => editor.chain().focus().setParagraph().run()} variant="outline">
          P
        </Button>
        <Button onClick={() => editor.chain().focus().toggleBulletList().run()} variant="outline">
          • List
        </Button>
        <Button onClick={() => editor.chain().focus().toggleOrderedList().run()} variant="outline">
          1. List
        </Button>
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="min-h-[150px] outline-none focus:ring-transparent focus:outline-none focus:ring-0 border p-2 rounded" />
    </div>
  );
};

export default TiptapEditor;
