import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Button } from "@/components/ui/button";

const TiptapEditor = ({ value, onChange, reset }) => {
  const [isEditorReady, setIsEditorReady] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        keyboardShortcuts: {
          Enter: () => false, // Prevent Enter key from being overridden
          Tab: () => false, // Ensure Tab works as expected
          ArrowRight: () => false, // Prevent Next key from going back
          ArrowLeft: () => false, // Prevent Back key from overriding navigation
        },
      }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onCreate: () => {
      setIsEditorReady(true);
    },
    editorProps: {
      // Add explicit handling for key presses to ensure space works
      handleKeyDown: (view, event) => {
        // Let the default handler process space and other keys
        return false;
      }
    }
  });

  useEffect(() => {
    if (editor && isEditorReady && value) {
      // Use a more reliable way to set content
      editor.commands.setContent(value, true);
    }
  }, [value, editor, isEditorReady]);

  // Reset editor content when reset state changes
  useEffect(() => {
    if (reset && editor) {
      editor.commands.setContent("");
    }
  }, [reset, editor]);

  if (!editor) return null;

  return (
    <div className="border rounded-lg p-4">
      {/* Toolbar */}
      <div className="flex gap-2 mb-2">
        <Button type="button" onClick={() => editor.chain().focus().toggleBold().run()} variant="outline">Bold</Button>
        <Button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} variant="outline">Italic</Button>
        <Button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} variant="outline">Strike</Button>
        <Button type="button" onClick={() => editor.chain().focus().setParagraph().run()} variant="outline">P</Button>
        <Button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} variant="outline">• List</Button>
        <Button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} variant="outline">1. List</Button>
      </div>

      {/* Editor */}
      <EditorContent
        editor={editor}
        className="min-h-[150px] outline-none focus:ring-transparent focus:outline-none focus:ring-0 border p-2 rounded"
      />
    </div>
  );
};

export default TiptapEditor;
