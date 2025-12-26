
import { NodeViewWrapper } from '@tiptap/react'
import React from 'react'
import { Resizable } from 're-resizable'

const ResizeHandle = () => (
    <div className="w-2.5 h-2.5 bg-primary border border-white rounded-full shadow-sm" />
)

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function ResizableImageComponent(props: any) {
    return (
        <NodeViewWrapper className="image-resizer flex justify-center">
            <Resizable
                size={{
                    width: props.node.attrs.width,
                    height: props.node.attrs.height,
                }}
                onResizeStop={(e, direction, ref, d) => {
                    props.updateAttributes({
                        width: ref.style.width,
                        height: ref.style.height,
                    })
                }}
                defaultSize={{
                    width: '100%',
                    height: 'auto',
                }}
                maxWidth="100%"
                enable={{
                    left: true,
                    right: true,
                }}
                handleStyles={{
                    left: { left: -12, width: 20 },
                    right: { right: -12, width: 20 },
                }}
                handleComponent={{
                    left: props.selected ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-1.5 h-8 bg-primary/50 rounded-full hover:bg-primary transition-colors cursor-col-resize" />
                        </div>
                    ) : undefined,
                    right: props.selected ? (
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-1.5 h-8 bg-primary/50 rounded-full hover:bg-primary transition-colors cursor-col-resize" />
                        </div>
                    ) : undefined,
                }}
                className={`!relative transition-shadow duration-200 ${props.selected ? 'outline outline-2 outline-primary outline-offset-2 rounded-lg' : ''}`}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <img
                    src={props.node.attrs.src}
                    alt={props.node.attrs.alt}
                    className="rounded-lg shadow-sm object-cover w-full h-full"
                />
            </Resizable>
        </NodeViewWrapper>
    )
}
