<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import { Gridcell, FormData } from "../interfaces/WarehouseRobotInterface";

const rows = 10;
const cols = 10;

const grid: Gridcell[][] = Array.from({ length: rows }, (_, rowIndex) =>
  Array.from({ length: cols }, (_, colIndex) => ({
    x: colIndex,
    y: rowIndex,
  }))
);

const robotPosition = ref<Gridcell>({ x: 0, y: 9 }); // Initial position at south-west corner

const errors = ref<FormData>({
  command: "",
});

const formData = reactive<FormData>({
  command: "",
});

const isCommandValid = computed(() => formData.command.trim() !== "");

const validateField = (field: keyof FormData) => {
  errors.value[field] = "";
  if (field === "command" && !isCommandValid.value) {
    errors.value.command = "Command is required.";
  }
};

// Function to get cell class based on position
const getCellClass = (row: number, col: number) => {
  return (
    "border border-gray-300 w-12 h-12 " +
    (robotPosition.value.x === col && robotPosition.value.y === row
      ? "bg-blue-500 text-white "
      : "bg-gray-100")
  );
};

const moveRobot = (commands: string[]) => {
  for (const command of commands) {
    switch (command) {
      case "N":
        if (robotPosition.value.y > 0) robotPosition.value.y--;
        break;
      case "S":
        if (robotPosition.value.y < 9) robotPosition.value.y++;
        break;
      case "W":
        if (robotPosition.value.x > 0) robotPosition.value.x--;
        break;
      case "E":
        if (robotPosition.value.x < 9) robotPosition.value.x++;
        break;
      default:
        // Invalid command
        break;
    }
  }
};

const handleSubmit = () => {
  errors.value.command = ""; // Clear previous errors
  validateField("command");

  // Convert commands to uppercase and split by whitespace
  const commandList = formData.command.trim().toUpperCase().split(" ");

  moveRobot(commandList);

  formData.command = "";
};
</script>

<template>
  <div class="container">
    <div class="flex flex-col justify-center items-center h-screen w-screen">
      <div class="flex flex-row my-10 w-96">
        <form @submit.prevent="handleSubmit">
          <div class="flex flex-row gap-2 w-full h-auto">
            <input
              type="text"
              v-model="formData.command"
              placeholder="Enter a command"
              name="command"
              id="command"
              class="rounded-lg"
            />

            <button
              class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none"
              type="submit"
            >
              Submit
            </button>
          </div>
          <div>
            <span
              class="error text-red-400"
              v-if="errors.command && !isCommandValid"
              >{{ errors.command }}</span
            >
          </div>
        </form>
      </div>
      <div class="grid gap-1">
        <div
          v-for="(row, rowIndex) in grid"
          :key="rowIndex"
          class="flex flex-row"
        >
          <div
            v-for="(cell, cellIndex) in row"
            :key="cellIndex"
            :class="getCellClass(cell.y, cell.x)"
            :data-x="cell.x"
            :data-y="cell.y"
          >
            <div
              v-if="robotPosition.x === cell.x && robotPosition.y === cell.y"
              class="flex items-center justify-center h-full w-full"
            >
              <i class="fa-solid fa-robot"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
