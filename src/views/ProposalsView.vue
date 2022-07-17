<script setup lang="ts">
import TempCode from '../components/_TempCode.vue'
import Prisma from '@prisma/client'

//const prisma = new Prisma.PrismaClient('https://humania.up.railway.app/todos')
//const todos = await prisma.todo.findMany()
//console.clear()
//console.log(todos)
</script>

<template>
  <div class="padded-page">
    <h1>This is the proposals page</h1>
    <TempCode></TempCode>
  </div>
</template>
