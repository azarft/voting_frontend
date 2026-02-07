<script setup lang="ts">
import { getOptionLabel, type VotingOption } from '../types/voting'

interface Props {
  option: VotingOption
  selected: boolean
  disabled?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits<{ (event: 'select', optionId: number): void }>()

const handleSelect = () => {
  if (props.disabled) return
  emit('select', props.option.id)
}
</script>

<template>
  <button
    class="option-card"
    type="button"
    :class="{ selected, disabled: disabled }"
    :disabled="disabled"
    @click="handleSelect"
  >
    <div class="option-title">{{ getOptionLabel(option) }}</div>
  </button>
</template>

<style scoped>
.option-card {
  border: 1px solid transparent;
  border-radius: 18px;
  padding: 20px 22px;
  background: #202530;
  color: inherit;
  text-align: left;
  cursor: pointer;
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  min-height: 90px;
}

.option-card:hover:not(.disabled) {
  transform: translateY(-2px);
  border-color: #3f7bff;
  box-shadow: 0 10px 24px rgba(15, 25, 45, 0.45);
}

.option-card.selected {
  border-color: #58f2aa;
  box-shadow: 0 12px 26px rgba(88, 242, 170, 0.18);
}

.option-card.disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.option-title {
  font-size: 1.15rem;
  font-weight: 600;
}

</style>
