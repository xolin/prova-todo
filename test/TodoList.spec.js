import { mount } from '@vue/test-utils'
import TodoList from '@/components/TodoList.vue'

describe('TodoList', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(TodoList)
    expect(wrapper.vm).toBeTruthy()
  }),
  test('text is correct', () => {
    const wrapper = mount(TodoList)
    expect(wrapper.find('h2').text()).toContain('TO DO')
  }),
  test('addTask method is working', () => {
    const wrapper = mount(TodoList)
    wrapper.find('input')//buscar la manera de afegir contingut per a que faci el @change
    expect(wrapper.find)
  })
})
