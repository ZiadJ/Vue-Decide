<script setup lang="ts">
import type { ColumnProps } from 'primevue/column'
import type {
  TreeTableExpandedKeys,
  TreeTableFilterMeta
} from 'primevue/treetable'
import { unref, ref, reactive, onMounted, computed, watch } from 'vue'
import { useToast } from 'primevue/usetoast'
import type { TreeNode } from 'primevue/tree'
import Editor, { type EditorTextChangeEvent } from 'primevue/editor'
import type Tree from 'primevue/tree'
import {
  useWindowSize,
  useStorage,
  useLastChanged,
  useDebounce,
  useDebounceFn
} from '@vueuse/core'
import treeutils from '@/methods/treeutils'
import type { RatingChangeEvent } from 'primevue/rating'

import { log, json } from '@/methods/utils'

//import { log } from 'src/views/console.vue'

//watch(useWindowSize().height, (val) => { log(val) })
json('adsf')
const toast = useToast()

function notify(title: string, content: string, severity: string = 'success') {
  //alert(content);
  toast.add({
    severity: severity,
    summary: title,
    detail: content,
    life: 3000
  })
}

const props = defineProps({
  jsonUrl: { type: String, required: true }
})

onMounted(async () => {
  if (!rootNode.value.length) {
    const data = await (await fetch(props.jsonUrl)).json()
    log(data)
    rootNode.value = data.root
  }

  for (let i = 0; i < 4; i++) addColumn()
})

const rootNode = useStorage<TreeNode[]>('rootNode', [])

const selectedNode = ref<TreeNode>({ data: {} })

const columns = ref<ColumnProps[]>([
  // {
  //   columnKey: '0',
  //   header: 'Buttons',
  //   style: 'width: 1px !important;',
  //   class: 'button-column',
  //   dataType: 'button',
  //   sortable: false,
  //   frozen: true
  // },
  {
    columnKey: '1',
    field: 'title',
    header: 'Goal',
    dataType: 'html',
    expander: true,
    style: 'width: 50% !important; min-width: 50% !important',
    class: 'name-column',
    frozen: true
  },
  {
    columnKey: '2',
    field: 'weight',
    header: 'Weight',
    dataType: 'star',
    style: 'width: 150px !important',
    class: 'weight-column'
  }
])

// ref<TreeTableFilterMeta>({'global': {value: null, matchMode: FilterMatchMode.CONTAINS}});)
const searchFilters = ref({ global: '' })

/// State
const st = reactive({
  //show: false,
  treeCheckboxes: false,
  editorButtons: ['bold', 'italic', 'underline', 'link', 'color', 'background'],
  ratingControlType: ref('knob'),
  count: 0
})

function addColumn() {
  const index = columns.value.length - 1

  let col: ColumnProps = {
    columnKey: columns.value.length.toString(),
    field: 'proposal-goal-' + index,
    dataType: st.ratingControlType,
    header: 'Proposal' + index,
    class: 'proposal-rating proposal-index-' + index
  }

  columns.value.push(col)
  visibleColumns.value = columns.value
  // selectedColumns.value.push(col)
  // selectedColumns.value = selectedColumns.value.filter(function (elem, index, self) {
  //   return index === self.indexOf(elem)
  // })
}

const visibleColumns = ref(columns.value)

const selectedKeys = ref([])

const selectedNodes = ref<TreeNode[]>([])

function onToggle(val: any) {
  visibleColumns.value = columns.value.filter((col) => val.includes(col))
}

function onNodeSelect(node: TreeNode) {
  selectedNode.value = node
  selectedNodes.value.push(node)
  log(node)
}

function onNodeUnselect(node: any) {
  selectedNodes.value = selectedNodes.value.filter(
    ({ key }) => key !== node.key
  )
}

const addNode = (event: MouseEvent) => {
  if (!selectedNode.value) selectedNode.value = rootNode.value

  const newNode: TreeNode = {
    key: (-Math.random() * 1000).toFixed(0).toString(),
    data: {
      title: 'New goal',
      content: 'New content'
    }
  }

  if (selectedNode.value.children == undefined) selectedNode.value.children = []

  if (selectedNode.value.children && selectedNode.value.children.length)
    expandedKeys.value[selectedNode.value.key as any] = {}

  selectedNode.value.children.push(newNode)
  expandedKeys.value.push(selectedNode.value)
}

const expandedKeys = ref<TreeTableExpandedKeys[]>([])

// function expandNode(node: TreeNode) {
//   if (!node) node = st.selectedNode.value

//   if (node.children && node.children.length) {
//     expandedKeys.value[node.key] = true

//     for (let child of node.children) {
//       expandNode(child)
//     }
//   }
// }

