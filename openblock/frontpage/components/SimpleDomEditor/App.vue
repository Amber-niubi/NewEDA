<script>
import { DynamicComponent, DynamicComponentGroup, DynamicComponentEditor } from './vue3-simpledomeditor.mjs';
export default {
  data() {
    return {
      message: 'Hello Vue!',
      edit: false,
      group: [
        {
          type: 'div',
          props: {
            id: 'fadsfref', style: { 'color': 'red', height: '200px', width: '300px' }, 'data-editable': 'container'
          },
          slot: [
            { type: 'span', props: { id: '234f23r2f', 'data-editable': true, style: { position: 'absolute', left: '15px', top: '8px' } }, slot: '文字' },
            {
              type: 'i-button',
              props: {
                id: 'fd54g',
                type: 'primary', 'data-editable': true,
                style: { position: 'absolute', left: '25px', top: '38px' }
              },
              slot: ['按钮']
            }]
        }]
    }
  },
  components: {
    DynamicComponent, DynamicComponentGroup, DynamicComponentEditor
  }
}
</script>

<template>
  {{ message }}
  <Button type="primary" @click="edit = !edit">{{ edit ? '退出编辑' : '进入编辑' }}</Button>
  <DynamicComponent name="div"><span>abc</span></DynamicComponent>
  <DynamicComponentGroup style="margin:20px;position:relative" :group="group"></DynamicComponentGroup>
  <DynamicComponentEditor style="margin:20px;position:relative" :editable="edit" mask-color="rgb(234, 255, 225,0.5)"
    :group="group">
  </DynamicComponentEditor>
</template>

<style scoped></style>
