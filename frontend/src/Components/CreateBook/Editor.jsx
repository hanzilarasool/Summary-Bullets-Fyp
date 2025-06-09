import React, { useEffect } from 'react';
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView, lightDefaultTheme } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

const Editor = ({ initialContent, onChange }) => {
    const editor = useCreateBlockNote();

    useEffect(() => {
        if (initialContent) {
            const loadContent = async () => {
                // const blocks = await editor.tryParseHTMLToBlocks(initialContent);
                const blocks = JSON.parse(initialContent);
                editor.replaceBlocks(editor.document, blocks);
            };
            loadContent();
        }
    }, [initialContent, editor]);

    useEffect(() => {
        if (onChange) {
            const handleChange = () => {
                onChange(editor.document);
            };
            editor.onChange(handleChange);
        }
    }, [editor, onChange]);

    return <BlockNoteView editor={editor} theme={lightDefaultTheme} />;
};

export default Editor;