//const proposalText = ref('')
const proposalIndex = ref('0')
const treeTableMouseOver = (e: MouseEvent) => {
  const el = (e.target as Element).closest('.proposal-rating')
  //if (e.button == 1)
  if (el) {
    log((proposalIndex.value = 'Proposal ' + el.className.split('-').slice(-1)))
  }
}

const jsonData = computed({
  get: function () {
    return json(rootNode.value, 2)
  },
  set: function (newValue: string) {
    rootNode.value = JSON.parse(newValue)
  }
})

const debounceNotify = useDebounceFn((title: any, content: any) => {
  notify(title, json(content))
}, 2000)

function onEditorChanged(e: EditorTextChangeEvent) {
  debounceNotify(`Text changed for goal`, json(e.delta))
}

function onProposalRateChange(e: RatingChangeEvent | number, args: any) {
  debounceNotify(
    'Rating changed',
    `${typeof e == 'number' ? e : e.value} for goal ${args.key}`
  )
}

const items = ref([
  {
    label: 'Update',
    icon: 'pi pi-refresh'
  },
  {
    label: 'Delete',
    icon: 'pi pi-times'
  }
])
</script>

<template>
  <Toast style="opacity: 0.9" />
  <!-- <Dialog title="test" content="test"></Dialog> -->
  <br />
  <br />
  <div style="margin: 15px">
    <div class="p-input-icon-left">
      <i class="pi pi-search"></i>
    </div>
    <InputText
      autofocus
      v-model.lazy="searchFilters['global']"
      placeholder="Search"
      size="25"
      style="z-index: 1"
    />&nbsp;
    <Button
      type="button"
      icon="pi pi-plus"
      class="p-button-success"
      @click="addColumn"
      v-tooltip="'Add new proposal'"
      style="height: 36px; width: 36px; margin: 1px 5px"
    ></Button>
    <span style="margin: 10px 40px; position: absolute; font-size: 12px"
      >Source: {{ jsonUrl }}</span
    >
    <div style="position: absolute; right: 0; top: -3px">
      <ToggleButton
        v-model="st.treeCheckboxes"
        onIcon="pi pi-times"
        offIcon="pi pi-check"
        style="height: 43px"
      />
      <MultiSelect
        :modelValue="visibleColumns"
        @update:modelValue="onToggle"
        :options="columns"
        optionLabel="header"
        placeholder="Select Columns"
        style="width: 20em; text-align: left; height: 43px"
      />
    </div>
  </div>
  <Toolbar>
    <template #start>
      <Button label="New" icon="pi pi-plus" class="mr-2" />
      <Button label="Upload" icon="pi pi-upload" class="p-button-success" />
      <i class="pi pi-bars p-toolbar-separator mr-2" />
      <SplitButton
        label="Save"
        icon="pi pi-check"
        :model="items"
        class="p-button-warning"
      ></SplitButton>
    </template>

    <template #end>
      <Button icon="pi pi-search" class="mr-2" />
      <Button icon="pi pi-calendar" class="p-button-success mr-2" />
      <Button icon="pi pi-times" class="p-button-danger" />
    </template>
  </Toolbar>
  <TreeTable
    @mousemove="treeTableMouseOver"
    :value="rootNode"
    :selectionMode="st.treeCheckboxes ? 'checkbox' : 'multiple'"
    v-model:selectionKeys="selectedKeys"
    :expandedKeys="expandedKeys"
    @nodeSelect="onNodeSelect"
    @nodeUnselect="onNodeUnselect"
    scrollHeight="600px"
    :filters="searchFilters"
    filterMode="lenient"
    :resizableColumns="true"
    :showGridlines="false"
    columnResizeMode="expand"
    :scrollable="true"
    sortMode="single"
    removableSort
    class="p-treetable p-treetable-sm"
    responsiveLayout="scroll"
    style="height: calc(100vh - 180px)"
  >
    <!-- scrollDirection="both" -->
    <template #header style="padding: 0">
      <Splitter style="height: 85px">
        <SplitterPanel>
          <Editor
            v-model="selectedNode.data.content"
            editorStyle="height: 80px; font-size: 14px;"
            :autoResize="true"
          />
          <!-- <template #toolbar v-if="st.treeCheckboxes" v-for="button of st.editorButtons">
              <span class="ql-formats">
                <button class="ql-{{ button }}"></button>
              </span>
          </template>-->
        </SplitterPanel>
        <SplitterPanel>
          <!-- <Textarea v-model="proposalIndex" style="width: 100%; height: 100%" readonly /> -->
          <Editor
            :readonly="true"
            v-model="proposalIndex"
            editorStyle="height: 80px; font-size: 14px;"
            :autoResize="true"
          />
        </SplitterPanel>
      </Splitter>
    </template>

    <Column
      v-for="col of visibleColumns"
      :key="col.columnKey"
      :frozen="col.frozen"
      :field="col.field"
      :header="col.header"
      :expander="col.expander"
      :headerClass="col.headerClass"
      :bodyClass="col.bodyClass"
      :class="col.class"
      :headerStyle="col.bodyStyle"
      :bodyStyle="col.bodyStyle"
      :style="col.style"
      :sortable="col.sortable != undefined ? col.sortable : true"
      :rowEditor="true"
    >
      <template #header="slotProps" v-if="col.dataType == 'button'">
        <Button type="button" icon="pi pi-cog" class="p-button"></Button>
      </template>

      <template #header="slotProps" v-else-if="col.class == 'name-column'">
        <Button
          @click="addNode"
          type="button"
          icon="pi pi-plus"
          class="p-button-warning"
          v-tooltip="'Add new goal'"
          style="
            height: 35px;
            width: 35px;
            margin: -4px;
            top: 8px;
            left: 8px;
            position: absolute;
          "
        ></Button>
      </template>

      <!-- <template #body="slotProps" v-if="col.dataType == 'button'">
        <Button type="button" icon="pi pi-plus" class="p-button"></Button>
      </template>-->

      <template #body="slotProps" v-if="col.dataType == 'html'">
        <div v-if="!st.treeCheckboxes" style="width: 100%">
          <div>
            <Editor
              v-model.lazy="slotProps.node.data[col.field + '']"
              editorStyle="font-size: 14px;"
              :autoResize="true"
              @text-change="onEditorChanged"
              v-tooltip="slotProps.node.data.content"
            />
            <span
              style="
                font-size: 11px;
                position: absolute;
                right: 0;
                top: calc(50% - 6px);
              "
              >({{ slotProps.node.children?.length }})</span
            >
          </div>
        </div>
        <span
          v-else
          v-html="json(slotProps, -1)"
          style="display: inline-block"
        ></span>
      </template>

      <template #body="slotProps" v-else-if="col.dataType == 'star'">
        <Rating
          class="slider"
          v-model.number="slotProps.node.data[col.field]"
          :cancel="false"
          @change="onProposalRateChange($event, slotProps.node)"
          style="white-space: pre; transform: scale(0.75)"
        />
      </template>

      <template #body="slotProps" v-else-if="col.dataType == 'knob'">
        <Knob
          class="knob"
          v-model="slotProps.node.data[col.field]"
          :step="1"
          :size="50"
          :min="-5"
          :max="5"
          @change="onProposalRateChange($event, slotProps.node)"
        />
      </template>

      <!-- <template #body="slotProps" v-else-if="col.dataType == 'slider'">
        <Slider v-model="slotProps.node.data[col.field]" :step="1" :min="-5" :max="5" />
      </template>-->
    </Column>
  </TreeTable>
  <!-- <InputText type="text" v-model="st.ratingType" ></InputText> -->

  <br />
  <Textarea
    v-if="st.treeCheckboxes"
    v-model="jsonData"
    style="height: 150px; width: 100%; margin-top: 200px; overflow: scroll"
  ></Textarea>
