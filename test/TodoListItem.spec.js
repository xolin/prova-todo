import { mount } from '@vue/test-utils'
import TodoListItem from '@/components/TodoListItem.vue'
import sinon from 'sinon'

describe('TodoListItem', () => {
  // test('is a Vue instance', () => {
  //   const wrapper = mount(TodoList)
  //   expect(wrapper.vm).toBeTruthy()
  // }),
  // test('text is correct', () => {
  //   const wrapper = mount(TodoList)
  //   expect(wrapper.find('h2').text()).toContain('TO DO')
  // }),

  test('removeTask method', async () => {
    const clickHandler = sinon.stub()
    const taskTemp = { id: 1636998691369, text: "ssadasd", done: false }
    const wrapper = mount(TodoListItem, {
      propsData: {
        task: taskTemp,
        clickHandler,
      },
    })
    const remove = wrapper.find(".remove")
    await remove.trigger("click")
    wrapper.vm.$emit("update-list")

    //I got stuck here because I can't broadcast an event using jest. I don't know what's wrong, I can't find much information online
    //expect(clickHandler.called).toBe(true)
  })

})
