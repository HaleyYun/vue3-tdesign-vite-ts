<template>
  <div>
    <div style="border: 1px solid #ccc; margin-top: 10px; z-index: 999">
      <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" style="border-bottom: 1px solid #ccc" />
      <Editor disabled readonly :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml" @onCreated="handleCreated" @onChange="handleChange" @onDestroyed="handleDestroyed" @onFocus="handleFocus" @onBlur="handleBlur" @customAlert="customAlert" />
      <t-loading :loading="loading" text="正在上传视频..." fullscreen />
    </div>
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css'; // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue';
import { MessagePlugin } from 'tdesign-vue-next';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import axios from 'axios';

export default {
  components: { Editor, Toolbar },
  props: {
    disable: {
      type: Boolean,
      default: true
    },
    editorId: {
      type: String,
      default: 'vocenEdiltor'
    },
    width: {
      type: Number,
      default: 300
    },
    maxSize: {
      type: Number,
      default: 50
    },
    /**
     * 高度
     */
    height: {
      type: Number,
      default: 500
    },
    /**
     * 层级
     */
    zIndex: {
      type: Number,
      default: 20
    },
    /**
     * 提示文字
     */
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    /**
     * 初始化是否自动获取焦点 默认获取
     */
    focus: {
      type: Boolean,
      default: false
    },
    /**
     * 初始化内容
     */
    content: {
      type: String,
      default: ''
    },
    /**
     *  菜单配置
     */
    menus: {
      type: Array,
      default: [
        'head',
        'bold',
        'fontSize',
        'fontName',
        'italic',
        'underline',
        'strikeThrough',
        'indent',
        'lineHeight',
        'foreColor',
        'backColor',
        'link',
        'list',
        'todo',
        'justify',
        'quote',
        'emoticon',
        // 'image',
        // 'video',
        'table',
        'code',
        'splitLine',
        'undo',
        'redo'
      ]
    },
    /**
     *  配置颜色（文字颜色、背景色）
     */
    colors: {
      type: Array,
      default: ['#000000', '#eeece0', '#1c487f', '#4d80bf']
    },
    /**
     *  配置字体
     */
    fontNames: {
      type: Array,
      default: ['黑体', '仿宋', '楷体', '标楷体', '华文仿宋', '华文楷体', '宋体', '微软雅黑', 'Arial', 'Tahoma', 'Verdana', 'Times New Roman', 'Courier New']
    },
    /**
     *  配置文字大小
     */
    fontSizes: {
      type: Object,
      default: {
        'x-small': { name: '10px', value: '1' },
        small: { name: '13px', value: '2' },
        normal: { name: '16px', value: '3' },
        large: { name: '18px', value: '4' },
        'x-large': { name: '24px', value: '5' },
        'xx-large': { name: '32px', value: '6' },
        'xxx-large': { name: '48px', value: '7' }
      }
    },
    /**
     * 是否显示全屏
     */
    showFullScreen: {
      type: Boolean,
      default: true
    },
    /**
     * 菜单提示   up  上标  down下标
     */
    menuTooltipPosition: {
      type: String,
      default: 'up'
    }
  },
  setup(props, { emit }) {
    const uploadUrl = import.meta.env.VITE_API_BASE_URL + '/zskj/admin/common/upload';
    const token = localStorage.getItem('x-auth-token');
    axios.defaults.headers.common['token'] = token;
    // 编辑器实例，必须用 shallowRef，重要！
    const editorRef = shallowRef();
    const loading = ref(false);
    // 内容 HTML
    const valueHtml = ref('');
    // 模拟 ajax 异步获取内容
    onMounted(() => {});
    /**
     * 获取富文本html
     */
    const getHtml = () => {
      return editorRef.value.getHtml();
    };

    /**
     * 添加富文本内容
     *
     **/
    const setHtml = content => {
      editorRef.value.setHtml(content);
    };

    const toolbarConfig = {};
    toolbarConfig.excludeKeys = [
      'insertVideo' // 去除插入视频
    ];

    // console.log(editorRef.value)
    const editorConfig = { placeholder: '请输入内容...', MENU_CONF: {} };

    editorConfig.MENU_CONF['fontSize'] = {
      fontSizeList: [
        // 元素支持两种形式
        //   1. 字符串；
        //   2. { name: 'xxx', value: 'xxx' }
        '12px',
        '16px',
        '18px',
        '20px',
        '40px'
      ]
    };
    editorConfig.MENU_CONF['uploadImage'] = {
      // 自定义上传
      // 单个文件的最大体积限制，默认为 2M
      maxFileSize: 100 * 1024 * 1024, // 1M
      async customUpload(file, insertFn) {
        // TS 语法
        // console.log(file)
        let maxSize = props.maxSize * 1024 * 1024;
        if (file.size > maxSize) {
          // message.error(`文件大小不能超过${props.maxSize}M`)
          return;
        }
        const param = new FormData();
        param.append('file', file);
        try {
          axios.post(uploadUrl, param).then(res => {
            console.log(res);
            insertFn(res.data.data, '1', res.data.data);
            MessagePlugin.success('图片上传成功');
          });
        } catch (e) {
          console.warn(e, '上传失败');
          // message.success('上传失败')
        }
      }
    };

    editorConfig.MENU_CONF['uploadVideo'] = {
      // 自定义上传
      async customUpload(file, insertFn) {
        console.log(file);
        // TS 语法
        loading.value = true;
        let maxSize = props.maxSize * 1024 * 1024;
        if (file.size > maxSize) {
          // message.error(`文件大小不能超过${props.maxSize}M`)
          return;
        }
        const param = new FormData();
        param.append('file', file);
        try {
          axios.post(uploadUrl, param).then(res => {
            // console.log(res);
            insertFn(res.data.data, 'video', res.data.data);
            MessagePlugin.success('视频上传成功');
            loading.value = false;
          });
        } catch (e) {
          console.log(e);
        }
      }
      // 上传前
      // onBeforeUpload(file) {   // TS 语法
      //   // onBeforeUpload(file) {      // JS 语法
      //   // file 选中的文件，格式如 { key: file }
      //   // 可以 return
      //   // 1. return file 或者 new 一个 file ，接下来将上传
      //   // 2. return false ，不上传这个 file
      // },

      // 上传中回调函数
      // onProgress(progress) {  // TS 语法
      //   // onProgress(progress) {       // JS 语法
      //   // progress 是 0-100 的数字
      //   console.log('progress', progress)
      // },
      // // 上传成功
      // onSuccess(file, res) {  // TS 语法
      //   // onSuccess(file, res) {          // JS 语法
      //   progress = 100
      // },
    };

    // 编辑器回调函数
    const handleCreated = editor => {
      editorRef.value = editor; // 记录 editor 实例，重要！
    };
    const handleChange = editor => {
      // editorRef.value.getAllMenuKeys() // 所有菜单键名
      // console.log('change:', editor.getHtml(), emit);
      emit('onChange', editor.getHtml());
    };
    const handleDestroyed = editor => {
      // console.log('destroyed', editor)
    };
    const handleFocus = editor => {
      // console.log('focus', editor)
    };
    const handleBlur = editor => {
      // console.log('blur', editor)
    };
    const customAlert = (info, type) => {
      // alert(`【自定义提示】${type} - ${info}`)
    };

    const insertText = () => {
      const editor = editorRef.value;
      if (editor == null) return;
      editor.insertText('hello world');
    };

    const printHtml = () => {
      const editor = editorRef.value;
      if (editor == null) return;
    };

    const disable = () => {
      const editor = editorRef.value;
      if (editor == null) return;
      editor.disable();
    };
    // 组件销毁时，也及时销毁编辑器，重要！
    onBeforeUnmount(() => {
      const editor = editorRef.value;
      if (editor == null) return;
      editor.destroy();
    });

    return {
      editorRef,
      mode: 'default',
      valueHtml,
      toolbarConfig,
      editorConfig,
      loading,
      handleCreated,
      handleChange,
      handleDestroyed,
      handleFocus,
      handleBlur,
      customAlert,
      insertText,
      printHtml,
      disable,
      getHtml,
      setHtml
    };
  }
};
</script>
