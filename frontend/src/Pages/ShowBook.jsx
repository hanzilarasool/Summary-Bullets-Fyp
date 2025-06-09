import { useState, useEffect } from "react";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView, lightDefaultTheme } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";

const ShowBook = ({ initialContent }) => {
  const [editor, setEditor] = useState(null);
  const [visibleContent, setVisibleContent] = useState([]);
  const [remainingContent, setRemainingContent] = useState([]);
  const [showMore, setShowMore] = useState(false);

  // Call useCreateBlockNote directly in the component body
  const newEditor = useCreateBlockNote();

  useEffect(() => {
    setEditor(newEditor);

    if (initialContent) {
      const blocks = initialContent;
      const visibleBlocks = blocks.slice(0, 50); // Display first 50 blocks initially
      const remainingBlocks = blocks.slice(50); // Remaining blocks

      setVisibleContent(visibleBlocks);
      setRemainingContent(remainingBlocks);
      setShowMore(remainingBlocks.length > 0);

      newEditor.replaceBlocks(newEditor.document, visibleBlocks);
    }
  }, [initialContent]);

  const handleShowMore = () => {
    const nextBlocks = remainingContent.slice(0, 50); // Show next 50 blocks
    const newVisibleContent = [...visibleContent, ...nextBlocks];
    const newRemainingContent = remainingContent.slice(50);

    setVisibleContent(newVisibleContent);
    setRemainingContent(newRemainingContent);
    setShowMore(newRemainingContent.length > 0);

    if (editor) {
      editor.replaceBlocks(editor.document, newVisibleContent);
    }
  };

  if (!editor) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center p-0">
      <BlockNoteView
        editor={editor}
        theme={lightDefaultTheme}
        editable={false}
        className="mb-4"
      />
      {showMore && (
        <button
          onClick={handleShowMore}
          className="px-4 py-3 bg-gray-300 font-medium text-gray-500 rounded hover:bg-gray-400 hover:text-gray-600 transition-colors duration-300 ease-in-out font-inter"
        >
          Read on
        </button>
      )}
    </div>
  );
};

export default ShowBook;
