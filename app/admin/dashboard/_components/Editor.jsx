"use client";
import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import CharacterCount from '@tiptap/extension-character-count';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Superscript from '@tiptap/extension-superscript';
import Subscript from '@tiptap/extension-subscript';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Placeholder from '@tiptap/extension-placeholder';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { Node } from '@tiptap/core';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

// Create a Math extension for inline math
const Math = Node.create({
  name: 'math',
  group: 'inline',
  inline: true,
  atom: true,

  addAttributes() {
    return {
      formula: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[data-type="math"]',
        getAttrs: element => ({
          formula: element.getAttribute('data-formula'),
        }),
      },
    ];
  },

  renderHTML({ node }) {
    return [
      'span',
      {
        'data-type': 'math',
        'data-formula': node.attrs.formula,
      },
      '$$' + node.attrs.formula + '$$',
    ];
  },

  addNodeView() {
    return ({ node, editor }) => {
      const dom = document.createElement('span');
      dom.setAttribute('data-type', 'math');
      dom.setAttribute('data-formula', node.attrs.formula);

      const update = () => {
        try {
          katex.render(node.attrs.formula, dom, {
            throwOnError: false,
            displayMode: false,
            trust: true, // Allow trust for specific commands
            macros: {
              // Add common LaTeX macros here if needed
              "\\R": "\\mathbb{R}",
              "\\N": "\\mathbb{N}",
              "\\Z": "\\mathbb{Z}"
            }
          });
        } catch (error) {
          console.error('KaTeX rendering error:', error);
          dom.textContent = `$$${node.attrs.formula}$$`;
        }
      };

      update();

      return {
        dom,
        update(updatedNode) {
          if (updatedNode.attrs.formula !== node.attrs.formula) {
            dom.setAttribute('data-formula', updatedNode.attrs.formula);
            update();
          }
          return true;
        },
      };
    };
  },
});

// Create a Math extension for block math (displayed equations)
const MathBlock = Node.create({
  name: 'mathBlock',
  group: 'block',
  content: 'text*',

  addAttributes() {
    return {
      formula: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="math-block"]',
        getAttrs: element => ({
          formula: element.getAttribute('data-formula'),
        }),
      },
    ];
  },

  renderHTML({ node }) {
    return [
      'div',
      {
        'data-type': 'math-block',
        'data-formula': node.attrs.formula,
        class: 'math-block',
      },
      '$$' + node.attrs.formula + '$$',
    ];
  },

  addNodeView() {
    return ({ node, editor }) => {
      const dom = document.createElement('div');
      dom.setAttribute('data-type', 'math-block');
      dom.setAttribute('data-formula', node.attrs.formula);
      dom.classList.add('math-block');

      const update = () => {
        try {
          katex.render(node.attrs.formula, dom, {
            throwOnError: false,
            displayMode: true,
            trust: true, // Allow trust for specific commands
            macros: {
              // Add common LaTeX macros here if needed
              "\\R": "\\mathbb{R}",
              "\\N": "\\mathbb{N}",
              "\\Z": "\\mathbb{Z}"
            }
          });
        } catch (error) {
          console.error('KaTeX rendering error:', error);
          dom.textContent = `$$${node.attrs.formula}$$`;
        }
      };

      update();

      return {
        dom,
        update(updatedNode) {
          if (updatedNode.attrs.formula !== node.attrs.formula) {
            dom.setAttribute('data-formula', updatedNode.attrs.formula);
            update();
          }
          return true;
        },
      };
    };
  },
});

