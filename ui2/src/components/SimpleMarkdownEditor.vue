<template>
  <div>
    <div class="markdown-editor">
      <textarea></textarea>
    </div>
  </div>
</template>

<style>
.markdown-editor {
  text-align: left;
}
.editor-toolbar.fullscreen {
  z-index: 1100;
}
</style>

<script>
require('simplemde/dist/simplemde.min.css');
import SimpleMDE from 'simplemde';

export default {
  name: 'simple-markdown-editor',
  props: {
    value: String,
    config: {
      type: Object,
      default () {
        return {
          spellChecker: false,
          showIcons: ['code', 'horizontal-rule', 'link', 'table'],
          guide: '/#/guide',
        };
      },
    }
  },
  data () {
    return {
      simplemde: undefined,
    }
  },
  asyncData: {
  },
  computed: {
  },
  watch: {
    value (val) {
      if (val === this.simplemde.value()) return;
      this.simplemde.value(val);
    },
  },
  mounted () {
    this.init();
    this.simplemde.value(this.value);
  },
  destroyed () {
  },
  methods: {
    init () {
      var conf = Object.assign({
        element: this.$el.querySelector('textarea'),
      }, this.config)
      this.simplemde = new SimpleMDE(conf);
      this.simplemde.codemirror.on('change', () => {
        this.$emit('input', this.simplemde.value());
      });
    },
    stop () {
      this.simplemde.toTextArea();
      this.simplemde = undefined;
    },
  },
}
</script>

