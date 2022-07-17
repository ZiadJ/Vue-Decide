  {
    columnKey: '0',
    field: 'add',
    header: '',
    style: 'width: 20px !important',
    class: 'button-column'
  },



        <template #body="slotProps" v-if="col.dataType == 'button-column'">
        <template #header>
          <Button type="button" icon="pi pi-cog"></Button>
        </template>
        <template #body>
          <Button
            type="button"
            icon="pi pi-plus"
            class="p-button-warning"
            @click="addNode"
          >
          </Button>
        </template>
      </template>