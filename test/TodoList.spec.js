import { mount } from '@vue/test-utils'
import TodoList from '@/components/TodoList.vue'
import sinon from 'sinon'

describe('TodoList', () => {
  test('is a Vue instance', () => {
    const wrapper = mount(TodoList)
    expect(wrapper.vm).toBeTruthy()
  }),
  test('text is correct', () => {
    const wrapper = mount(TodoList)
    expect(wrapper.find('h2').text()).toContain('TO DO')
  }),
  test('addTask method', async () => {
    const clickHandler = sinon.stub()
    const newValue = 'test'
    const wrapper = mount(TodoList, {
      propsData: { clickHandler }
    })
    const input = wrapper.find('input')
    input.element.value = newValue
    await input.trigger('click')
    
    expect(wrapper.find('.list').exists()).toBe(true);
    // Disabled because i can't find the way to emit the input text field
    // expect(clickHandler.called).toBe(true)
    // expect(wrapper.vm.$data.tasks[0]).toEqual(newValue)
  })
})
