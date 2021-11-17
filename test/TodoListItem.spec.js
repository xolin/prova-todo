import { mount } from '@vue/test-utils'
import TodoListItem from '@/components/TodoListItem.vue'
import sinon from 'sinon'
import Vue from 'vue'

describe('TodoListItem', () => {
  test('removeTask method', async () => {
    const onClick = jest.fn()
    const taskTemp = { id: 1636998691369, text: "Wash dishes", done: false }
    const wrapper = mount(TodoListItem, {
      propsData: {
        task: taskTemp,
        click: onClick
      },
    })
    wrapper.find(".remove").trigger('click', {button: 0})
    await wrapper.vm.$emit("update-list")
    await Vue.nextTick();
    expect(onClick).toHaveBeenCalled()
    expect(wrapper.emitted('update-list')).toBeTruthy()
    expect(wrapper.props().task).toEqual(undefined)
  }),
  test('toggleTaskState method', async () => {
    const onClick = jest.fn()
    const taskTemp = { id: 1636998691369, text: "Call doctor", done: false }
    const wrapper = mount(TodoListItem, {
      propsData: {
        task: taskTemp,
        click: onClick
      },
    })
    
    await wrapper.find("button.toggle").trigger("click")
    await Vue.nextTick();
    expect(onClick).toHaveBeenCalled()
    wrapper.vm.$emit("update-list")

    expect(wrapper.emitted('update-list')).toBeTruthy()
    expect(wrapper.props().task.done).toEqual(true)
  })

})
