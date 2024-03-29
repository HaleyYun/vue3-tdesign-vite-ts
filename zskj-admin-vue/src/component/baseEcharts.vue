<template>
    <div class="echarts">
      <div ref="baseEcharts" :style="{width:width,height:height}"></div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import {reactive,toRefs,ref,withDefaults,defineProps,onMounted,watchEffect} from "vue";
  import useEcharts from "../utils/useEcharts";
  let baseEcharts= ref(null)
  let props = withDefaults(
      defineProps<{
          width?:string,
          height?:string,
          options?:any
      }>(),{
          width:'100%',
          height:'200px'
      }
  )
  onMounted(()=>{
      console.log();
      
      let {setOptions,resize} = useEcharts(baseEcharts.value)
      watchEffect(()=>{
          setOptions(props.options)
      })
      window.addEventListener('resize',function () {
          resize()
      })
  })
  </script>
  
  <style lang="scss" scoped>
  </style>
  