// Math Formula Input Component
const MathFormulaInput = ({ isOpen, onClose, onSubmit, title, initialValue = '' }) => {
  const [formula, setFormula] = useState(initialValue);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (formula) {
      try {
        const element = document.createElement('div');
        katex.render(formula, element, {
          throwOnError: false,
          displayMode: title.includes('block'),
        });
        setPreview(element.innerHTML);
      } catch (error) {
        setPreview(`<span class="text-red-500">Error: ${error.message}</span>`);
      }
    } else {
      setPreview('');
    }
  }, [formula, title]);

  const handleSubmit = () => {
    onSubmit(formula);
    setFormula('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Enter your LaTeX formula below.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="formula">Formula</Label>
            <Input
              id="formula"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="e.g., E = mc^2"
              autoFocus
            />
          </div>
          {preview && (
            <div className="mt-2">
              <Label>Preview</Label>
              <div
                className="p-4 border rounded bg-gray-50 mt-1 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: preview }}
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onClose()}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit}>
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const MenuBar = ({ editor }) => {
  const [mathInlineOpen, setMathInlineOpen] = useState(false);
  const [mathBlockOpen, setMathBlockOpen] = useState(false);

  if (!editor) {
    return null;
  }

  const addMathInline = (formula) => {
    if (formula) {
      editor.chain().focus().insertContent({
        type: 'math',
        attrs: {
          formula: formula,
        },
      }).run();
    }
  };

  const addMathBlock = (formula) => {
    if (formula) {
      editor.chain().focus().insertContent({
        type: 'mathBlock',
        attrs: {
          formula: formula,
        },
      }).run();
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
          title="Bold"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
            <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z" />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
          title="Italic"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="4" x2="10" y2="4" />
            <line x1="14" y1="20" x2="5" y2="20" />
            <line x1="15" y1="4" x2="9" y2="20" />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('superscript') ? 'bg-gray-200' : ''}`}
          title="Superscript"
        >
          <span>x<sup>2</sup></span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('subscript') ? 'bg-gray-200' : ''}`}
          title="Subscript"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 7l8 10M13 7l-8 10" />
            <path d="M15 17h6m-3 3v-3" />
          </svg>
        </button>
        <button
          onClick={() => {
            // Insert a fraction slash
            editor.chain().focus().insertContent('/').run();
          }}
          className="p-1 rounded hover:bg-gray-200"
          title="Fraction Slash"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="7" y1="18" x2="17" y2="6" />
          </svg>
        </button>
        <button
          onClick={() => {
            // Insert square root symbol
            editor.chain().focus().insertContent('√').run();
          }}
          className="p-1 rounded hover:bg-gray-200"
          title="Square Root"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 16l3-10l10 14" />
            <path d="M9 6h9" />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
          title="Underline"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3" />
            <line x1="4" y1="21" x2="20" y2="21" />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().insertContent('∞').run()}
          className="p-1 rounded hover:bg-gray-200"
          title="Infinity"
        >
          <span>∞</span>
        </button>
        <button
          onClick={() => editor.chain().focus().insertContent('π').run()}
          className="p-1 rounded hover:bg-gray-200"
          title="Pi"
        >
          <span>π</span>
        </button>
        <button
          onClick={() => editor.chain().focus().insertContent('Δ').run()}
          className="p-1 rounded hover:bg-gray-200"
          title="Delta"
        >
          <span>Δ</span>
        </button>
        <button
          onClick={() => editor.chain().focus().insertContent('≈').run()}
          className="p-1 rounded hover:bg-gray-200"
          title="Approximately Equal"
        >
          <span>≈</span>
        </button>
        <button
          onClick={() => editor.chain().focus().insertContent('≠').run()}
          className="p-1 rounded hover:bg-gray-200"
          title="Not Equal"
        >
          <span>≠</span>
        </button>
        <button
          onClick={() => editor.chain().focus().insertContent('≥').run()}
          className="p-1 rounded hover:bg-gray-200"
          title="Greater Than or Equal"
        >
          <span>≥</span>
        </button>
        <button
          onClick={() => editor.chain().focus().insertContent('≤').run()}
          className="p-1 rounded hover:bg-gray-200"
          title="Less Than or Equal"
        >
          <span>≤</span>
        </button>
        <button
          onClick={() => editor.chain().focus().insertContent('∫').run()}
          className="p-1 rounded hover:bg-gray-200"
          title="Integral"
        >
          <span>∫</span>
        </button>
        <button
          onClick={() => editor.chain().focus().insertContent('∑').run()}
          className="p-1 rounded hover:bg-gray-200"
          title="Sum"
        >
          <span>∑</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
          title="Strike"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
            <path d="M16 6C16 6 16.5 8 12 8C10 8 8 7 8 6C8 4.5 10 4 12 4C14.5 4 16 5 16 6Z" />
            <path d="M8 18C8 18 7.5 16 12 16C14 16 16 17 16 18C16 19.5 14 20 12 20C9.5 20 8 19 8 18Z" />
          </svg>
        </button>
        <select
          onChange={(event) => {
            const selectedValue = event.target.value;
            if (selectedValue === 'paragraph') {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().toggleHeading({ level: parseInt(selectedValue.replace('h', '')) }).run();
            }
          }}
          className="p-1 border rounded hover:bg-gray-200"
          value={
            editor.isActive('heading', { level: 1 }) ? 'h1' :
              editor.isActive('heading', { level: 2 }) ? 'h2' :
                editor.isActive('heading', { level: 3 }) ? 'h3' :
                  'paragraph'
          }
        >
          <option value="paragraph">Normal</option>
          <option value="h1">Heading 1</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
        </select>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          title="Bullet List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="9" y1="6" x2="20" y2="6" />
            <line x1="9" y1="12" x2="20" y2="12" />
            <line x1="9" y1="18" x2="20" y2="18" />
            <circle cx="5" cy="6" r="1" />
            <circle cx="5" cy="12" r="1" />
            <circle cx="5" cy="18" r="1" />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-200' : ''}`}
          title="Ordered List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="10" y1="6" x2="20" y2="6" />
            <line x1="10" y1="12" x2="20" y2="12" />
            <line x1="10" y1="18" x2="20" y2="18" />
            <path d="M4 6h1v4" />
            <path d="M4 10h2" />
            <path d="M6 18H4c0 0 0-1 2-1c1 0 1 0.5 1 1s0 1-1 1c-1 0-1-0.5-1-1" />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('taskList') ? 'bg-gray-200' : ''}`}
          title="Task List"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="5" width="6" height="6" rx="1" />
            <path d="M9 6h12" />
            <path d="M9 10h12" />
            <rect x="3" y="13" width="6" height="6" rx="1" />
            <path d="M9 14h12" />
            <path d="M9 18h12" />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-200' : ''}`}
          title="Blockquote"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 11h-4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v6c0 2-1 3-3 3" />
            <path d="M19 11h-4a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v6c0 2-1 3-3 3" />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-1 rounded hover:bg-gray-200"
          title="Horizontal Rule"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button
          onClick={() => {
            const url = window.prompt('URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            } else {
              editor.chain().focus().unsetLink().run();
            }
          }}
          className={`p-1 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-200' : ''}`}
          title="Link"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </button>

        {/* Math Buttons */}
        <button
          onClick={() => setMathInlineOpen(true)}
          className="p-1 rounded hover:bg-gray-200"
          title="Inline Math"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h8M12 18h2M18 18h2" />
          </svg>
          <span className="ml-1">Σ</span>
        </button>
        <button
          onClick={() => setMathBlockOpen(true)}
          className="p-1 rounded hover:bg-gray-200"
          title="Block Math"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="ml-1">∫</span>
        </button>

        <div className="flex items-center">
          <label className="mx-1">Color:</label>
          <input
            type="color"
            onInput={(event) => {
              editor.chain().focus().setColor(event.target.value).run();
            }}
            value={editor.getAttributes('textStyle').color || '#000000'}
            className="w-6 h-6 rounded cursor-pointer"
            title="Text Color"
          />
        </div>
        <select
          onChange={(event) => {
            editor.chain().focus().setTextAlign(event.target.value).run();
          }}
          className="p-1 border rounded hover:bg-gray-200"
          value={
            editor.isActive({ textAlign: 'left' }) ? 'left' :
              editor.isActive({ textAlign: 'center' }) ? 'center' :
                editor.isActive({ textAlign: 'right' }) ? 'right' :
                  editor.isActive({ textAlign: 'justify' }) ? 'justify' :
                    'left'
          }
        >
          <option value="left">Align Left</option>
          <option value="center">Align Center</option>
          <option value="right">Align Right</option>
          <option value="justify">Justify</option>
        </select>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
          title="Undo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 14 4 9l5-5" />
            <path d="M4 9h11a4 4 0 0 1 4 4v3" />
          </svg>
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1 rounded hover:bg-gray-200 disabled:opacity-30"
          title="Redo"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="m15 14 5-5-5-5" />
            <path d="M20 9H9a4 4 0 0 0-4 4v3" />
          </svg>
        </button>
      </div>

      {/* Math Input Modals */}
      <MathFormulaInput
        isOpen={mathInlineOpen}
        onClose={() => setMathInlineOpen(false)}
        onSubmit={addMathInline}
        title="Insert Inline Math"
      />
      <MathFormulaInput
        isOpen={mathBlockOpen}
        onClose={() => setMathBlockOpen(false)}
        onSubmit={addMathBlock}
        title="Insert Block Math Equation"
      />
    </>
  );
};

