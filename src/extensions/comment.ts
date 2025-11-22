import { Mark, mergeAttributes } from '@tiptap/core';

export interface CommentOptions {
    HTMLAttributes: Record<string, any>;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        comment: {
            /**
             * Set a comment mark
             */
            setComment: (comment: string) => ReturnType;
            /**
             * Unset a comment mark
             */
            unsetComment: () => ReturnType;
        };
    }
}

export const Comment = Mark.create<CommentOptions>({
    name: 'comment',

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            comment: {
                default: null,
                parseHTML: (element) => element.getAttribute('data-comment'),
                renderHTML: (attributes) => {
                    if (!attributes.comment) {
                        return {};
                    }

                    return {
                        'data-comment': attributes.comment,
                    };
                },
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-comment]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0];
    },

    addCommands() {
        return {
            setComment:
                (comment) =>
                    ({ commands }) => {
                        return commands.setMark(this.name, { comment });
                    },
            unsetComment:
                () =>
                    ({ commands }) => {
                        return commands.unsetMark(this.name);
                    },
        };
    },
});
