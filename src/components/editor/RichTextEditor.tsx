
'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Youtube from '@tiptap/extension-youtube'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { common, createLowlight } from 'lowlight'
import python from 'highlight.js/lib/languages/python'
import typescript from 'highlight.js/lib/languages/typescript'
import javascript from 'highlight.js/lib/languages/javascript'
import c from 'highlight.js/lib/languages/c'
import cpp from 'highlight.js/lib/languages/cpp'
import ResizableImageExtension from './extensions/ResizableImageExtension'
import { Button } from '@/components/ui/button'
import {
    Bold, Italic, List, ListOrdered, Link as LinkIcon,
    Youtube as YoutubeIcon, Heading1, Heading2, Quote, Code
} from 'lucide-react'
import { useCallback } from 'react'

const lowlight = createLowlight(common)
// Register additional languages
lowlight.register('python', python)
lowlight.register('typescript', typescript)
lowlight.register('javascript', javascript)
lowlight.register('c', c)
lowlight.register('cpp', cpp)
lowlight.register('c++', cpp) // Alias for C++

interface RichTextEditorProps {
    content: string
    onChange: (content: string) => void
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                codeBlock: false, // Disable default code block to use lowlight version
            }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
            Youtube.configure({
                controls: false,
                nocookie: true,
            }),
            ResizableImageExtension.configure({
                inline: false,
                allowBase64: true,
            }),
        ],
        content: content,
        immediatelyRender: false,
        editorProps: {
            attributes: {
                class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] p-6 [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_img]:rounded-xl [&_img]:mx-auto',
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
    })

    const addYoutubeVideo = useCallback(() => {
        const url = prompt('Enter YouTube URL')

        if (url) {
            editor?.commands.setYoutubeVideo({
                src: url,
                width: 640,
                height: 480,
            })
        }
    }, [editor])

    if (!editor) {
        return null
    }

    return (
        <div className="border border-border rounded-lg overflow-hidden bg-background shadow-sm">
            <div className="bg-muted/50 border-b border-border p-2 flex flex-wrap gap-2 sticky top-0 z-10">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                    className={editor.isActive('bold') ? 'bg-muted' : ''}
                >
                    <Bold className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                >
                    <Italic className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1 self-center" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    className={editor.isActive('heading', { level: 1 }) ? 'bg-muted' : ''}
                >
                    <Heading1 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
                >
                    <Heading2 className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1 self-center" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={editor.isActive('bulletList') ? 'bg-muted' : ''}
                >
                    <List className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={editor.isActive('orderedList') ? 'bg-muted' : ''}
                >
                    <ListOrdered className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    className={editor.isActive('blockquote') ? 'bg-muted' : ''}
                >
                    <Quote className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    className={editor.isActive('codeBlock') ? 'bg-muted' : ''}
                >
                    <Code className="h-4 w-4" />
                </Button>
                <div className="w-px h-6 bg-border mx-1 self-center" />
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={addYoutubeVideo}
                >
                    <YoutubeIcon className="h-4 w-4 mr-2" />
                    Add Video
                </Button>
            </div>
            <EditorContent editor={editor} />
        </div>
    )
}
