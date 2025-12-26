
import Image from '@tiptap/extension-image'
import { ReactNodeViewRenderer } from '@tiptap/react'
import ResizableImageComponent from './ResizableImageComponent'

const ResizableImageExtension = Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: '100%',
                renderHTML: (attributes) => {
                    return {
                        width: attributes.width,
                        style: `width: ${attributes.width}`,
                    }
                },
            },
            height: {
                default: 'auto',
                renderHTML: (attributes) => {
                    return {
                        height: attributes.height,
                        style: `height: ${attributes.height}`,
                    }
                },
            },
        }
    },

    addNodeView() {
        return ReactNodeViewRenderer(ResizableImageComponent)
    },
})

export default ResizableImageExtension