</template>

<style scoped>
.knob,
.slider {
  width: 100%;
  text-align: center;
  margin: -5px 0px -15px 0;
}
</style>

<style>
.ql-toolbar {
  display: none;
}
/*.p-editor-container .p-editor-content .ql-editor {
  background: transparent !important;
}*/
.ql-toolbar.ql-snow + .ql-container.ql-snow {
  border: none;
}
.p-treetable .p-treetable-header {
  padding: 0 !important;
}

.p-treetable-header {
  padding: 0;
}
.p-treetable tr.p-highlight {
  background: #ffffffaa !important;
  color: #111 !important;
  /* background: #ffffff22 !important;
  color: #fff !important; */
}

.p-treetable tr.p-highlight .ql-editor {
  background: transparent !important;
  color: #181818 !important;
}

.p-treetable tr .ql-editor {
  background: transparent !important;
}

.p-treetable tr.p-highlight .p-rating .p-rating-icon {
  color: #2b6893;
}
.p-treetable tr.p-highlight .p-knob-text {
  color: #2b6893;
}
:root .p-highlight {
  --text-color-secondary: #111;
}
.p-treetable.p-treetable-sm .p-treetable-thead > tr > th {
  background: #2a323df5 !important;
  text-align: center;
  display: inline-block;
}

.p-treetable .p-treetable-thead > tr > th {
  box-shadow: 10px 5px 0px rgba(0, 0, 0, 0.1);
}

.p-treetable .p-treetable-thead > tr > th:hover {
  background: #323c49 !important;
}
.p-treetable .p-treetable-thead button.p-button:first-child {
  margin-right: 18px;
}

/*.button-column > span {
  display: none;
}*/
</style>
