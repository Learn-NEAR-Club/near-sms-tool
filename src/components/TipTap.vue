<template>
  <div
    class="editor"
    :style="[isDetail ? { height: 'auto' } : { minHeight: '100px' }]"
    v-if="editor"
  >
    <MenuBarTipTap class="editor__header" :editor="editor" v-show="!isDetail" />
    <EditorContent
      :class="['editor__content', { 'modal-expand': expandModal }]"
      :editor="editor"
    />
  </div>
</template>

<script>
import { Editor, EditorContent } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import MenuBarTipTap from "../components/MenuBarTipTap.vue";
import Highlight from "@tiptap/extension-highlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlock from "@tiptap/extension-code-block";
import Code from "@tiptap/extension-code";
import Underline from "@tiptap/extension-underline";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Link from "@tiptap/extension-link";
import TextStyle from "@tiptap/extension-text-style";
import FontFamily from "@tiptap/extension-font-family";
import Blockquote from "@tiptap/extension-blockquote";

export default {
  components: {
    EditorContent,
    MenuBarTipTap,
  },

  props: {
    modelValue: {
      type: String,
      default: "",
    },
    isDetail: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      editor: null,
    };
  },

  computed: {
    expandModal() {
      return this.$store.state.sendMessageModal.isExpand;
    },
  },

  watch: {
    modelValue(value) {
      // HTML
      const isSame = this.editor.getHTML() === value;

      // JSON
      // const isSame = this.editor.getJSON().toString() === value.toString()

      if (isSame) {
        return;
      }

      this.editor.commands.setContent(value, false);
    },
  },

  mounted() {
    this.editor = new Editor({
      extensions: [
        StarterKit,
        Highlight,
        TaskList,
        TaskItem,
        Code,
        CodeBlock,
        Underline,
        Superscript,
        Subscript,
        Link.configure({
          openOnClick: true,
        }),
        TextStyle,
        FontFamily,
        Blockquote,
      ],
      content: this.modelValue,
      onUpdate: () => {
        this.$emit("updateModelValue", this.editor.getHTML());
      },
    });
    this.editor.setOptions({ editable: this.isDetail ? false : true });
  },

  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style lang="scss" scoped>
.editor {
  display: flex;
  flex-direction: column;
  height: 205px;
  color: #0d0d0d;
  background-color: #fff;
  border: none;
  border-radius: 0.75rem;

  &__header {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    flex-wrap: wrap;
    padding: 0.25rem;
    border-bottom: 3px solid var(--color-menu);
  }

  &__content {
    // max-width: 578px;
    width: 100%;
    padding: 0.25rem 1rem;
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }
  &__content.modal-expand {
    width: 100%;
    margin: 0 auto;
  }

  @media (max-width: 1024px) {
    &__content {
      // width: 420px;
      padding: 0.25rem 0;
      margin: 0 auto;
    }
    &__content.modal-expand {
      width: 700px;
      padding: 0.25rem 0;
      margin: 0 auto;
    }
  }

  @media (max-width: 767px) {
    &__content {
      // width: 300px;
      padding: 0.25rem 0;
      margin: 0 auto;
    }
  }
}
@media (max-width: 1024px) {
  .editor {
    height: 180px;
  }
}
@media (max-width: 900px) {
  .editor {
    height: 205px;
  }
}
@media (max-width: 500px) {
  .editor {
    height: 235px;
  }
}
.collaboration-cursor__caret {
  position: relative;
  margin-left: -1px;
  margin-right: -1px;
  border-left: 1px solid #0d0d0d;
  border-right: 1px solid #0d0d0d;
  word-break: normal;
  pointer-events: none;
}

/* Render the username above the caret */
.collaboration-cursor__label {
  position: absolute;
  top: -1.4em;
  left: -1px;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  color: #0d0d0d;
  padding: 0.1rem 0.3rem;
  border-radius: 3px 3px 3px 0;
  white-space: nowrap;
}

/* Basic editor styles */
.ProseMirror {
  > * + * {
    margin-top: 0.75em;
  }

  ul,
  ol {
    padding: 0 1rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1.1;
  }

  a {
    color: #68cef8;
  }

  mark {
    background-color: #faf594;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  hr {
    margin: 1rem 0;
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0d0d0d, 0.1);
    margin: 2rem 0;
  }

  ul[data-type="taskList"] {
    list-style: none;
    padding: 0;

    li {
      display: flex;
      align-items: center;

      > label {
        flex: 0 0 auto;
        margin-right: 0.5rem;
        user-select: none;
      }

      > div {
        flex: 1 1 auto;
      }
    }
  }
}
</style>