const RichTextEditor = ({ value, onChange, reset, placeholder = "Type your content here..." }) => {
  const [mounted, setMounted] = useState(false);

  // Only render the editor on the client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      CharacterCount.configure({ limit: 10000 }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Highlight,
      Link.configure({
        openOnClick: false,
      }),
      Image,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Superscript,
      Subscript,
      TextStyle,
      Color,
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      CharacterCount.configure({
        limit: 10000,
      }),
      Placeholder.configure({
        placeholder,
      }),
      // Add the Math extensions
      Math,
      MathBlock,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Handle reset
  useEffect(() => {
    if (reset && editor) {
      editor.commands.setContent('');
    }
  }, [reset, editor]);

  // Update content if value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  // Add global styles for math blocks
  useEffect(() => {
    if (mounted) {
      const style = document.createElement('style');
      style.textContent = `
        .math-block {
          display: block;
          text-align: center;
          margin: 1em 0;
          padding: 0.5em;
          background-color: rgba(247, 247, 247, 0.7);
          border-radius: 0.25em;
        }
        span[data-type="math"] {
          padding: 0 0.25em;
          background-color: rgba(247, 247, 247, 0.5);
          border-radius: 0.25em;
        }
        .katex-error {
          color: red;
          font-size: 0.9em;
        }
      `;
      document.head.appendChild(style);
      return () => document.head.removeChild(style);
    }
  }, [mounted]);

  // Client-side only rendering
  if (!mounted) {
    return <div className="border rounded-md p-4 min-h-[150px]">Loading editor...</div>;
  }

  return (
    <div className="rich-text-editor border rounded-md overflow-hidden">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="p-4 min-h-[200px]" />
      <div className="text-xs text-gray-500 p-2 border-t">
        {editor && (
          <div className="flex justify-between">
            <span>Characters: {editor.storage.characterCount.characters()}</span>
            {editor.storage.characterCount.options?.limit && (
              <span>
                {editor.storage.characterCount.characters()}/{editor.storage.characterCount.options.limit}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RichTextEditor;